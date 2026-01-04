import express from "express";
import cors from "cors";
import projectStart from "../routes/projectStart.routes.js";
import users from "../routes/users.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Routes
app.use("/",projectStart);

// User Routes
app.use("/api",users);


export default app;