const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler,protect } = require('./middleware/authMiddleware'); // Ensure you have error middleware
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const documentRoutes = require('./routes/documents');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the application if DB connection fails
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/documents', documentRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use(errorHandler); // Ensure this middleware is defined and handles errors properly
app.use(protect);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
