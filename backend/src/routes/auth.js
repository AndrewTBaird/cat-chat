import express from 'express';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import { generateToken, getCookieOptions } from '../utils/jwt.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Check if username is taken
    const existingUsername = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        username,
        email,
        passwordHash,
      })
      .returning({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
        createdAt: schema.users.createdAt,
      });

    // Generate JWT
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, getCookieOptions());

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/login
 * Login a user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Set HTTP-only cookie
    res.cookie('token', token, getCookieOptions());

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Logout a user
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', getCookieOptions());
  res.json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get full user details from database
    const [user] = await db
      .select({
        id: schema.users.id,
        username: schema.users.username,
        email: schema.users.email,
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
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
