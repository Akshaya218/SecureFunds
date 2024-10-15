// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
