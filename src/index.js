require('dotenv').config();
const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 