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
        if (req.session._id) {
            res.redirect("/dashboard");
        }
        else{
        res.render("login.ejs");
        }
    }
    static createUserDoc = async (req,res) =>{
        try {
            console.log(req.body);  
            const hashed_password=await bcrypt.hash(req.body.password,10)
            const doc=new userModel({
                name:req.body.name,
                email:req.body.email,
                password:hashed_password,
                occupation:req.body.occupation
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
            const kkk=await userModel.findOne({email:req.body.email})
            console.log(req.body.password);

            if(kkk!=null){
                await bcrypt.compare(req.body.password,kkk.password,).then((resul)=>{
                    console.log(resul)
                    if(resul){
                        req.session._id = kkk._id;
                        req.session.name= kkk.name;
                        req.session.student_id=kkk.student_id;
                        res.set('user_id', kkk._id);
                        res.redirect(`/dashboard`);
                    }
                    else{
                    res.send(`<h1>Incorrect password</h1>`)
                    }
                });
                }
            else{
                res.redirect('/register')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default userController;