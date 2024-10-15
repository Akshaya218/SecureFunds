// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  data: {
    type: Buffer, // Store encrypted data as Buffer
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model('Document', documentSchema);
