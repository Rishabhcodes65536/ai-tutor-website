import express from "express";
const router=express.Router()
import questionController from "../controllers/questionController.js";

router.get("/",questionController.fetchApi)
router.post("/",questionController.handleSolution)

export default router;
