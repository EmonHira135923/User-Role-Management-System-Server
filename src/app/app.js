import express from "express";
import cors from "cors";
import projectStart from "../routes/projectStart.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Routes
app.use("/",projectStart);


export default app;