const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    project: 'CodeAlpha Social Media Platform API',
    status: 'Active',
    intern: 'Rahul Bariki (CA/DF1/245571)',
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    project: 'CodeAlpha Social Media Platform API',
    status: 'Active',
    intern: 'Rahul Bariki (CA/DF1/245571)',
    version: '1.0.0'
  });
});

// Routes - support both /api/... and direct routing for serverless handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/users', require('./routes/userRoutes'));

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/posts', require('./routes/postRoutes'));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start listener if not running as serverless function
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Social Media API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
