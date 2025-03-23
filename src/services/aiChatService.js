const axios = require('axios');

async function processAIChat(prompt, categories, entries = [], currency = 'USD', imageUrl = null) {
  const currentDate = new Date().toISOString();
  const currentYear = new Date().getFullYear();

  const systemPrompt = `You are a financial AI assistant that can help with both categorizing transactions and answering financial queries.
Your responses must be in valid JSON format.

Rules:
1. Output must be a valid JSON object with these fields:
   - type: either "categorization" or "query_response"
   - message: string (AI's response message)
   - data: object or array (depending on type)
   - timestamp: ISO string

2. For categorization (type: "categorization"):
   - data should be an array of transactions
   - Each transaction must have:
     * amount (number, no currency symbols)
     * type (either "income" or "expense")
     * description (string)
     * categoryId (string matching available categories)
     * date (ISO string)
     * id (UUID string)
   - Date handling rules:
     * Current year is ${currentYear}
     * If a date is mentioned in the text (e.g., "yesterday", "last week", specific date), use that date with the current year ${currentYear}
     * For relative dates:
       - "yesterday" = previous day in ${currentYear}
       - "last week" = 7 days ago in ${currentYear}
       - "last month" = previous month in ${currentYear}
       - "today" = current date
     * If no date is mentioned, use the current date
     * Convert all dates to ISO string format
     * NEVER use dates from previous years unless explicitly specified

3. For queries (type: "query_response"):
   - data should be an object with:
     * query_type: string (e.g., "category_summary", "monthly_report", etc.)
     * results: array of matching transactions
     * summary: object with relevant statistics
   - Date filtering rules:
     * "this month" = current month's transactions in ${currentYear}
     * "last month" = previous month's transactions in ${currentYear}
     * "this week" = current week's transactions in ${currentYear}
     * "last week" = previous week's transactions in ${currentYear}
     * "today" = current day's transactions
     * "yesterday" = previous day's transactions in ${currentYear}

4. Special rules for receipt image processing:
   - When analyzing receipt images:
     * Extract individual line items only
     * DO NOT include summary totals, tax amounts, or subtotals as separate items
     * DO NOT include service charges or tips as separate items
     * Focus on the main products/services purchased
     * If a line item has multiple products, split them into separate transactions
     * Use the receipt date if available, otherwise use current date
     * Match items to the most appropriate category from the provided list

Available categories:
${JSON.stringify(categories, null, 2)}

Previous entries:
${JSON.stringify(entries, null, 2)}

Currency: ${currency}

Example valid outputs:

For categorization:
{
  "type": "categorization",
  "message": "I've categorized your transactions",
  "data": [
    {
      "amount": 20,
      "type": "expense",
      "description": "Coffee",
      "categoryId": "1",
      "date": "${currentDate}",
      "id": "b9a23f22-efe2-44f2-8ae1-f929e1d8bb05"
    }
  ],
  "timestamp": "${currentDate}"
}

For query:
{
  "type": "query_response",
  "message": "Here are your cat expenses for this month",
  "data": {
    "query_type": "category_summary",
    "results": [
      {
        "amount": 50,
        "type": "expense",
        "description": "Cat food",
        "categoryId": "2",
        "date": "${currentYear}-03-15T10:00:00Z",
        "id": "123e4567-e89b-12d3-a456-426614174000"
      }
    ],
    "summary": {
      "total_amount": 50,
      "count": 1,
      "period": "this_month"
    }
  },
  "timestamp": "${currentDate}"
}`;

  try {
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (imageUrl) {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: prompt || "Please analyze this receipt and extract individual line items. Do not include totals, tax, or service charges as separate items."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: prompt
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: imageUrl ? 'qwen/qwen2.5-vl-72b-instruct' : process.env.OPENROUTER_MODEL,
        messages,
        temperature: 0.2
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
    if (!content.startsWith('{')) {
      const jsonMatch = content.match(/\{.*\}/s);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
    }

    // Parse the JSON
    const result = JSON.parse(content);
    
    // Validate the structure
    if (!result.type || !result.message || !result.data || !result.timestamp) {
      throw new Error('Invalid response structure');
    }

    return result;
  } catch (error) {
    console.error('Error processing AI chat:', error);
    throw error;
  }
}

module.exports = {
  processAIChat,
}; 