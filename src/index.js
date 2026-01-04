import dotenv from "dotenv";
dotenv.config();
import app from "./app/app.js";

const port = process.env.PORT || 3000;


// start server
const StartServer = () => {
    app.listen(port,()=>{
        console.log(`User Management System is running now ${port}`)
    })
}

StartServer();