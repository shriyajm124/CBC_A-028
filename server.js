// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Setup Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});
const openai = new OpenAIApi(configuration);

// AI Response Endpoint
app.post('/get-ai-response', async (req, res) => {
  try {
    const userInput = req.body.userInput;
    const aiResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: User is interested in travel recommendations based on: "${userInput}". Suggest a place with a short description.,
      max_tokens: 100,
    });

    res.json({ response: aiResponse.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(Server listening on port ${port});
});