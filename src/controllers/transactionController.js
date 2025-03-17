const { v4: uuidv4 } = require('uuid');
const { categorizeTransactions } = require('../services/openaiService');

async function processTransactions(req, res) {
    console.log('process tran', req)
  try {
    const { text, categories } = req.body;

    if (!text || !categories) {
      return res.status(400).json({
        error: 'Missing required fields: text and categories are required'
      });
    }

    const transactions = await categorizeTransactions(text, categories);

    // Add IDs and dates to transactions if they don't exist
    const processedTransactions = transactions.map(transaction => ({
      ...transaction,
      id: transaction.id || uuidv4(),
      date: transaction.date || new Date().toISOString()
    }));

    res.json(processedTransactions);
  } catch (error) {
    console.error('Error processing transactions:', error);
    res.status(500).json({
      error: 'Failed to process transactions',
      message: error.message
    });
  }
}

module.exports = {
  processTransactions,
}; 