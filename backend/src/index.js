import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { authenticateToken } from './middleware/auth.js';
import { Server } from 'socket.io'
import { createServer } from 'node:http';
import { verifyToken } from './utils/jwt.js';
import { db } from './db/index.js';
import { channels, chatMessages, users } from './db/schema.js';
import { desc, eq } from 'drizzle-orm';

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
    console.error('[WEBSOCKET AUTH] No cookies found in handshake');
    return next(new Error('Authentication required - no cookies'));
  }

  // Parse cookies manually (simple cookie parser)
  const cookieObj = {};
  cookies.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    cookieObj[key] = value;
  });

  const token = cookieObj.token;

  if (!token) {
    console.error('[WEBSOCKET AUTH] Token cookie not found');
    return next(new Error('Authentication required - no token'));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    console.error('[WEBSOCKET AUTH] Token verification failed');
    console.error('[WEBSOCKET AUTH] Token (first 20 chars):', token.substring(0, 20));
    console.error('[WEBSOCKET AUTH] JWT_SECRET is set:', !!process.env.JWT_SECRET);
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
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.user.username} (ID: ${socket.user.id})`);

  // Join all channel rooms on connection
  try {
    const allChannels = await db.select().from(channels);

    allChannels.forEach(channel => {
      socket.join(`channel-${channel.id}`);
    });
  } catch (error) {
    console.error('[CHANNELS ERROR] Failed to join channels:', error);
    socket.emit('ConnectionError', {
      error: 'Failed to join channels',
      details: error.message
    });
  }

  socket.on('UserMessage', async (msg) => {
    console.log(`[MESSAGE] Received from ${socket.user.username}:`, { text: msg.text?.substring(0, 50), channelId: msg.channelId });
    try {
      const { text, channelId } = msg;

      if (!text || !channelId) {
        const errorMsg = `Invalid message: missing text or channelId`;
        console.error(errorMsg, msg);
        socket.emit('MessageError', { error: errorMsg });
        return;
      }

      const messageWithUser = {
        text,
        channelId,
        userId: socket.user.id,
        username: socket.user.username,
        createdAt: new Date().toISOString(),
      };

      // Broadcast to channel room FIRST (streaming)
      console.log(`[BROADCAST] Sending message to channel-${channelId}`);
      io.to(`channel-${channelId}`).emit('UserMessage', messageWithUser);

      // Save to database
      try {
        await db.insert(chatMessages).values({
          userId: socket.user.id,
          channelId,
          message: text,
        });
        console.log(`[DATABASE] Message saved successfully for user ${socket.user.username}`);
      } catch (dbError) {
        console.error(`[DATABASE ERROR] Failed to save message:`, dbError);
        socket.emit('MessageError', {
          error: 'Failed to save message to database',
          details: dbError.message
        });
        throw dbError;
      }
    } catch (error) {
      console.error(`[MESSAGE ERROR] UserMessage handler failed:`, error);
      socket.emit('MessageError', {
        error: 'Failed to process message',
        details: error.message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Unauthenticated routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all channels
app.get('/api/channels', authenticateToken, async (req, res) => {
  try {
    const allChannels = await db.select().from(channels);
    res.json({ channels: allChannels });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Get message history for a specific channel (last 50 messages)
app.get('/api/channels/:channelId/messages', authenticateToken, async (req, res) => {
  try {
    const channelId = parseInt(req.params.channelId);

    if (isNaN(channelId)) {
      return res.status(400).json({ error: 'Invalid channel ID' });
    }

    // Fetch last 50 messages with user information
    const messages = await db
      .select({
        id: chatMessages.id,
        message: chatMessages.message,
        channelId: chatMessages.channelId,
        userId: chatMessages.userId,
        username: users.username,
        avatarUrl: users.avatarUrl,
        createdAt: chatMessages.createdAt,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .where(eq(chatMessages.channelId, channelId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(50);

    // Reverse to get chronological order (oldest to newest)
    const chronologicalMessages = messages.reverse();

    res.json({ messages: chronologicalMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
