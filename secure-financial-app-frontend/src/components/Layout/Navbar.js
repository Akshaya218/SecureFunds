// components/Layout/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/upload-document">Upload Document</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
