const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = 'your_api_key_here';
const BASE_URL = `https://api.exchangerate-api.com/v4/latest`;

app.get('/api/rates', async (req, res) => {
  try {
    const { base } = req.query;
    const response = await axios.get(`${BASE_URL}/${base}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

app.get('/api/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    const response = await axios.get(`${BASE_URL}/${from}`);
    const rate = response.data.rates[to];
    const result = amount * rate;
    
    res.json({
      from,
      to,
      amount,
      rate,
      result
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});