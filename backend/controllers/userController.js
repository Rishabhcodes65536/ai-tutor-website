import userModel from "../models/user.js";
import bcrypt from "bcrypt";

class userController{
    static home =(req,res)=>{
        res.render("index.ejs")
    }
    static register =(req,res)=>{
        res.render("register.ejs")
    }
    static login =(req,res)=>{
        res.render("login.ejs")
    }
    static createUserDoc = async (req,res) =>{
        try {
            const hashed_password=await bcrypt.hash(req.body.password,10)
            const doc=new userModel({
                name:req.body.name,
                email:req.body.email,
                password:hashed_password
            })
            const saved=await doc.save();
            console.log(saved)
            res.redirect('/login')
        } catch (error) {
            console.log(error)
        }
    }
    static validateLogin=async(req,res)=>{
        try {
            const result=await userModel.findOne({email:req.body.email})
            
            if(result!=null){
                if(await bcrypt.compare(result.password,req.body.password)){
                    res.send(`<h1>OK</h1>`)
                }
                else{
                    res.send(`<h1>Incorrect password</h1>`)
                }
            }
            else{
                res.send(`<h1>User not yet resistered</h1>`)
            }
            res.redirect('/login')
        } catch (error) {
            console.log(error)
        }
    }
}

export default userController;