# Cat Chat Backend

Backend API for Cat Chat application with PostgreSQL, Drizzle ORM, and JWT authentication.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

**Local Development:**
- Install PostgreSQL locally
- Create a database: `createdb catchat`
- Update `DATABASE_URL` in `.env` with your connection string

**Using Railway:**
- Add PostgreSQL addon to your Railway project
- Railway will automatically provide `DATABASE_URL`

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following in `.env`:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `FRONTEND_URL`: Your frontend URL (default: http://localhost:5173)

### 4. Run Database Migrations

Generate and run migrations to create the database schema:

```bash
# Generate migration from schema
npm run db:generate

# Apply migration to database (or use db:push for quick dev)
npm run db:push
```

### 5. Start the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Run pending migrations
- `npm run db:push` - Push schema changes directly to database (dev only)
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## API Endpoints

### Public Endpoints

- `GET /` - API status check
- `GET /api/health` - Health check endpoint

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

- `POST /api/auth/logout` - Logout (clears auth cookie)

- `GET /api/auth/me` - Get current user (protected)

### Channel Endpoints

- `GET /api/channels` - Get all channels

### Cat Endpoints

- `GET /api/cats` - Get all cats

## Authentication

This API uses HTTP-only cookies with JWT tokens for authentication. The frontend automatically sends cookies with each request when using `credentials: 'include'` in fetch options.

### Protected Routes

To protect a route, use the `authenticateToken` middleware:

```javascript
import { authenticateToken } from './middleware/auth.js';

app.get('/api/protected', authenticateToken, (req, res) => {
  // Access user info from req.user
  res.json({ user: req.user });
});
```

## Database Schema

### Users Table
- `id` (UUID) - Primary key
- `username` (VARCHAR) - Unique username
- `email` (VARCHAR) - Unique email
- `password_hash` (VARCHAR) - Hashed password
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

## Deployment

### Railway Deployment

1. Add PostgreSQL addon in Railway dashboard
2. Set environment variables in Railway:
   - `JWT_SECRET` - Your secure JWT secret
   - `FRONTEND_URL` - Your production frontend URL
   - `NODE_ENV=production`
3. Railway automatically provides `DATABASE_URL`
4. Migrations run automatically on deploy (add to build command if needed)

## Security Notes

- JWT tokens are stored in HTTP-only cookies (not accessible via JavaScript)
- CORS is configured to only allow requests from `FRONTEND_URL`
- Passwords are hashed using bcrypt with 10 salt rounds
- Use HTTPS in production (cookies set with `secure` flag)
- Keep `JWT_SECRET` secure and never commit it to git

## Development Tips

### View Database
```bash
npm run db:studio
```

This opens Drizzle Studio at `https://local.drizzle.studio`

### Reset Database
```bash
# Drop all tables and re-create
npm run db:push -- --force
```
