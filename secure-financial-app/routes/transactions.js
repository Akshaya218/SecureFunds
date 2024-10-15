// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const transactionController = require('../controllers/transactionController');

// Route: POST /api/transactions (create a transaction)
router.post('/', transactionController.createTransaction);

// Route: GET /api/transactions/:userId (get transactions for a user)
router.get('/:userId', transactionController.getUserTransactions);

module.exports = router;
