import express from "express";
import { ProjectStartController } from "../controllers/projectStart.controller.js";







const router = express.Router();

router.get("/",ProjectStartController);

export default router;