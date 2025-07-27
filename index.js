import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

dotenv.config();

connectDB();

const app = express();

//  Middleware
app.use(helmet()); // Secure headers
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Allow frontend


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
