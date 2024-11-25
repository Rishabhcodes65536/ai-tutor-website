// controllers/doubtController.js

import axios from 'axios';
import Doubt from '../models/doubt.js';

class doubtController{


static showDoubtsPrompt = async(req, res) =>{
  try {
    // Render the doubts prompting page
    console.log("Entered here")
    const recentDoubts = await Doubt.find({ student_id: req.session._id })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(5);

    res.render('doubt.ejs', { "name": req.session.name.split(' ')[0], "_id": req.session._id,recentDoubts});
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
    console.log(req.query);
    var response_type_follow=req.query.response_type;
    console.log(response_type_follow);
    let response = await axios.post(req.API_ENDPOINT, {
      question,
      student_id:req.session._id,
      student_name:req.session.name,
      "response_type":response_type_follow
    });
    console.log(response);
    res.render('summary.ejs', { question, answer });
  } catch (error) {
    console.error('Error rendering doubt summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


static fetchSummary=async (req, res)=> {
  try {
    console.log(req.body);
    const { question} = req.body;
    console.log(`${question}`);
    const student_id=req.session._id;
    console.log(req.session.name);
    console.log(student_id);
    console.log(req.query);
    var response_type_new=req.query.response_type;
    console.log(response_type_new)
    const response = await axios.post(req.API_ENDPOINT, {
      question,
      student_id,
      student_name:req.session.name,
      "response_type":response_type_new
    });
    console.log(response);
    const answer=response.data.response;

    console.log(answer);
    const doubt = new Doubt({ question, student_id, answer});
    console.log(doubt);
    await doubt.save();
    const data = response.data;
    const formattedAnswer =await answer.replace(/\n/g, '<br>');
    const response_type="new_query";
    res.render('summary.ejs', { answer:formattedAnswer,"question":question});
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
}

export default doubtController;