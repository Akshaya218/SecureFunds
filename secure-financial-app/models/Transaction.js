// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0, // Prevent negative amounts
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model('Transaction', transactionSchema);
