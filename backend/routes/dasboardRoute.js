import express from "express";
const router = express.Router();
import dashboardController from "../controllers/dashboardController.js";

import sessionCheckMiddleware from "../middlewares/sessioncheck.js";

router.use(sessionCheckMiddleware);


router.get('/', (req, res) => {
    const { page } = req.query;
    switch (page) {
        case '1':
            dashboardController.getQuestionStats(req, res);
            break;
        case '2':
            dashboardController.getSubjectMastery(req, res);
            break;
        case '3':
            dashboardController.getPracticeActivityData(req, res);
            break;
        // Add cases for other pages as needed
        default:
            // Handle invalid page
            dashboardController.getQuestionStats(req, res);
            break;
    }
});

export default router;
