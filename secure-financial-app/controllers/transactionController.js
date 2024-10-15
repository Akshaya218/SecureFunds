// controllers/transactionController.js
const Transaction = require('../models/Transaction');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    const { amount, description } = req.body;

    // Input validation
    if (!amount || !description) {
        return res.status(400).json({ message: 'Amount and description are required' });
    }

    try {
        const transaction = new Transaction({
            amount,
            description,
            userId: req.user.id // Assuming req.user is set by auth middleware
        });
        
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};

// Get user transactions
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.params.userId });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};
