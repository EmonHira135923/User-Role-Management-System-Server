import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import projectStart from "../routes/projectStart.routes.js";
import users from "../routes/users.routes.js";
import auth from "../routes/auth.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());



// Routes
app.use("/",projectStart);

// User Routes
app.use("/api",users);

// Auth Routes
app.use("/api",auth)


export default app;