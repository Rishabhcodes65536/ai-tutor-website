import mongoose from "mongoose"

const API_ENDPOINT=process.env.API_ENDPOINT;

class questionContoller{
    static getTopics=async (req,res)=>{
    const topicId = req.params.id;
    // Fetch topics from your database or wherever you store them
    const topics = [
        { id: 1, name: 'Differentiation' },
        { id: 2, name: 'Integration' },
        { id: 3, name: 'Algebra' }
    ];
    // Render the topic selection page
    res.render('topic.ejs', { topics });
    }
    static fetchApi=async (req,res)=>{
        try {
            const response = await axios.post(API_ENDPOINT, {
            question:req.query.topic
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });

        } catch (err) {
            console.log(err);
        }
    }
    static handleSolution=async (req,res)=>{
        res.render(verdict.ejs);
    }
}

export default questionContoller;