import React, { useState } from 'react';
import './UploadDocument.css';
import axios from 'axios';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allowedExtensions = ['doc', 'docx', 'pdf', 'txt'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileExtension = selectedFile?.name.split('.').pop().toLowerCase();

    // Check if the selected file's extension is allowed
    if (selectedFile && allowedExtensions.includes(fileExtension)) {
      setFile(selectedFile); // Set file if valid
      setError(''); // Clear any previous error message
    } else {
      setError('Invalid file type. Please upload a document (doc, docx, pdf, txt).');
      setFile(null); // Clear file if invalid
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true); // Set loading state

    const formData = new FormData();
    formData.append('file', file); // Append the selected file

    console.log('Upload process started');
    try {
      const response = await axios.post('http://localhost:5002/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully', response.data);
        alert('File uploaded successfully: ' + response.data.s3_url);
      } else {
        alert('Failed to upload file. Server returned status: ' + response.status);
      }
    } catch (error) {
      // Enhanced error logging for more details
      if (error.response) {
        console.error('Error response:', error.response.data);  // Server responded with a status code
        alert(`Error: ${error.response.data.error}`);
      } else if (error.request) {
        console.error('Error request:', error.request);  // No response was received from the server
        alert('No response received from the server.');
      } else {
        console.error('Error message:', error.message);  // Something went wrong while setting up the request
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} />
      {error && <p className="error">{error}</p>} {/* Display error message */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
};

export default UploadDocument;
