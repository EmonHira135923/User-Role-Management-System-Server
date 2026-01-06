import express from "express";
import { GetMyProfileController, LoginController, LogoutController } from "../controllers/auth.controller.js";
import {  ValidateLoginFields } from "../middlewares/validate.middlewares.js";
import { verifyAdmin, VerifyToken } from "../middlewares/auth.middleware.js";
import { DeleteUserByAdmin, GetAllUsers, GetSingleUserbyAdmin, UpdateUserByAdmin } from "../controllers/users.controller.js";

const router = express.Router();


router.post("/auth/login",ValidateLoginFields,LoginController);
router.get("/auth/me",VerifyToken,GetMyProfileController);
router.post("/auth/logout",VerifyToken,LogoutController);

// Auth Routes
// Admin only
router.get("/users", VerifyToken, verifyAdmin, GetAllUsers);
router.get("/users/:email",VerifyToken,verifyAdmin,GetSingleUserbyAdmin);
router.patch("/users/:email",VerifyToken,verifyAdmin,upload.single("image"),UpdateUserByAdmin);
router.delete("/users/:email", VerifyToken, verifyAdmin, DeleteUserByAdmin);

export default router