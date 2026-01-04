import { getUsers } from "../config/db.js"

export const ValidateFields = async(req,res,next) => {
    const userCollection = getUsers();
    const {name,email,password,phone,image} = req.body;
    
    if(!name && !email && !password && !phone && !image){
        return res.status(400).json({
            message:"All Fields Are Required",
            success:false,
        })
    }

    if(!name){
        return res.status(400).json({
            message:"Name Fields Are Required",
            success: false,
        })
    }

    if(!name){
        return res.status(400).json({
            message:"Name Fields Are Required",
            success: false,
        })
    }

    if(!email){
        return res.status(400).json({
            message:"Email Fields Are Required",
            success: false,
        })
    }

    if(!phone){
        return res.status(400).json({
            message:"Phone Fields are Required",
            success:false
        })
    }


    next();
}


export const CheckUniqueUser = async(req,res,next) => {
    const userCollection = getUsers();
    const {name,email} = req.body;
    const exitsemail = await userCollection.findOne({email});
    const exitsname = await userCollection.findOne({name});

    if(exitsemail){
        return res.status(400).json({
            message:"Email Already Exits",
            success:false
        })
    }

    if(exitsname){
        return res.status(400).json({
            message:"Name Already Exits"
        })
    }

    next();

}

