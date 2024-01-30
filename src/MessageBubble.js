// MessageBubble.js
import React from 'react';

const MessageBubble = ({ username, message, profilePicture }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <img
        src="/default.jpg"
        alt={`${username}'s Profile`}
        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
      />
      <div>
        <strong>{username}:</strong> {message}
      </div>
    </div>
  );
};

export default MessageBubble;
