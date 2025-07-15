const express = require('express');
const axios = require('axios');
const path = require('path');



const app = express();
const PORT = 5000;

const API_KEY = '11b6dff054f6ed602a0d3e67e7249a65';

app.use(express.json());

// Weather API route
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Weather data fetch failed' });
  }
});

app.use(express.static('client/dist'));


// Serve React front end for all routes not handled by the API
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client' , 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
