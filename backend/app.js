import express from "express"
import web from "./routes/userRoute.js"
import quesRoute from "./routes/questionRoute.js"
import handlerRoute from "./routes/handlerRoute.js"
import dotenv from "dotenv"
import quizRoute from "./routes/quizRoute.js"
import logoutRoute from "./routes/logoutRoute.js"
import dashboardRoute from "./routes/dasboardRoute.js"
import doubtRoute from "./routes/doubtRoute.js"
import metahandlerRoute from "./routes/metaHandlerRoute.js"
import path from 'path';
import ejslint from 'ejs-lint'
import cors from "cors"
import feedbackModel from "./models/feedback.js"

const __dirname = path.resolve();

dotenv.config();

//session feature

import session from "express-session";
import connectMongo from "connect-mongo";

// Create a MongoStore instance to store sessions in MongoDB
const MongoStore = connectMongo(session);

const app=express()

app.use(cors());
app.use(express.json());
const port=process.env.PORT || '3000'
const API_ENDPOINT=process.env.API_ENDPOINT
const SOLUTION_API_ENDPOINT=process.env.SOLUTION_API_ENDPOINT
console.log(API_ENDPOINT)
const DATABASE_URI=process.env.DATABASE_URI || "mongodb://localhost:27017/"
import connectDB from "./db/connectdb.js";


//session middleware

app.use(session({
    secret: process.env.secret_key, // Change this to a secure key
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: DATABASE_URI }), // Store session data in MongoDB
    cookie: {
        maxAge: 60 * 60 * 1000*24, // Session expires after 24 hours
    }
}));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'))

connectDB(DATABASE_URI);

app.use(express.urlencoded({extended:false}))


app.use("/",web)
app.use("/topic",quesRoute)
app.use("/answer", (req, res, next) => {
    req.API_ENDPOINT =API_ENDPOINT;
    req.SOLUTION_API_ENDPOINT=SOLUTION_API_ENDPOINT;
    next();
}, handlerRoute);
app.use("/metacognition", (req, res, next) => {
    req.API_ENDPOINT =process.env.META_COGNITION_ENDPOINT;
    next();
}, metahandlerRoute);
app.use("/quiz",quizRoute)
app.use("/logout",logoutRoute);

app.use("/dashboard",dashboardRoute);
app.use("/doubt",(req,res,next)=>{
    req.API_ENDPOINT=process.env.DOUBT_API_ENDPOINT;
    next();
    },doubtRoute);



app.post('/updateFeedback', async (req, res) => {
    console.log("entered");
    console.log(req);
    const { student_id,question,feedback} = req.body;
    console.log(req.body);
    try {
        // Find the feedback document by student_id and question
        let feedbackDoc = await feedbackModel.findOne({ student_id, question });

        // If feedback document does not exist, create a new one
        if (!feedbackDoc) {
            feedbackDoc = new feedbackModel({
                student_id,
                question,
                feedback,
            });
        } else {
            // Update feedback if the document exists
            feedbackDoc.feedback = feedback;
        }

        // Save the feedback document (either new or updated)
        console.log(feedbackDoc);
        await feedbackDoc.save();

        // Respond with success message
        return res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating feedback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port,() =>{
    console.log(`Server listening at https://localhost:${port}`)
})



