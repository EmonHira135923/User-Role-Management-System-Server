import { getUsers } from "../config/db.js"

// Create Users
export const CreateUser = async(req,res) => {
    try{
        const userCollection = getUsers();
        // console.log("UsersCollection",userCollection);
        const query = req.body;
        // console.log("Query",query);
        const result = await userCollection.insertOne(query);
        res.status(201).json({
            message:"Users Created Successfully",
            success:true,
            result:result.data
        });
    }
    catch(err){
        res.status(404).json({
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
        res.status(404).send(err.message);
    }
}