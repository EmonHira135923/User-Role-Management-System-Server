import { getUsers } from "../config/db.js"
import bcrypt from "bcrypt";
import { createUser } from "../models/users.schema.js";
import cloudinary from "../config/cloudinary.js";

// Create Users
export const CreateUserController = async(req,res) => {
    try{
        const userCollection = getUsers();
        const {name,email,password,phone,image} = req.body;
        const hasedpassword = await bcrypt.hash(password,10);

        let imagedata = {
            url:null,
            public_id:null
        }

        if(req.file){
            const imageresult  = await cloudinary.uploader.upload(req.file.path,{
                folder:"users"
            });

            imagedata = {
                url: imageresult.secure_url,
                public_id:imageresult.public_id
            }
        }

        const query = createUser({
            name,
            email,
            password:hasedpassword,
            phone,
            image:imagedata,
            role:"user"
        })


        const result = await userCollection.insertOne(query);
        res.status(201).json({
            message:"Users Created Successfully",
            success:true,
            result:result
        });
    }
    catch(err){
        res.status(400).json({
            message:"Users Not Created yet.",
            success:false,
            err:err.message
        })
    }
}

// Get Users
export const GetUsersController = async(req,res) => {
    try{
        const userCollection = getUsers();
        const query =  userCollection.find();
        const result = await query.toArray();
        res.status(200).send(result);
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// Get User By Id
export const GetUsersByIdController = async(req,res) => {
    try{
        const userCollection = getUsers();
        const {email} = req.params;
        const query = {email};
        const result = await userCollection.findOne(query) ;
        console.log("result ",result)
        if(!result){
            res.status(400).json({
                message:"Users Not Find",
                success:false
            })
        }
        res.status(200).send(result);
    }
    catch(err){
        return res.status(404).json({
            message:"User Not Found Here!!! Try To Registration",
            success:false
        })
    }


}

// Update user and also image update also
export const UpdateUserControllerById = async (req, res) => {
    try {
        const userCollection = getUsers();
        const {email} = req.params;
        const {phone} = req.body;
        const query = {email};

        const oldUser = await userCollection.findOne(query);

        let image = null;

        if (req.file) {

        if (oldUser?.image?.public_id) {
        await cloudinary.uploader.destroy(oldUser.image.public_id);
      }

        const imgResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "users"
        });

        image = {
            url: imgResult.secure_url,
            public_id: imgResult.public_id
        };
        }

        const updatedata = {
            $set:{
                phone,
                image,
                updatedAt: new Date()
            }
        }

        const option = {};

        const result = await userCollection.updateOne(query,updatedata,option);

        res.status(200).json({
            message: "Updated successfully",
            success: true,
            result
        });

    } catch (err) {
        res.status(500).json({
            message: "Update failed",
            success: false
        });
    }
};

// Delete User and also img in cloudinary
export const DeleteUserController = async(req,res) => {
    try{
    const  userCollection = getUsers();
    const {email} = req.params;
    const query = {email};

    // ✅ STEP 1: আগে user খুঁজে বের করি
    const user = await userCollection.findOne(query);

    // ✅ STEP 2: যদি image থাকে → cloudinary থেকে delete
    if (user?.image?.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
    }

    const result = await userCollection.deleteOne(query);
    res.status(200).json({
        message:"User Deleted Succesfully",
        success:true,
        result});
    }
    catch(err){
        return res.status(400).json({
            message: "Not deleted data",
            success:false,
            err:err.message
        })
    }

};