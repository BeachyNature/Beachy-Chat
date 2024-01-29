import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatRoom = ({ username, chatRoomName }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  const socket = io('http://localhost:3001');

  useEffect(() => {
    if (!hasJoined) {
      socket.emit('joinChatRoom', { username, chatRoomName });
      setHasJoined(true);
    }

  // Handle user joined event
  socket.on('userJoined', (messageData) => {
    setMessages((prevMessages) => [...prevMessages, messageData]);
  });

  // Handle system message event
  socket.on('message', (messageData) => {
    setMessages((prevMessages) => [...prevMessages, messageData]);
  });

    // Clean up when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket, username, chatRoomName, hasJoined]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('sendMessage', { username, message: messageInput });
      setMessages((prevMessages) => [...prevMessages, { username, message: messageInput }]);
      setMessageInput('');
    }
  };

  return (
    <div>
      <h2>Chat Room: {chatRoomName}</h2>
      
      <div style={{ border: '1px solid #ccc', minHeight: '200px', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
