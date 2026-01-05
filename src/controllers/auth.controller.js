import { getUsers } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ObjectId } from "mongodb";


// login
export const LoginController = async(req,res) => {
    try{
        const userCollection = getUsers();
        const {email,password} = req.body;
        // console.log("login",email,password);

        // Find User by email
        const user = await userCollection.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"UnAuthoraized!!! Please Registration",
                status:false
            })
        }

        // Password Match Checked
        const isMatchedPassword = await bcrypt.compare(password,user.password);
        // console.log("after password ",isMatchedPassword);
        if(!isMatchedPassword){
            return res.status(401).json({
                message:"UnAuthoraized!!! Please Registration",
                status:false
            })
        }

        // console.log("user email",user.email);

        // const jwtkey = crypto.randomBytes(64).toString("hex");
        // console.log(jwtkey);


        // JWT TOKEN

        // Access Token
        const accessToken = jwt.sign({
            _id:user._id,
            email:user.email,
            role:user.role
        },process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
        // console.log("after token:",accessToken);

        // Refresh Token
        const refreshToken = jwt.sign({
            _id:user._id,
        },process.env.JWT_EXPIRES_KEY,{expiresIn:"7d"})

        // console.log("refresh token :",refreshToken);

        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            path:"/"
        })

        console.log("all data",)



        res.status(200).send({
            message:"Login Successfully",
            success:true,
            accessToken
        });
    }
    catch(err){
        res.status(404).json({
            message:"Login Failed!!! Try Again",
            success:false
        })
    }
    
}

// logout
export const LogoutController = async (req, res) => {
  try {
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // HTTPS হলে true হবে
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Logout Failed",
      success: false,
      err: err.message,
    });
  }
};


// me
export const GetMyProfileController = async(req,res) => {
    try{
        const userCollection = getUsers();
        const id = req.user._id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.findOne(query);
        if(!result){
            return res.status(404).json({
            message:"UnAuthoraized!!! Please Registration",
            success:false
            })
        }
        res.status(200).json(result);

    }
    catch(err){
        res.status(400).json({
            message:"Unauthoraized Person!!! Registration First",
            success:false,
            err:err.message
        })
    }
}


