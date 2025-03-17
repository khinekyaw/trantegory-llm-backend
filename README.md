# Trantegory LLM Backend

A Node.js backend service that uses LLM (Mistral-7B) to automatically categorize income and expense transactions from natural language input. This service is designed to work with financial tracking applications, making it easier for users to input multiple transactions in natural language format.

## Features

- 🤖 Automatic transaction categorization using LLM
- 💰 Supports both income and expense transactions
- 🔍 Extracts amounts, descriptions, and categories from natural text
- 🎯 Matches transactions to predefined categories
- 🔒 Built with security and error handling in mind

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key (for LLM access)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trantegory-llm-backend.git
cd trantegory-llm-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3001
```

## Configuration

The service requires an OpenRouter API key to function. You can get one by:
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Generate an API key
4. Add the key to your `.env` file

## Running the Service

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The service will start on `http://localhost:3001` by default.

## API Usage

The service exposes a REST API endpoint for transaction categorization. See [API.md](API.md) for detailed API documentation.

### Quick Example

```javascript
// Example request
const response = await fetch('http://localhost:3001/api/transactions/categorize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: "coffee 20$, Used laptop 500",
    categories: [
      {
        id: "1",
        name: "Groceries",
        icon: "ShoppingCart",
        color: "#10B981",
        type: "expense"
      }
    ]
  })
});

const transactions = await response.json();
```

## Project Structure

```
trantegory-llm-backend/
├── src/
│   ├── index.js           # Application entry point
│   ├── routes/            # API routes
│   ├── controllers/       # Request handlers
│   └── services/          # Business logic
├── .env                   # Environment variables
├── package.json          
├── API.md                 # API documentation
└── README.md             # This file
```

## Error Handling

The service includes comprehensive error handling for:
- Invalid input formats
- Missing required fields
- LLM service failures
- JSON parsing errors

All errors return appropriate HTTP status codes and descriptive messages.

## Security Considerations

1. API keys are stored in environment variables
2. Input validation is performed on all requests
3. CORS is enabled for frontend integration
4. Error messages are sanitized for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing LLM API access
- [Mistral-7B](https://mistral.ai/) for the language model
- Express.js team for the web framework 