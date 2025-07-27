import express from 'express';
const router = express.Router();
import {
    // generateEventIdeas,
    generateEventDescription,
    // generateAIChatResponse,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

// router.post('/ideas', protect, generateEventIdeas);
router.post('/description', protect, generateEventDescription);
// router.post('/chat', protect, generateAIChatResponse);

export default router;
