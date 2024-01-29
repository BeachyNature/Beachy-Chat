import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatRoom = ({ username }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    if (socket) {
      socket.emit('joinChatRoom', username);

      socket.on('userJoined', (data) => {
        console.log(`${data.username} ${data.message}`);
      });

      socket.on('userLeft', (data) => {
        console.log(`${data.username} ${data.message}`);
      });

      socket.on('message', (data) => {
        console.log(`${data.username}: ${data.message}`);
        setChatHistory((prevHistory) => [...prevHistory, `${data.username}: ${data.message}`]);
      });
    }
  }, [socket, username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket && message.trim() !== '') {
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };  

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>{chat}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
