import React, { useRef } from 'react';

const ChatForm = ({ setChatBotHistory, generateBotResponse, chatBotHistory }) => {
    const inputRef = useRef();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userMessage = inputRef.current?.value.trim();
        if (!userMessage) return;

        // Add user message to the chat history
        setChatBotHistory((history) => [
            ...history,
            { role: 'user', text: userMessage },
        ]);

        // Clear input field after submitting the message
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        // Call generateBotResponse to get bot reply
        await generateBotResponse([
            ...chatBotHistory,
            { role: 'user', text:`Using the details provided above, please address this query : ${userMessage}` },
        ]);
    };

    return (
        <form className='chatbot-form' onSubmit={handleFormSubmit}>
            <input
                type='text'
                placeholder='Type your message...'
                className='message-input'
                required
                ref={inputRef}
            />
            <button className='material-symbols-outlined'>arrow_upward</button>
        </form>
    );
};

export default ChatForm;
