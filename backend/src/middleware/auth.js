import { verifyToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate requests using JWT from HTTP-only cookie
 */
export function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request
  req.user = {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
  };

  next();
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(req, res, next) {
  const token = req.cookies.token;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };
    }
  }

  next();
}
