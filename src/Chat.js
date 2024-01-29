// Chat.js
import React, { useState } from 'react';

const Chat = ({ username, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage({ username, message });
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {/* Display Chat Messages */}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
