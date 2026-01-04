import express from "express";
import { CreateUser, GetUsers } from "../controllers/users.controller.js";
import { CheckUniqueUser, ValidateFields } from "../middlewares/validate.middlewares.js";

const router = express.Router();


// Users Route
router.post("/auth/register",ValidateFields,CheckUniqueUser,CreateUser);
router.get("/auth/register",GetUsers);

export default router;