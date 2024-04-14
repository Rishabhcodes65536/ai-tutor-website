import express from "express"
import web from "./routes/userRoute.js"
import quesRoute from "./routes/questionRoute.js"
import handlerRoute from "./routes/handlerRoute.js"
import dotenv from "dotenv"


dotenv.config();

const app=express()
const port=process.env.PORT || '3000'
const API_ENDPOINT=process.env.API_ENDPOINT
const SOLUTION_API_ENDPOINT=process.env.SOLUTION_API_ENDPOINT
console.log(API_ENDPOINT)
const DATABASE_URI=process.env.DATABASE_URI || "mongodb://localhost:27017/"
import connectDB from "./db/connectdb.js";



app.use(express.static('public'))

connectDB(DATABASE_URI);

app.use(express.urlencoded({extended:false}))

app.use("/",web)
app.use("/topic",quesRoute)
app.use("/answer", (req, res, next) => {
    req.API_ENDPOINT =API_ENDPOINT;
    req.SOLUTION_API_ENDPOINT=SOLUTION_API_ENDPOINT;
    next();
}, handlerRoute);


app.listen(port,() =>{
    console.log(`Server listening at https://localhost:${port}`)
})
