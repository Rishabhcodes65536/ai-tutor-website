import express from "express"
import { join } from "path"
import web from "./routes/userRoute.js"

const app=express()
const port=process.env.PORT || '3000'
const DATABASE_URI=process.env.DATABASE_URI || "mongodb://localhost:27017/"
import connectDB from "./db/connectdb.js";
import userController from "./controllers/userController.js"


connectDB(DATABASE_URI);

app.use(express.urlencoded({extended:false}))

app.use("/",web)

app.listen(port,() =>{
    console.log(`Server listening at https://localhost:${port}`)
})
