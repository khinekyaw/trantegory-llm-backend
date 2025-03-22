const express = require('express');
const router = express.Router();
const { processTransactions } = require('../controllers/transactionController');
const { handleAIChat } = require('../controllers/aiChatController');

router.post('/categorize', processTransactions);
router.post('/chat', handleAIChat);

module.exports = router; 