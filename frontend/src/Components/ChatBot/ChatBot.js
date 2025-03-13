import React, { useState, useEffect } from 'react';
import ChatBotIcon from '../ChatBotIcon/ChatBotIcon';
import './ChatBot.css';
import ChatForm from '../ChatForm/ChatForm';
import ChatMessage from '../ChatMessage/ChatMessage';
import { companyInfo } from '../../CompanyDetails';

const ChatBot = () => {
    const [chatBotHistory, setChatBotHistory] = useState([{
        hideInChat:true,
        role:"model",
        text:companyInfo
    }]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Initial greeting message
        setChatBotHistory((prev) => [
            ...prev,
            { role: 'model', text: 'Hi! How can I help you today?' }
        ]);
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat history
        const chatHistory = document.querySelector('.chatbot-body');
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }, [chatBotHistory]);

    // Update chat history when the bot response is received
    const updateHistory = (message) => {
        setChatBotHistory((prev) => [
            ...prev.filter((msg) => msg.text !== '....'), 
            { role: 'model', text: message }
        ]);
    };

    const generateBotResponse = async (history) => {
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // API key from .env

        // Modify history payload to match the correct API structure
        const formattedHistory = history.map(({ role, text }) => ({
            role: role,
            parts: [{ text }]
        }));

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents: formattedHistory }), // Send the formatted history
        };

        try {
            // Add "thinking..." message to show bot is processing
            updateHistory('....');

            const response = await fetch(`${API_URL}?key=${API_KEY}`, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API error occurred.');
            }

            console.log('API Response:', data);

            // Extract the response content from the API
            const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();

            updateHistory(apiResponse);  // Update the history with the bot's response
        } catch (error) {
            console.error('Error fetching bot response:', error);
            updateHistory('Error: Unable to fetch response.');
        }
    };

    return (
        <div className='' style={{ position: 'fixed', bottom: '20px', right: '20px'}}>
            <div className='chatbot-popup' style={{ display: isOpen ? 'block' : 'none' }}>
                <div className='chatbot-header'>
                    <div className='header-info'>
                        <ChatBotIcon />
                        <h2 className='logo-text'>Reva ChatBot</h2>
                    </div>
                    <button className='material-symbols-outlined' onClick={() => setIsOpen(false)}>
                        keyboard_arrow_down
                    </button>
                </div>
                <div className='chatbot-body'>
                    {chatBotHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>
                <div className='chatbot-footer'>
                    <ChatForm
                        setChatBotHistory={setChatBotHistory}
                        generateBotResponse={generateBotResponse}
                        chatBotHistory={chatBotHistory}
                    />
                </div>
            </div>
            {!isOpen && (
                <button className='chat-toggle-button' onClick={() => setIsOpen(true)}>
                    <ChatBotIcon />
                </button>
            )}
        </div>
    );
};

export default ChatBot;
