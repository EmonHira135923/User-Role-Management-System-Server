import express from "express";
import { CreateUser, GetUsers } from "../controllers/users.controller.js";
import { CheckUniqueUser, ValidateFields } from "../middlewares/validate.middlewares.js";
import upload from "../middlewares/multer.config.js";

const router = express.Router();


// Users Route
router.post("/auth/register",upload.single("image"),ValidateFields,CheckUniqueUser,CreateUser);
router.get("/auth/register",GetUsers);

export default router;