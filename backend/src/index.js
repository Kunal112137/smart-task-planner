
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const planRoutes = require('./routes/planRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;


const connectToMongo = async () => {
  if (!process.env.MONGODB_URI) return null;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('/api', planRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectToMongo();
  } catch (err) {
    console.warn('Continuing without MongoDB connection. Plans will not be persisted until MongoDB is available.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Smart Task Planner Backend running on http://localhost:${PORT}`);
    console.log(`📌 Health Check: http://localhost:${PORT}/health`);
    console.log(`📌 API Endpoint: POST http://localhost:${PORT}/api/generate-plan\n`);
  });
};

startServer();

module.exports = app;
