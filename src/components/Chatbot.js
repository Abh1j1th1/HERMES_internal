import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch messages from an API
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('https://api.example.com/messages');
                setMessages(response.data);
            } catch (err) {
                setError('Error fetching messages.');
            }
        };
        fetchMessages();
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        try {
            await axios.post('https://api.example.com/messages', { text: input });
            setMessages([...messages, { text: input, timestamp: new Date().toISOString() }]);
            setInput('');
        } catch (err) {
            setError('Error sending message.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            const chatContainer = document.getElementById('chat-container');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chatbot">
            <div className="chat-container" id="chat-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                        <span className="text">{msg.text}</span>
                    </div>
                ))}
                {loading && <div className="loading">Loading...</div>}
                {error && <div className="error">{error}</div>}
            </div>
            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chatbot;