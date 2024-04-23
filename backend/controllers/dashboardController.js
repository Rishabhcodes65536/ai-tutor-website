import mongoose from "mongoose";
import axios from "axios"
import questionModel from "../models/question.js";

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


class dashboardController{
 static getQuestionStats=async (req,res) =>{
    try {
        // Retrieve questions attempted by the student
        const questions = await questionModel.find({ student_id:req.session._id});
        // console.log(questions)
        // console.log(questions);
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
            "NA":chartData[2]['value'],
            "page_id":'1',
            "name":req.session.name
        })
    } catch (error) {
        console.error('Error fetching question stats:', error);
        throw error;
    }
    }
    static getSubjectMastery = async (req, res) => {
    try {
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

        let highestAccuracyTopic = { topic: '', accuracy: 0 };

        const accuracyData = [];
        for (const topic of topics) {
            const totalQuestions = await questionModel.countDocuments({ topic: topic.name });
            const questions = await questionModel.find({ topic: topic.name });
            const correctQuestions = questions.filter(question => question.total_marks === question.allocated_marks).length;

            const accuracy = Math.ceil(totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0);
            accuracyData.push({ topic: topic.name, accuracy: accuracy });

            if (accuracy > highestAccuracyTopic.accuracy) {
                highestAccuracyTopic = { topic: topic.name, accuracy: accuracy };
            }
        }

        console.log(accuracyData);
        console.log('Highest Accuracy Topic:', highestAccuracyTopic);
        
        res.render('dashboardtwo.ejs', { 
            accuracyData: accuracyData,
            highest_topic: highestAccuracyTopic,
            "page_id":"2",
            "name":req.session.name
         });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

static getPracticeActivityData = async (req, res) => {
        try {
            // Fetch data from the questionModel
            const questionData = await questionModel.find({"student_id": req.session._id});
            // console.log(questionData)
            // Extract topic name and count attempted questions for each topic
            const topicData = {};
            const metacognitionData = {}; // Store random values for metacognition mode
            questionData.forEach(question => {
                const topic = question.topic;
                if (!topicData[topic]) {
                    topicData[topic] = 1; // Initialize count to 1 for new topic
                } else {
                    topicData[topic]++; // Increment count for existing topic
                }

                // Generate random values for metacognition mode (assuming range from 0 to 100)
                metacognitionData[topic] = getRandomInt(0, 3);
            });

            // Respond with the extracted topic data and metacognition data
            res.render('dashboardthree.ejs', { 
                topicData: topicData,
                metacognitionData: metacognitionData, // Pass metacognition data to frontend
                topicVariables: Object.keys(topicData), // Pass array of topic variable names
                "page_id": "3",
                "name":req.session.name
            });
        } catch (error) {
            console.error('Error fetching practice activity data:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    };
}

export default dashboardController;