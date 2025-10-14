import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use('/api/auth', authRoutes);

//Auth-Protected Routes
app.get('/api/cats', authenticateToken, (req, res) => {
  res.json({
    cats: [
      { id: 1, name: 'Whiskers', breed: 'Tabby' },
      { id: 2, name: 'Luna', breed: 'Siamese' },
      { id: 3, name: 'Oliver', breed: 'Persian' }
    ]
  });
});

// Unauthenticated routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/channels', (req, res) => {
  res.json({
    channels: [
      { id: 1, name: 'General Meowing' },
      { id: 2, name: 'Kibble Reviews' },
      { id: 3, name: 'Catnip Classifieds' }
    ]
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
