// components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');  // Clear error message
    setSuccess(''); // Clear success message
    // Call the registration API
    try {
      // Make API call to register the user
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If successful, store token or handle success response
      console.log('User registered successfully:', response.data);
      setSuccess('Registration successful!'); // Show success message
    } catch (error) {
      // Handle errors (like user already exists)
      setError('Registration failed. ' + (error.response?.data.message || 'Try again later.'));
      console.error('Error registering user:', error);
    }
    //console.log({ name, email, password });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
