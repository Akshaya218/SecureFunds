// components/Documents/UploadDocument.js
import React, { useState } from 'react';
import './UploadDocument.css';

const UploadDocument = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle document upload using FormData
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadDocument;
