import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    user: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: true });


const ticketSchema = mongoose.Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  tickets: [ticketSchema],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
