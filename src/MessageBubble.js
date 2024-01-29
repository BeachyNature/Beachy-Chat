// MessageBubble.js
import React from 'react';

const MessageBubble = ({ username, message }) => {
  return (
    <div style={{ margin: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <strong>{username}:</strong> {message}
    </div>
  );
};

export default MessageBubble;
