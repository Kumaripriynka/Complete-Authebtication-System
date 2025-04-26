import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://complete-authentication-system-frotend.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
