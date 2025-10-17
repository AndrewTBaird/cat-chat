import express from 'express';
import multer from 'multer';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadToR2 } from '../utils/r2.js';
import crypto from 'crypto';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
        avatarUrl: schema.users.avatarUrl,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, req.user.id))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/users/profile
 * Update current user's profile (username only)
 */
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if username is already taken by another user
    const [existingUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // Update username
    const [updatedUser] = await db
      .update(schema.users)
      .set({
        username,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, req.user.id))
      .returning({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
        avatarUrl: schema.users.avatarUrl,
      });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/users/avatar
 * Upload avatar image
 */
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${req.user.id}-${crypto.randomBytes(8).toString('hex')}.${fileExtension}`;

    // Upload to R2
    const avatarUrl = await uploadToR2(
      req.file.buffer,
      fileName,
      req.file.mimetype
    );

    // Update user's avatar URL in database
    const [updatedUser] = await db
      .update(schema.users)
      .set({
        avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, req.user.id))
      .returning({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
        avatarUrl: schema.users.avatarUrl,
      });

    res.json({
      message: 'Avatar uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

export default router;
