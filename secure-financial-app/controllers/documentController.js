const axios = require('axios');
const FormData = require('form-data'); // Import FormData

exports.uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Create FormData instance
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname); // Use buffer and original filename

    // Send the file to the external service
    const response = await axios.post('http://localhost:5002/upload', formData, {
      headers: {
        ...formData.getHeaders(), // Correctly set headers for FormData
      },
    });

    // Handle response from the Python microservice
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error uploading document:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Error uploading document.' });
  }
};
