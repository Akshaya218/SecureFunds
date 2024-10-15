// routes/users.js or routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Replace with your actual User model
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify token

// Route to get the authenticated user's profile
router.get('/me', authMiddleware.protect, async (req, res) => {
  try {
    // Fetch user from the database by ID (req.user.id comes from the decoded token)
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user); // Return user data
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
