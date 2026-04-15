import React, { useState, useEffect } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);

    const handleSend = (message) => {
        setMessages([...messages, { text: message, sender: 'user' }]);
        // Call API to send message
    };

    return (
        <div className="chatbot">
            {messages.map((msg, index) => (
                <div key={index} className={msg.sender}> {msg.text} </div>
            ))}
            <button onClick={() => handleSend('Hello, Chatbot!')}>Send</button>
        </div>
    );
};

export default Chatbot;