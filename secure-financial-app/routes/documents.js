// routes/documents.js
const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const documentController = require('../controllers/documentController');
const multer = require('multer');

// Set the upload directory and file filter for specific file types
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|jpeg|jpg|png/; // Allowed file types
    const extname = fileTypes.test(file.mimetype);
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type, only PDF and images are allowed!'));
    }
  }
});

// Route: POST /api/documents (upload document)
router.post('/', upload.single('document'), documentController.uploadDocument);

// Route: GET /api/documents/:id (download document)
router.get('/:id', documentController.downloadDocument);

module.exports = router;
