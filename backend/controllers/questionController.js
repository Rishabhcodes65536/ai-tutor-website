import mongoose from "mongoose"
import axios from "axios"


class questionContoller{
    static getTopics=async (req,res,API_ENDPOINT)=>{
    const topicId = req.params.id;
    const topics = [
        { id: 1, name: 'Differentiation' },
        { id: 2, name: 'Integration' },
        { id: 3, name: 'Algebra' }
    ];

    res.render('topic.ejs', { topics });
    }
    static fetchApi=async (req,res)=>{
        try {
            console.log(req);
            const API_ENDPOINT=req.API_ENDPOINT;
            console.log(API_ENDPOINT);
            let response = await axios.post(API_ENDPOINT, {
            question:req.query.topic,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        // res.json(response);
        console.log(response);
        let parsed_string=eval(response.data.response);
        console.log(parsed_string);
        res.render('\answer.ejs',{
            "question":parsed_string[0].question
            });
        } catch (err) {
            console.log(err);
        }
    }
    static handleSolution=async (req,res)=>{
        res.render(verdict.ejs,{topic:req.body.answer});
    }
}

export default questionContoller;