// controllers/doubtController.js

import axios from 'axios';
import Doubt from '../models/doubt.js';

class doubtController{
static saveDoubt= async(req, res)=> {
  try {
    const { question, student_id, student_name } = req.body;

    // Save the doubt to the database
    const doubt = new Doubt({ question, student_id, student_name });
    await doubt.save();

    res.status(201).json({ message: 'Doubt saved successfully', doubt });
  } catch (error) {
    console.error('Error saving doubt:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

static showDoubtsPrompt = async(req, res) =>{
  try {
    // Render the doubts prompting page
    res.render('doubt.ejs', { username: req.session.username, user_id: req.session.user_id });
  } catch (error) {
    console.error('Error rendering doubts prompt:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

static fetchSummary=async (req, res)=> {
  try {
    const { question, student_id, student_name } = req.body;
    const response = await post('http://20.42.62.249:8081/internal/question_generation/analyse/chat', {
      question,
      student_id,
      student_name
    });

    const data = response.data;
    res.render('summary', { data });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
}

export default doubtController;