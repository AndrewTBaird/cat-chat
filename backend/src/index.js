import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { Server } from 'socket.io'
import { createServer } from 'node:http';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Websockets via socket.io
io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    console.log(msg)
  })
  console.log('a user connected');
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Unauthenticated routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/channels', authenticateToken, (req, res) => {
  res.json({
    channels: [
      { id: 1, name: 'General Meowing' },
      { id: 2, name: 'Kibble Reviews' },
      { id: 3, name: 'Catnip Classifieds' }
    ]
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
