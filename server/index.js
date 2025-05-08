import 'dotenv/config'; // For ES Modules
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';


const app = express();

// CORS configuration
// In index.js, update CORS configuration:
// Update your CORS configuration in index.js
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});