import mongoose from "mongoose"
import axios from "axios"
import crypto from "crypto"
import questionModel from "../models/question.js";
import ejsLint from 'ejs-lint'
import MetaquestionModel from "../models/metacognition.js";

class questionController{    

    static getModes=async (req,res)=>{
        res.render('quiz.ejs',{
            "user":req.session.name.split(' ')[0]
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
    { id: 6, name: 'Statistics' },
    { id: 7, name: 'Probability' },
    { id: 8, name: 'Linear Algebra' },
    { id: 9, name: 'Number Theory' }
    ];
    console.log(req.session._id);
    console.log(modeName);
    if (req.session._id) {
            res.render('topic.ejs', { topics, "id":req.session._id,"user":req.session.name.split(' ')[0],"mode":modeName});
    }
    else{
        res.render("login.ejs");
    }

    // res.render('dashboard.ejs',{"user":req.session._id});
}
    static fetchApi=async (req,res)=>{
        try {
            const latestQuestion = await questionModel.find({ topic: req.query.topic, student_id: req.session._id }).sort({ attempted_at: -1 }).limit(1).select('question');
            // console.log(latestQuestion.question);
            const past_question=latestQuestion[0] ? (latestQuestion[0].question) : ("");
            console.log("PAST QUESTION IS:"+past_question);
            // console.log(req);
            const API_ENDPOINT=req.API_ENDPOINT;
            console.log(API_ENDPOINT);
            console.log(req.query.topic + " problem")
            let response = await axios.post(API_ENDPOINT, {
            question:req.query.topic + " problem",
            past_question,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        // let parsed_string=JSON.parse(response.data.response);
        console.log(response); 
        const parsed_string=response.data.response;
        console.log(parsed_string);
        // let jsonString = response.data.response.match(/```json([\s\S]*)```/)[1].trim();

        // let parsed_string = JSON.parse(jsonString);
        if(parsed_string && parsed_string.question){
        console.log("YEPPP!");
        req.question=parsed_string.question;
        req.marks=parseInt(parsed_string.marks);
        // res.set('question',parsed_string.question);
        // res.set('marks',parsed_string.marks);
        // console.log(res.headers);
        res.render('\answer.ejs',{
            "data":parsed_string,
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
                const response = await axios.post(req.API_ENDPOINT, {
                    "question":Question
                });
                console.log(response)
                let isQuestion= response.data.response.question;

                if(isQuestion){
                    console.log("yepp");
                const { question, steps , marks} = response.data.response;
                console.log(steps)
                // Pair the steps with their order and sort by order
                
                const orderedSteps = steps;

                // Shuffle the ordered steps to jumble the order
                const shuffledSteps = questionController.shuffleArray(orderedSteps);
                const correctOrder=shuffledSteps.map(step => step.order);
                const solutionStepsArray = shuffledSteps.map(step => step.solution_step);


                // Encapsulate each solution_step string in quotes
                const quotedStrings = solutionStepsArray.map(step => `"${step}"`);

                // Join all quoted strings using a delimiter that is unlikely to appear in the strings
                const joinedString = quotedStrings.join('|'); // Use '|' or any other delimiter

                // Now split the joined string using the delimiter
                const newArray = joinedString.split('|'); // Use the same delimiter

                // Remove quotes from each element in newArray
                const finalArray = newArray.map(item => item.replace(/^"(.*)"$/, '$1'));
                console.log(solutionStepsArray);
                console.log(correctOrder);
                res.render('metacognition.ejs', { question, steps:finalArray, correctOrder,"topic":Question,"total_marks":marks});
                }
                else{
                    console.log("NOPEE!!")
                    res.redirect(req.get('referer'));
                }
        } catch (error) {
            console.error('Error fetching metacognition question mode data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    static handleSolution=async (req,res)=>{
        try {
        // Extract data from the form submission
        
        console.log(req.body);
        const {solution,question,marks,final_answer} = req.body;
        if(!solution){
            solution="";
        }
        if(!final_answer){
            final_answer="";
        }
        // const { question, marks } = req.body;
        console.log(solution,question,marks,final_answer);
        // Make POST request to the API
        const SOLUTION_API=req.SOLUTION_API_ENDPOINT;
        const response_from_api = await axios.post(SOLUTION_API, {
            question:question,
            marks:marks,
            answer: solution,
            final_answer:final_answer
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
        console.log(req.body.topic);
        res.render('answer.ejs', {
            "data":obj,
            "topic":req.body.topic,
            "abcd":response_from_api.data,
            "user_solution":solution,
            "final_answer":final_answer
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    }
    static handleMetaSolution=async (req,res)=>{
        try {
        // Extract data from the request
        console.log(req.body);
        const { question, steps, correctOrder, topic, total_marks,userResponse} = req.body;
        console.log(question,steps,correctOrder,topic,total_marks,userResponse);
        const submittedOrder = req.body.userResponse.map(Number);
        const correctOrderArray = Array.isArray(correctOrder) ? correctOrder : correctOrder.split(',');
        const correctOrderNumbers = correctOrderArray.map(Number);
        let isCorrect = true;
        const rishabhArray = [];
        const newsteps=[];
        for (let i = 0; i < correctOrder.length; i++) {
        if (correctOrderNumbers[i] != userResponse[i]) {
            console.log(correctOrderNumbers[i]);
            console.log(userResponse[i]);
            isCorrect = false;
            rishabhArray.push(0);
        }
        else{
            rishabhArray.push(1);
        }
        }
        console.log(newsteps);
        console.log(question,steps,correctOrder,correctOrderNumbers,topic,total_marks,submittedOrder,isCorrect);
        let allocated_marks=0;
        if(isCorrect){
            allocated_marks=total_marks;
        }
        const rishData=[];
        console.log(rishabhArray);
        var feedback="";
        if(isCorrect){
            feedback="Correct Answer!!";
        }
        else{
            feedback="Wrong answer!!";
        }
        const questionDoc= new questionModel({
            student_id:req.session._id,
            question:question,
            student_response:JSON.stringify(steps),
            topic:topic,
            total_marks:total_marks,
            allocated_marks:allocated_marks,
            feedback:feedback,
            mode:'metacognition'
        })
        const mongoSving=await questionDoc.save();
        console.log(mongoSving);
        res.render('metacognition.ejs', { 
            question, 
            steps:steps, 
            correctOrder:correctOrderNumbers, 
            topic, 
            total_marks,
            submittedOrder,
            isCorrect,
            allocated_marks,
            rishabhArray
        });
    } catch (error) {
        console.error('Error handling metacognition solution:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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