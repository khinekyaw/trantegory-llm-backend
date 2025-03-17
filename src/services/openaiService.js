// LLM service
const axios = require('axios')

async function categorizeTransactions(text, categories) {
  const systemPrompt = `You are a JSON-only financial transaction categorizer. Your task is to analyze transactions and output ONLY valid JSON.

Rules:
1. Output must be a valid JSON array of transactions
2. DO NOT include any explanatory text
3. DO NOT include markdown formatting
4. Each transaction must have exactly these fields:
   - amount (number, no currency symbols)
   - type (either "income" or "expense")
   - description (string)
   - categoryId (string matching available categories)
   - date (ISO string)
   - id (UUID string)

Available categories:
${JSON.stringify(categories, null, 2)}

Example valid output format:
[{
  "amount": 20,
  "type": "expense",
  "description": "Coffee",
  "categoryId": "1",
  "date": "2024-03-16T17:48:42.549Z",
  "id": "b9a23f22-efe2-44f2-8ae1-f929e1d8bb05"
}]`;

  try {
    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            { 
              role: "user", 
              content: `Convert this to JSON transactions array: ${text}. Remember to output ONLY the JSON array, no other text.` 
            }
          ],
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

    let content = response.data.choices[0].message.content.trim();
    
    // Try to extract JSON if there's any extra text
    if (!content.startsWith('[')) {
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
    }

    // Parse the JSON, this will throw if invalid
    const transactions = JSON.parse(content);
    
    // Validate the structure
    if (!Array.isArray(transactions)) {
      throw new Error('Response is not an array');
    }

    return transactions;
  } catch (error) {
    console.error('Error categorizing transactions:', error);
    throw error;
  }
}

module.exports = {
  categorizeTransactions,
}; 