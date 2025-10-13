import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Cat Chat API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Example API endpoint
app.get('/api/cats', (req, res) => {
  res.json({
    cats: [
      { id: 1, name: 'Whiskers', breed: 'Tabby' },
      { id: 2, name: 'Luna', breed: 'Siamese' },
      { id: 3, name: 'Oliver', breed: 'Persian' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
