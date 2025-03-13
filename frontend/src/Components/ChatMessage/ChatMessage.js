import React from 'react'
import ChatBotIcon from '../ChatBotIcon/ChatBotIcon'

const ChatMessage = ({ chat }) => {
    return (
        !chat.hideInChat &&(
      <div className={`message ${chat.role === "model" ? "bot" : "user"}-message`}>
        {chat.role === "model" && <ChatBotIcon />}
        <p className='message-input'>{chat.text}</p>
      </div>)
    );
  };

export default ChatMessage
