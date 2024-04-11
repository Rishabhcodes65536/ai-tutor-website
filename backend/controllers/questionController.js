import mongoose from "mongoose"
import axios from "axios"
const API_ENDPOINT=process.env.API_ENDPOINT;

class questionContoller{
    static getTopics=async (req,res)=>{
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
            let response = await axios.post(API_ENDPOINT, {
            question:req.query.topic
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });
        res.json(response);
        } catch (err) {
            console.log(err);
        }
    }
    static handleSolution=async (req,res)=>{
        res.render(verdict.ejs,{topic:req.body.answer});
    }
}

export default questionContoller;