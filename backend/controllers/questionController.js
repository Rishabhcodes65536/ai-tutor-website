import mongoose from "mongoose"
import axios from "axios"
import crypto from "crypto"
import questionModel from "../models/question.js";
import MetaquestionModel from "../models/metacognition.js";

class questionController{    

    static getModes=async (req,res)=>{
        res.render('quiz.ejs',{
            "user":req.session.name
        });
    }
    static getTopics=async (req,res,API_ENDPOINT)=>{
    const modeName = req.params.mode;
    const topics = [
    { id: 1, name: 'Differentiation' },
    { id: 2, name: 'Integration' },
    { id: 3, name: 'Algebra' },
    { id: 4, name: 'Geometry' },
    { id: 5, name: 'Trigonometry' },
    { id: 6, name: 'Calculus' },
    { id: 7, name: 'Statistics' },
    { id: 8, name: 'Probability' },
    { id: 9, name: 'Linear Algebra' },
    { id: 10, name: 'Number Theory' }
    ];
    console.log(req.session._id);
    console.log(modeName);
    if (req.session._id) {
            res.render('topic.ejs', { topics, "id":req.session._id,"user":req.session.name,"mode":modeName});
    }
    else{
        res.render("login.ejs");
    }

    // res.render('dashboard.ejs',{"user":req.session._id});
}
    static fetchApi=async (req,res)=>{
        try {
            // console.log(req);
            const API_ENDPOINT=req.API_ENDPOINT;
            console.log(API_ENDPOINT);
            console.log(req.query.topic + " problem")
            let response = await axios.post(API_ENDPOINT, {
            question:req.query.topic + " problem",
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        // let parsed_string=JSON.parse(response.data.response);
        // console.log(parsed_string); 
        let jsonString = response.data.response.match(/```json([\s\S]*)```/)[1].trim();

        let parsed_string = JSON.parse(jsonString);
        if(parsed_string){
        console.log("YEPPP!");
        req.question=parsed_string[0].question;
        req.marks=parsed_string[0].marks;
        res.set('question',parsed_string[0].question);
        res.set('marks',parsed_string[0].marks);
        console.log(res.headers);
        res.render('\answer.ejs',{
            "data":parsed_string[0],
            "topic":req.query.topic,
            });
        }
        else{
            console.log("NOPEE!!")
            res.redirect(req.get('referer'));
        }
        }
         catch (err) {
            console.log(err);
        }
    }
    static fetchMetaApi=async (req,res)=>{
       try {
            const Question = req.query.topic;

            // Make API call to fetch data
            const response = await axios.post("http://20.42.62.249:8081/internal/question_generation/analyse/multi", {
                "question":Question
            });
            console.log(response)
            // Extract question and steps from the API response
            const { question, steps , marks} = response.data.response;
            console.log(steps)
            // Pair the steps with their order and sort by order
            const orderedSteps = steps.map(step => ({
                order: step.order,
                solution_step: step.solution_step
            })).sort((a, b) => a.order - b.order);

            // Shuffle the ordered steps to jumble the order
            const shuffledSteps = questionController.shuffleArray(orderedSteps);

            // Generate a hashed string representing the correct order
            const correctOrderHash = questionController.hashOrder(orderedSteps);

            res.render('metacognition.ejs', { question, steps:shuffledSteps, correctOrderHash,"topic":Question,"total_marks":marks});
        } catch (error) {
            console.error('Error fetching metacognition question mode data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static handleSolution=async (req,res)=>{
        try {
        // Extract data from the form submission
        
        console.log(req.body);
        const {solution,question,marks} = req.body;
        // const { question, marks } = req.body;
        console.log(solution,question,marks);
        // Make POST request to the API
        const SOLUTION_API=req.SOLUTION_API_ENDPOINT
        const response_from_api = await axios.post(SOLUTION_API, {
            question:question,
            marks:marks,
            answer: solution
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        console.log(response_from_api.data);
         const questionDoc= new questionModel({
            student_id:req.session._id,
            question:question,
            student_response:solution,
            topic:req.query.topic,
            total_marks:marks,
            allocated_marks:response_from_api.data.response.marks_awarded_to_student,
            feedback:response_from_api.data.response.feedback
        })
        const mongodbSaving=await questionDoc.save();
        console.log(mongodbSaving);
        const obj={
            question:question,
            marks:marks
        }
        res.render('answer.ejs', {
            "data":obj,
            "topic":req.body.topic,
            "abcd":response_from_api.data,
            "user_solution":solution
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    }
    static handleMetaSolution=async (req,res)=>{
       try {
            const { correctOrderHash} = req.body; // Correct order hash sent from client
            const userOrder = req.body.userOrder; // User's submitted order
            const userOrderHash = questionController.hashOrder(userOrder); // Hash the user's submitted order
            
            // Check if the user's order hash matches the correct order hash
            const isCorrect = userOrderHash === correctOrderHash;

            // Allocate marks based on correctness
            const allocatedMarks = isCorrect ? 5 : 0;

            // Save the solution in the database
            const { student_id, question, topic, total_marks} = req.body;
            const newMetacognition = new MetaquestionModel({
                student_id,
                question,
                student_response: JSON.stringify(userOrder), // Save user's order as a string
                topic,
                total_marks,
                allocated_marks: isCorrect ? total_marks : 0, // Allocate full marks if correct, else 0
                steps: userOrder // Save user's order steps
            });
            await newMetacognition.save();
        res.render('meta_answer.ejs', {
            "data":obj,
            "topic":req.body.topic,
            "abcd":response_from_api.data,
            "user_solution":solution
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    static hashOrder(orderedSteps) {
        const orderedSolutionSteps = orderedSteps.map(step => step.solution_step).join(',');
        return crypto.createHash('sha256').update(orderedSolutionSteps).digest('hex');
    }
}

export default questionController;