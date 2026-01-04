import { getUsers } from "../config/db.js"
import bcrypt from "bcrypt";
import { createUser } from "../models/users.schema.js";
import cloudinary from "../config/cloudinary.js";

// Create Users
export const CreateUser = async(req,res) => {
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
export const GetUsers = async(req,res) => {
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