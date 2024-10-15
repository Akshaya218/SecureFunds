// controllers/documentController.js
const Document = require('../models/Document');
const crypto = require('crypto'); // For encryption
const multer = require('multer');

// Encryption function (example)
const encrypt = (text) => {
  // Implement your encryption logic here
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decryption function (example)
const decrypt = (text) => {
  // Implement your decryption logic here
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Upload document
exports.uploadDocument = async (req, res) => {
  const { userId } = req.body;

  // Input validation
  if (!userId || !req.file) {
    return res.status(400).json({ message: 'User ID and document are required' });
  }

  const encryptedData = encrypt(req.file.buffer.toString());

  try {
    const newDocument = new Document({ data: encryptedData, userId });
    await newDocument.save();
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: { id: newDocument._id, userId: newDocument.userId }
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const decryptedData = decrypt(document.data);
    res.send(decryptedData);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
