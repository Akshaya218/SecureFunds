const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller methods
const {getUserProfile,updateUserProfile}=require('../controllers/userController');
const router = express.Router();

// Route: POST /api/auth/register
router.post('/register', registerUser);

// Route: POST /api/auth/login
router.post('/login', loginUser);

// Route: GET /api/auth/profile (protected)
router.get('/profile', protect, getUserProfile); // Fetch the user's profile

// Route: PUT /api/auth/profile (protected)
router.put('/profile', protect, updateUserProfile); // Update the user's profile

module.exports = router;
