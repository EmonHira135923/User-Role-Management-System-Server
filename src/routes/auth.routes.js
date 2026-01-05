import express from "express";
import { GetMyProfileController, LoginController, LogoutController } from "../controllers/auth.controller.js";
import {  ValidateLoginFields } from "../middlewares/validate.middlewares.js";
import { VerifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/auth/login",ValidateLoginFields,LoginController);
router.get("/auth/me",VerifyToken,GetMyProfileController);
router.post("/auth/logout",VerifyToken,LogoutController);

export default router