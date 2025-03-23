const { processAIChat } = require('../services/aiChatService');

async function handleAIChat(req, res) {
  try {
    const { prompt, categories, entries, currency, imageUrl } = req.body;

    if (!prompt || !categories) {
      return res.status(400).json({
        error: 'Missing required fields: prompt and categories are required'
      });
    }

    const result = await processAIChat(prompt, categories, entries || [], currency || 'USD', imageUrl);
    res.json(result);
  } catch (error) {
    console.error('Error processing AI chat:', error);
    res.status(500).json({
      error: 'Failed to process AI chat request',
      message: error.message
    });
  }
}

module.exports = {
  handleAIChat,
}; 