import mongoose from "mongoose"
import axios from "axios"
import questionModel from "../models/question.js";

class questionContoller{
    static getTopics=async (req,res,API_ENDPOINT)=>{
    const topicId = req.params.id;
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


    res.render('topic.ejs', { topics });
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

    // Parsing the extracted JSON
        let parsed_string = JSON.parse(jsonString);
    // Parsing the extracted JSON
    // let parsed_string = JSON.parse(jsonString);
        if(parsed_string){
        console.log("YEPPP!");
        req.question=parsed_string[0].question;
        req.marks=parsed_string[0].marks;
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
    static handleSolution=async (req,res)=>{
        try {
        // Extract data from the form submission
        console.log(req.body);
        const {solution,question,marks} = req.body;
        // const { question, marks } = req.body;
        console.log(solution,question,marks);
        // Make POST request to the API
        const SOLUTION_API=req.SOLUTION_API_ENDPOINT
        const response = await axios.post(SOLUTION_API, {
            question:question,
            marks:marks,
            answer: solution
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        console.log(response.data);
        // // Extract relevant data from the API response
        // const { status, response: apiResponse, student_answer } = response.data;
        // console.log(status,response,student_answer)
        // Render the answer.ejs template with the API response data
        res.render('answer.ejs', {
            // topic: req.locals.item, // Assuming the topic is passed as locals.item
            // data: { question, marks }, // Original question and marks
            // status,
            // marksAwarded: apiResponse.marks_awarded_to_student,
            // feedback: apiResponse.feedback,
            // studentAnswer: student_answer
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    }
}

export default questionContoller;