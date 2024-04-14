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
    res.render('topic.ejs', { topics, "id":req.query.user});
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
        // const questionDoc= new questionModel({
        //     student_id:req.query.user,
        //     question:parsed_string[0].question,
        //     topic:req.query.topic,
        //     total_marks:parsed_string[0].marks,
        //     feedback:""
        // })
        // const mongodbSaving=await questionDoc.save();
        // console.log(mongodbSaving);
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
            student_id:req.query.user,
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
            "abcd":response_from_api.data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    }
}

export default questionContoller;