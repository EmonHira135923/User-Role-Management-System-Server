import dotenv from "dotenv";
dotenv.config();
import {MongoClient,ServerApiVersion} from "mongodb";

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@user-role-management-sy.gpf7qmk.mongodb.net/?appName=User-Role-Management-System`;

// client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let userCollection

export const connectDB = async() => {
    try{
        await client.connect();
        db = client.db("User-Role-Management-System");
        userCollection = db.collection("users");
        console.log("MongoDB Connection Successfully");
    }
    catch(err){
        console.error("DB Connection Failed",err.message);
        process.exit(1);
    }
}

export const getDB = () => db;
export const getUsers = () => userCollection;