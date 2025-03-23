# Trantegory LLM Backend

A Node.js backend service that uses LLM (Mistral-7B and Qwen VL) to automatically categorize income and expense transactions from natural language input and images. This service is designed to work with financial tracking applications, making it easier for users to input multiple transactions in natural language format or through receipt images.

## Features

- 🤖 Automatic transaction categorization using LLM
- 💰 Supports both income and expense transactions
- 🔍 Extracts amounts, descriptions, and categories from natural text
- 🎯 Matches transactions to predefined categories
- 📸 OCR support for receipt images using Qwen VL model
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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Configuration

The service requires several API keys to function:

1. OpenRouter API Key:
   - Visit [OpenRouter](https://openrouter.ai/)
   - Create an account
   - Generate an API key
   - Add to `.env` as `OPENROUTER_API_KEY`

2. Cloudinary Configuration:
   - Visit [Cloudinary](https://cloudinary.com/)
   - Create an account
   - Get your cloud name, API key, and API secret
   - Add to `.env` as:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

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

The service exposes several REST API endpoints for transaction categorization and image processing. See [API.md](API.md) for detailed API documentation.

### Quick Examples

#### 1. Transaction Categorization from Text
```javascript
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

#### 2. AI Chat with Transaction Analysis
```javascript
const response = await fetch('http://localhost:3001/api/transactions/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "Show me my cat expenses for this month",
    categories: [
      {
        id: "1",
        name: "Groceries",
        type: "expense"
      },
      {
        id: "2",
        name: "Pets",
        type: "expense"
      }
    ],
    entries: [
      {
        amount: 50,
        type: "expense",
        description: "Cat food",
        categoryId: "2",
        date: "2024-03-15T10:00:00Z",
        id: "123e4567-e89b-12d3-a456-426614174000"
      }
    ],
    currency: "USD"
  })
});

const result = await response.json();
```

#### 3. Receipt Image Processing
```javascript
// Step 1: Upload the receipt image
const formData = new FormData();
formData.append('image', imageFile); // imageFile is a File or Blob object

const uploadResponse = await fetch('http://localhost:3001/api/transactions/upload-image', {
  method: 'POST',
  body: formData
});

const { imageUrl } = await uploadResponse.json();

// Step 2: Use the image URL with the chat API for OCR and categorization
const chatResponse = await fetch('http://localhost:3001/api/transactions/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "What's in this receipt? Please categorize the items.",
    categories: [
      {
        id: "1",
        name: "Groceries",
        type: "expense"
      },
      {
        id: "2",
        name: "Pets",
        type: "expense"
      }
    ],
    imageUrl: imageUrl
  })
});

const result = await chatResponse.json();
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
- File upload errors
- Invalid file types
- File size limits
- Cloud storage errors

All errors return appropriate HTTP status codes and descriptive messages.

## Security Considerations

1. API keys are stored in environment variables
2. Input validation is performed on all requests
3. CORS is enabled for frontend integration
4. Error messages are sanitized for production
5. File upload restrictions:
   - Maximum file size: 5MB
   - Allowed file types: JPEG, PNG, JPG
   - Images are stored securely in Cloudinary
   - Images are optimized and resized automatically

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
- [Qwen VL](https://github.com/QwenLM/Qwen-VL) for the vision-language model
- [Cloudinary](https://cloudinary.com/) for image storage and optimization
- Express.js team for the web framework 