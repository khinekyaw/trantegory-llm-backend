# Transaction Categorization API Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Categorize Transactions
Automatically categorizes a list of transactions using LLM.

**Endpoint:** `/transactions/categorize`
**Method:** `POST`
**Content-Type:** `application/json`

#### Request Body

| Field | Type | Description | Required |
|-------|------|-------------|-----------|
| text | string | Raw text containing transaction descriptions and amounts | Yes |
| categories | array | List of available categories | Yes |

##### Categories Array Structure

Each category object in the categories array should have:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the category |
| name | string | Display name of the category |
| icon | string | Icon identifier |
| color | string | Color code (hex) |
| type | string | Either "income" or "expense" |

#### Example Request
```json
{
  "text": "coffee 20$, Used laptop 500",
  "categories": [
    {
      "id": "1",
      "name": "Groceries",
      "icon": "ShoppingCart",
      "color": "#10B981",
      "type": "expense"
    },
    {
      "id": "14",
      "name": "Other Income",
      "icon": "Wallet",
      "color": "#4F46E5",
      "type": "income"
    }
  ]
}
```

#### Response

##### Success Response (200 OK)
Returns an array of categorized transactions.

Each transaction object contains:

| Field | Type | Description |
|-------|------|-------------|
| amount | number | Transaction amount (without currency symbols) |
| type | string | Either "income" or "expense" |
| description | string | Description of the transaction |
| categoryId | string | ID of the matched category |
| date | string | ISO timestamp of the transaction |
| id | string | UUID for the transaction |

Example Response:
```json
[
  {
    "amount": 20,
    "type": "expense",
    "description": "Coffee",
    "categoryId": "1",
    "date": "2024-03-16T17:48:42.549Z",
    "id": "b9a23f22-efe2-44f2-8ae1-f929e1d8bb05"
  },
  {
    "amount": 500,
    "type": "expense",
    "description": "Used laptop",
    "categoryId": "1",
    "date": "2024-03-16T17:48:42.549Z",
    "id": "723df0e7-da27-45cf-8bf2-df705c7aead9"
  }
]
```

##### Error Responses

###### 400 Bad Request
When required fields are missing:
```json
{
  "error": "Missing required fields: text and categories are required"
}
```

###### 500 Internal Server Error
When the LLM service fails or returns invalid data:
```json
{
  "error": "Failed to process transactions",
  "message": "Error details..."
}
```

## Integration Example (React)

```javascript
const categorizeTranactions = async (text, categories) => {
  try {
    const response = await fetch('http://localhost:3001/api/transactions/categorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        categories,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to categorize transactions');
    }

    const transactions = await response.json();
    return transactions;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Usage example
const text = "coffee 20$, Used laptop 500";
const categories = [
  {
    id: "1",
    name: "Groceries",
    icon: "ShoppingCart",
    color: "#10B981",
    type: "expense"
  },
  // ... other categories
];

try {
  const categorizedTransactions = await categorizeTranactions(text, categories);
  console.log('Categorized transactions:', categorizedTransactions);
} catch (error) {
  console.error('Failed to categorize:', error);
}
```

## Notes

1. The API uses an LLM (Mistral-7B) to analyze and categorize transactions
2. All amounts are returned as numbers without currency symbols
3. The API will attempt to match transactions to the closest matching category
4. Each transaction gets a unique UUID and current timestamp if not specified
5. The response is always an array, even for single transactions 