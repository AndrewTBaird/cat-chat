import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { Server } from 'socket.io'
import { createServer } from 'node:http';
import { verifyToken } from './utils/jwt.js';

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

// Middleware to authenticate WebSocket connections
io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error('Authentication required'));
  }

  // Parse cookies manually (simple cookie parser)
  const cookieObj = {};
  cookies.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    cookieObj[key] = value;
  });

  const token = cookieObj.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return next(new Error('Invalid or expired token'));
  }

  // Attach user info to socket
  socket.user = {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
  };

  next();
});

// Websockets via socket.io
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username} (ID: ${socket.user.id})`);

  socket.on('UserMessage', (msg) => {
    // Now you have access to socket.user.id!
    const messageWithUser = {
      ...msg,
      userId: socket.user.id,
      username: socket.user.username,
    };

    io.emit('UserMessage', messageWithUser);
    console.log('message from', socket.user.username, ':', msg);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
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
