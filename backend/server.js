'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Chatbot route
app.post('/chatbot', (req, res) => {
    const userInput = req.body.input;
    // Logic for chatbot response
    const botResponse = `${userInput}... [response from chatbot logic]`;
    res.json({ response: botResponse });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
