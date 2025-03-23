const express = require('express');
const router = express.Router();
const { processTransactions } = require('../controllers/transactionController');
const { handleAIChat } = require('../controllers/aiChatController');
const { handleImageUpload } = require('../controllers/imageController');
const { upload } = require('../services/imageService');

router.post('/categorize', processTransactions);
router.post('/chat', handleAIChat);
router.post('/upload-image', upload.single('image'), handleImageUpload);

module.exports = router; 