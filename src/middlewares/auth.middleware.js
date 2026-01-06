import jwt from "jsonwebtoken";

export const VerifyToken = (req,res,next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized Person",success:false });

    // jwt verify
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return res.status(403).json({ message: "Invalid Token",success:false }); 
        }
        req.user = decoded;
        // console.log("users",req.user)
        next();
    })
}


export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
    next();
};