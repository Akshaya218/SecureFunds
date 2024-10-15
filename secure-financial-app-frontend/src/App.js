import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/User/Profile';
import TransactionList from './components/Transactions/TransactionList';
import AddTransaction from './components/Transactions/AddTransaction';
import UploadDocument from './components/Documents/UploadDocument';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Transactions */}
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/add-transaction" element={<AddTransaction />} />

          {/* Document Upload */}
          <Route path="/upload-document" element={<UploadDocument />} />

          {/* Default route */}
          <Route path="/" element={<h2>Welcome to Secure Financial App</h2>} />

          {/* 404 Not Found */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
