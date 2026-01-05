import jwt from "jsonwebtoken";

export const VerifyToken = (req,res,next) => {
    const authoraization =  req.headers.authorization || null;
    if(!authoraization){
        res.status(400).json({
            message: "Unauthoraized Person !!!! Please Registration",
            success:false
        })
    }

    const token = authoraization.split(" ")[1];
    if(!token){
        res.status(400).json({
            message: "Unauthoraized Person !!!! Please Registration",
            success:false
        })
    }
    next();
}