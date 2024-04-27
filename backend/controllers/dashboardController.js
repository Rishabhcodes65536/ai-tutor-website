import mongoose from "mongoose";
import axios from "axios"
import questionModel from "../models/question.js";

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


class dashboardController{
 static getQuestionStats = async (req, res) => {
    try {
        // Retrieve questions attempted by the student with mode 'answer' or 'metacognition'
        const questions = await questionModel.find({
            student_id: req.session._id
        });

        // Separate questions into 'answer' and 'metacognition' modes
        const answerQuestions = questions.filter(question => {
            return question.mode === 'answer' || !question.mode;
        });
        const metaQuestions = questions.filter(question => question.mode === 'metacognition');

        // Calculate total questions attempted for both modes
        const totalQuestions = questions.length;
        const totalAnswerQuestions = answerQuestions.length;
        const totalMetaQuestions = metaQuestions.length;

        // Calculate number of right answers and wrong answers for both modes
        const rightAnswers = questions.reduce((acc, question) => {
            // Check if the question was answered correctly
            if (question.allocated_marks === question.total_marks) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);
        const rightAnswersMeta = metaQuestions.reduce((acc, question) => {
            if (question.allocated_marks === question.total_marks) {
                return acc + 1;
            } else {
                return acc;
            }
        }, 0);

        // Calculate number of wrong answers for both modes
        const wrongAnswers = totalQuestions - rightAnswers;
        const wrongAnswersMeta = totalMetaQuestions - rightAnswersMeta;

        // Calculate percentage of right, wrong, and not attempted questions for both modes
        const notAttempted = 100 - (totalQuestions ? ((rightAnswers + wrongAnswers) / totalQuestions) * 100 : 0);
        const notAttemptedMeta = 100 - (totalMetaQuestions ? ((rightAnswersMeta + wrongAnswersMeta) / totalMetaQuestions) * 100 : 0);

        // Prepare data for donut chart for both modes
        const chartData = [
            { label: 'Right', value: rightAnswers },
            { label: 'Right_meta', value: rightAnswersMeta },
            { label: 'Wrong', value: wrongAnswers },
            { label: 'Wrong_meta', value: wrongAnswersMeta },
            { label: 'NA', value: notAttempted },
            { label: 'NA_meta', value: notAttemptedMeta }
        ];

        console.log(chartData);
        
        res.render('dashboardone.ejs', {
            "Right": chartData[0].value,
            "Right_meta": chartData[1].value,
            "Wrong": chartData[2].value,
            "Wrong_meta": chartData[3].value,
            "NA": chartData[4].value,
            "NA_meta": chartData[5].value,
            "page_id": '1',
            "name": req.session.name.split(' ')[0]
        });
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

        const allQuestions = await questionModel.find({ student_id: req.session._id });

        const accuracyData = topics.map(topic => {
            const answerQuestions = allQuestions.filter(question => question.topic === topic.name && (question.mode === 'answer' || !question.mode));
            const metaQuestions = allQuestions.filter(question => question.topic === topic.name && question.mode === 'metacognition');

            const totalAnswerQuestions = answerQuestions.length;
            const totalMetaQuestions = metaQuestions.length;
            const totalQuestions = totalAnswerQuestions + totalMetaQuestions;

            const correctAnswerQuestions = answerQuestions.filter(question => question.total_marks === question.allocated_marks).length;
            const correctMetaQuestions = metaQuestions.filter(question => question.total_marks === question.allocated_marks).length;
            const correctQuestions = correctAnswerQuestions + correctMetaQuestions;

            const accuracy = Math.ceil(totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0);
            
            if (accuracy > highestAccuracyTopic.accuracy) {
                highestAccuracyTopic = { topic: topic.name, accuracy: accuracy };
            }

            return { topic: topic.name, accuracy: accuracy };
        });

        console.log(accuracyData);
        console.log('Highest Accuracy Topic:', highestAccuracyTopic);

        res.render('dashboardtwo.ejs', {
            accuracyData: accuracyData,
            highest_topic: highestAccuracyTopic,
            "page_id": "2",
            "name": req.session.name
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}


static getPracticeActivityData = async (req, res) => {
    try {
        // Fetch data from the questionModel for both answer and metacognition modes
        const questionData = await questionModel.find({ "student_id": req.session._id });
        const answerQuestions = questionData.filter(question => question.mode === 'answer' || !question.mode);
        const metaQuestions = questionData.filter(question => question.mode === 'metacognition');

        // Extract topic name and count attempted questions for each mode
        const topicData = {};
        const metacognitionData = {};
        
        answerQuestions.forEach(question => {
            const topic = question.topic;
            if (!topicData[topic]) {
                topicData[topic] = 1;
            } else {
                topicData[topic]++;
            }
        });

        metaQuestions.forEach(question => {
            const topic = question.topic;
            if (!metacognitionData[topic]) {
                metacognitionData[topic] = 1;
            } else {
                metacognitionData[topic]++;
            }
        });

        // Combine topicData and metacognitionData into a single object
        const combinedData = {};
        Object.keys(topicData).forEach(topic => {
            combinedData[topic] = {
                'answer': topicData[topic] || 0,
                'metacognition': metacognitionData[topic] || 0
            };
        });
        Object.keys(metacognitionData).forEach(topic => {
            combinedData[topic] = {
                'answer': topicData[topic] || 0,
                'metacognition': metacognitionData[topic] || 0
            };
        });
        console.log(topicData,metacognitionData,combinedData)
        // Respond with the extracted data
        res.render('dashboardthree.ejs', {
            combinedData: combinedData,
            topicVariables: Object.keys(combinedData),
            "page_id": "3",
            "name": req.session.name
        });
    } catch (error) {
        console.error('Error fetching practice activity data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
};


export default dashboardController;