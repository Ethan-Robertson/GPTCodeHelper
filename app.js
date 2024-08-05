const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();

// Your API endpoint and key
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // Update endpoint for chat models
const API_KEY = 'insert api key here';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/optimize', async (req, res) => {
    const code = req.body.code;
    console.log('Received code:', code); // Debugging log
    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        'model': 'gpt-3.5-turbo', // Use a current model
        'messages': [
            {
                'role': 'system',
                'content': 'You are a helpful assistant.'
            },
            {
                'role': 'user',
                'content': `Optimize the following code and explain the steps taken to optimize it:\n\n${code}`
            }
        ],
        'max_tokens': 1000,
        'temperature': 0.5
    };

    try {
        const response = await axios.post(API_ENDPOINT, data, { headers });
        const responseData = response.data;
        console.log('API response:', responseData); // Debugging log
        const optimizedText = responseData.choices[0].message.content.trim();
        const [optimizedCode, ...stepsArray] = optimizedText.split('\n\n');
        const steps = stepsArray.join('\n\n');

        res.json({ optimized_code: optimizedCode, steps: steps });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error optimizing code' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});