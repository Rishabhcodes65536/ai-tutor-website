import express from "express";
const router=express.Router()
import userController from "../controllers/userController.js";
import userModel from "../models/user.js";

const fetchUserName = async (req, res, next) => {
    try {
        if (req.session._id && !req.session.name) {
            const user = await userModel.findById(req.session._id);
            if (user) {
                req.session.name = user.name;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Register fetchUserName middleware in your controller
router.use(fetchUserName);

router.get("/",userController.login)
router.post("/",userController.validateLogin)
router.get("/login",userController.login)
router.post("/login",userController.validateLogin)
router.get("/register",userController.register)
router.post("/register",userController.createUserDoc)



export default router