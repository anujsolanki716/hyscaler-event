import Event from '../models/Event.js';
import User from '../models/User.js';

// @desc    Fetch all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    const events = await Event.find({}).populate('creator', 'name').sort({ createdAt: -1 });
    res.json(events);
};

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id).populate('creator', 'name').populate('attendees', 'name email');
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    const { title, description, date, time, location, imageUrl, tickets } = req.body;
    
    const event = new Event({
        title,
        description,
        date,
        time,
        location,
        imageUrl,
        tickets,
        creator: req.user._id,
        attendees: [],
        comments: [],
    });

    const createdEvent = await event.save();
    const populatedEvent = await Event.findById(createdEvent._id).populate('creator', 'name');
    res.status(201).json(populatedEvent);
};


// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
        if (event.creator.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event) {
        if (event.attendees.some(attendeeId => attendeeId.toString() === req.user._id.toString())) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        event.attendees.push(req.user._id);
        await event.save();
        const updatedEvent = await Event.findById(req.params.id).populate('creator', 'name').populate('attendees', 'name email');
        res.json(updatedEvent);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};


// @desc    Add a comment to an event
// @route   POST /api/events/:id/comments
// @access  Private
const addEventComment = async (req, res) => {
    const { text } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
        const comment = {
            text,
            user: {
              id: req.user._id.toString(),
              name: req.user.name,
              email: req.user.email,
            },
            timestamp: new Date()
        };
        
        event.comments.push(comment);
        await event.save();
        const updatedEvent = await Event.findById(req.params.id).populate('creator', 'name').populate('attendees', 'name email');
        res.status(201).json(updatedEvent);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};


export {
    getEvents,
    getEventById,
    createEvent,
    deleteEvent,
    registerForEvent,
    addEventComment,
};
