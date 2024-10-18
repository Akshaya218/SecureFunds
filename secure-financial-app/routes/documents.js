const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const upload = require('../middleware/upload'); // Ensure your middleware is imported

// Set up multer for file upload
const storage = multer.memoryStorage(); // Store files in memory
const uploadMiddleware = multer({ storage }); // Use a different name to avoid conflict

router.post('/upload', uploadMiddleware.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        // Prepare FormData for the external service
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname); // Use buffer and original filename

        // Make a request to the external upload service
        const response = await axios.post('http://localhost:5002/upload', formData, {
            headers: {
                ...formData.getHeaders() // Set the correct headers for FormData
            }
        });

        // Handle the response and potentially save the document metadata
        // You can store the response data in your Document model as needed
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error uploading document:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Error uploading document' });
    }
});

// Route: GET /api/documents/:id (to implement later for downloading, etc.)
// router.get('/:id', documentController.downloadDocument);

module.exports = router;
