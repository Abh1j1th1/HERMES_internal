const express = require('express');
const router = express.Router();

// API route to handle chatbot messages
router.post('/chatbot', (req, res) => {
    const userMessage = req.body.message;
    // Process message and respond
    res.json({ reply: 'Hello from the Chatbot!' });
});

module.exports = router;