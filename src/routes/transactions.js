const express = require('express');
const router = express.Router();
const { processTransactions } = require('../controllers/transactionController');

router.post('/categorize', processTransactions);

module.exports = router; 