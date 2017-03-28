import React from 'react';
import Message from './Message';
import '../css/chatBox.scss';

const ChatBox = ({ chat , chatHistory }) => {
  return (
    <div className="chat-app_right">
      <div className="heading">
        <div className="current-target">{chat.username}</div>
      </div>
      <div className="message-list">
        {

        }
      </div>
      <div className="footer">
        <input className="new-message" type="text" />
      </div>
    </div>
  );
}

export default ChatBox;
