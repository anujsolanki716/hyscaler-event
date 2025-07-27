import express from 'express';
const router = express.Router();
import {
    getEvents,
    getEventById,
    createEvent,
    deleteEvent,
    registerForEvent,
    addEventComment,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').get(getEventById).delete(protect, deleteEvent);
router.route('/:id/register').post(protect, registerForEvent);
router.route('/:id/comments').post(protect, addEventComment);

export default router;
