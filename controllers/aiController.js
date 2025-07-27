import { GoogleGenAI, Type } from "@google/genai";
import Event from '../models/Event.js';
import dotenv from 'dotenv';
dotenv.config();


if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// const generateEventIdeas = async (req, res) => {
//     const { prompt } = req.body;
//     if (!prompt) return res.status(400).json({ message: "Prompt is required" });

//     const eventIdeaSchema = {
//         type: Type.ARRAY,
//         items: {
//           type: Type.OBJECT,
//           properties: {
//             title: { type: Type.STRING },
//             description: { type: Type.STRING },
//             location: { type: Type.STRING }
//           },
//           required: ["title", "description", "location"],
//         },
//     };

//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: `Based on the following prompt, generate 3 diverse and interesting event ideas. Prompt: "${prompt}"`,
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: eventIdeaSchema,
//             },
//         });
//         const ideas = JSON.parse(response.text.trim());
//         res.json(ideas);
//     } catch (error) {
//         console.error("Error in generateEventIdeas:", error);
//         res.status(500).json({ message: "Failed to generate event ideas" });
//     }
// };

const generateEventDescription = async (req, res) => {
    const { title, keywords } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a compelling and exciting one-paragraph event description for an event titled "${title}". Incorporate these keywords: ${keywords}. Make it sound unmissable.`,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        res.json({ description: response.text });
    } catch (error) {
        console.error("Error in generateEventDescription:", error);
        res.status(500).json({ message: "Failed to generate event description" });
    }
};

// const generateAIChatResponse = async (req, res) => {
//     const { event, comments } = req.body;
//     if (!event || !comments) return res.status(400).json({ message: "Event and comments are required" });

//     try {
//         const conversationHistory = comments.map(c => `${c.user.name}: ${c.text}`).join('\\n');
//         const systemInstruction = `You are an enthusiastic event attendee or organizer for the event titled "${event.title}". Your goal is to keep the conversation engaging. Respond to the last comment in a friendly, helpful, and concise manner.`;

//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: `Event Description: ${event.description}\\n\\nConversation so far:\\n${conversationHistory}\\n\\nYour turn to reply:`,
//             config: {
//                 systemInstruction,
//                 temperature: 0.8,
//                 topP: 0.9,
//                 thinkingConfig: { thinkingBudget: 0 }
//             }
//         });

//         const targetEvent = await Event.findById(event._id);
//         if (targetEvent) {
//              const aiUser = { id: 'user-hyscaler-responder', name: 'HySacler Attendee', email: 'ai@eventshyscaler.com' };
//              const newComment = {
//                 user: aiUser,
//                 text: response.text,
//                 timestamp: new Date(),
//              };
//              targetEvent.comments.push(newComment);
//              await targetEvent.save();
             
//              const updatedEvent = await Event.findById(targetEvent._id)
//                 .populate('creator', 'name')
//                 .populate('attendees', 'name email');

//              res.json(updatedEvent);
//         } else {
//              res.status(404).json({ message: 'Event not found' });
//         }
//     } catch (error) {
//         console.error("Error in generateAIChatResponse:", error);
//         res.status(500).json({ message: "Failed to generate AI response" });
//     }
// };

export {  generateEventDescription };