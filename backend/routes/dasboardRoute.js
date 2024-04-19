import express from "express";
const router=express.Router()
import dashboardController from "../controllers/dashboardController.js";

router.get('/',dashboardController.getQuestionStats);

export default router;