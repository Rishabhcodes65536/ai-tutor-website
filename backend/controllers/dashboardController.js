import mongoose from "mongoose";
import axios from "axios"
import questionModel from "../models/question.js";



class dashboardController{
 static getQuestionStats=async (req,res) =>{
    try {
        // Retrieve questions attempted by the student
        const questions = await questionModel.find({ student_id:req.session._id});
        console.log(questions);
        // Calculate total questions attempted
        const totalQuestions = questions.length;

        // Calculate number of right answers
        const rightAnswers = questions.reduce((acc, question) => {
            // Check if the question was answered correctly
            if (question.allocated_marks === question.total_marks) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);

        // Calculate number of wrong answers
        const wrongAnswers = totalQuestions - rightAnswers;

        // Calculate percentage of right, wrong, and not attempted questions
        const notAttempted = 100 - (totalQuestions ? ((rightAnswers + wrongAnswers) / totalQuestions) * 100 : 0);

        // Prepare data for donut chart
        var chartData = [
            { label: 'Right', value: rightAnswers },
            { label: 'Wrong', value: wrongAnswers },
            { label: 'NA', value: notAttempted }
        ];
        console.log(chartData);
        res.render('dashboardone.ejs',{
            "Right":chartData[0].value,
            "Wrong":chartData[1]['value'],
            "NA":chartData[2]['value']
        })
    } catch (error) {
        console.error('Error fetching question stats:', error);
        throw error;
    }
    }
}

export default dashboardController;