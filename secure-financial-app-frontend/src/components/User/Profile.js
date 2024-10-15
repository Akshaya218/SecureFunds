import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(''); // State to store errors

  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem('token');

        // Ensure the token is available
        if (!token) {
          setError('No token found. Please login.');
          return;
        }
      try{
        // Make request to the correct backend route
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authorization
          },
        });

        setUser(response.data); // Set the user data
      } catch (error) {
        setError('Error fetching user profile'+ (error.response?.data?.message || error.message));
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
