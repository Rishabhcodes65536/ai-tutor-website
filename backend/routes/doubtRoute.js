// routes/doubtRoutes.js

import express from 'express';
const router = express.Router();
import doubtController from '../controllers/doubtController.js';

// Doubts routes
router.get('/', doubtController.showDoubtsPrompt);
router.post('/', doubtController.saveDoubt);

// Summary route


export default router;
