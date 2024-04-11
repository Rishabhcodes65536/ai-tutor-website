import express from "express"
import web from "./routes/userRoute.js"
import quesRoute from "./routes/questionRoute.js"
import handlerRoute from "./routes/handlerRoute.js"

const app=express()
const port=process.env.PORT || '3000'
const DATABASE_URI=process.env.DATABASE_URI || "mongodb://localhost:27017/"
import connectDB from "./db/connectdb.js";

app.use(express.static('public'))

connectDB(DATABASE_URI);

app.use(express.urlencoded({extended:false}))

app.use("/",web)
app.use("/topic",quesRoute)
app.use("/answer",handlerRoute)

app.listen(port,() =>{
    console.log(`Server listening at https://localhost:${port}`)
})
