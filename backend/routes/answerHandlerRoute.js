import express from "express";
const router=express.Router()
import questionController from "../controllers/questionController.js";

router.get("/:id",questionController.getTopics)

export default router;