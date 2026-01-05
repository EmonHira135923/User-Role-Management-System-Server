import express from "express";
import { CreateUserController, GetUsersController, GetUsersByIdController, UpdateUserControllerbyId, DeleteUserController } from "../controllers/users.controller.js";
import { CheckUniqueUser, ValidateFields } from "../middlewares/validate.middlewares.js";
import upload from "../middlewares/multer.config.js";
import { VerifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();


// Users Route
router.post("/auth/register",upload.single("image"),ValidateFields,CheckUniqueUser,CreateUserController);
router.get("/auth/register",GetUsersController);
router.get("/auth/users/:email",GetUsersByIdController);
router.patch("/auth/users/:email",upload.single("image"),VerifyToken,UpdateUserControllerbyId);
router.delete("/auth/users/:email",VerifyToken,DeleteUserController);

export default router;