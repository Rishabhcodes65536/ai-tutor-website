// controllers/doubtController.js

import axios from 'axios';
import Doubt from '../models/doubt.js';

class doubtController{


static showDoubtsPrompt = async(req, res) =>{
  try {
    // Render the doubts prompting page
    const recentDoubts = await Doubt.find({ student_id: req.session._id })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(5);
    res.render('doubt.ejs', { "name": req.session.name, "_id": req.session._id,recentDoubts});
  } catch (error) {
    console.error('Error rendering doubts prompt:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
static showSavedDoubtSummary = async (req, res) => {
  try {
    const { doubt_id } = req.params;

    // Update the timestamp of the doubt to the current time
    await Doubt.findByIdAndUpdate(doubt_id, { timestamp: new Date() });
    const doubt = await Doubt.findById(doubt_id);
    // Render the summary page with doubt details
    const question = doubt.question;
    const answer = doubt.answer;
    res.render('summary.ejs', { question, answer });
  } catch (error) {
    console.error('Error rendering doubt summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


static fetchSummary=async (req, res)=> {
  try {
    const { question} = req.body;
    const student_id=req.session._id;
    console.log(req.session.name);
    console.log(student_id);
    const response = await axios.post('http://20.42.62.249:8081/internal/question_generation/analyse/chat', {
      question,
      student_id,
      student_name:req.session.name
    });
    console.log(response);
    const answer=response.data.response;

    console.log(answer);
    const doubt = new Doubt({ question, student_id, answer});
    console.log(doubt);
    await doubt.save();
    const data = response.data;
    const formattedAnswer =await answer.replace(/\n/g, '<br>');
    res.render('summary.ejs', { answer:formattedAnswer,"question":question});
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
}

export default doubtController;