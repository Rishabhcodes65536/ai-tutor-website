import express from "express";
const router=express.Router()
import questionController from "../controllers/questionController.js";
import sessionCheckMiddleware from "../middlewares/sessioncheck.js";
router.use(sessionCheckMiddleware);

router.get("/",questionController.fetchApi)
router.post("/",questionController.handleSolution)

export default router;