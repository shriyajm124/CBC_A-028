const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/suggest', async (req, res) => {
  const { interests, budget } = req.body;

  const prompt = `
You're an eco-travel assistant. A user is interested in: ${interests}.
Their budget is: ${budget}. 

Suggest 3 amazing eco-tourism destinations anywhere in the world.
For each:
- Give the name
- A short description
- 2 eco-friendly places to stay or visit (with working URLs)

Respond in simple HTML with headings and clickable links.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.send(\`
      <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>🌿 Your Travel Matches</h2>
        \${text}
        <br><br><a href="/">← Back to Quiz</a>
      </body>
      </html>
    \`);
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.send("<h2>Sorry, Gemini API failed. Please check your key or try again.</h2>");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🌍 Eco Travel running at http://localhost:" + PORT));
