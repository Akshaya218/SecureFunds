import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For displaying errors
  const [loading, setLoading] = useState(false); // Loading state for button
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Define the request config (headers)
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Make the API call to the backend login endpoint
      const response = await axios.post(
        'http://localhost:5000/api/auth/login', // Replace with your backend login route
        { email, password },
        config
      );

      // Assuming the backend sends a token back, you can store it
      localStorage.setItem('token', response.data.token); // Or use cookies if preferred

      console.log('Token received:', response.data.token);

      // Redirect or update UI after successful login
      console.log('Logged in successfully');
      navigate('/profile'); // Redirect to profile or another route after login

    } catch (error) {
      // Handle the error response
      const errorMsg = error.response?.data?.message || 'Invalid login credentials. Please try again.';
      setError(errorMsg); // Display specific error message from the backend
      console.error(error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error if login fails */}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
