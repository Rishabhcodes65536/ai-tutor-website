import express from "express";
const router=express.Router()
import userController from "../controllers/userController.js";

router.get("/",userController.home)
router.get("/login",userController.login)
router.post("/login",userController.validateLogin)
router.get("/register",userController.register)
router.post("/register",userController.createUserDoc)



export default router