// ChatRoom.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MessageBubble from './MessageBubble';

const ChatRoom = ({ username, chatRoomName }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [usersList, setUsersList] = useState([]);
  
  // Create a ref to store the socket instance
  const socketRef = React.useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3001');

    // Join chat room when component mounts
    socketRef.current.emit('joinChatRoom', { username, chatRoomName });

    // Handle userList event
    socketRef.current.on('userList', (updatedUserList) => {
      setUsersList(updatedUserList);
    });

    // Handle user joined event
    socketRef.current.on('userJoined', ({ username, message, profilePicture }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message, profilePicture }]);
    });

    // Handle system message event
    socketRef.current.on('message', ({ username, message, profilePicture }) => {
      setMessages((prevMessages) => [...prevMessages, { username, message, profilePicture }]);
    });

    // Clean up when component unmounts
    return () => {
      // Disconnect socket when component unmounts
      socketRef.current.disconnect();
    };
  }, [username, chatRoomName]);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socketRef.current.emit('sendMessage', { username, message: messageInput });
      setMessages((prevMessages) => [...prevMessages, { username, message: messageInput }]);
      setMessageInput('');
    }
  };

  const leaveChat = () => {
    // Disconnect socket when user leaves the chat
    socketRef.current.disconnect();
    // Perform any additional actions, e.g., navigate to another page
  };

  return (
    <div>
      <h2>Chat Room: {chatRoomName}</h2>

      <div style={{ border: '1px solid #ccc', minHeight: '200px', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            username={msg.username}
            message={msg.message}
            profilePicture={msg.profilePicture}
          />
        ))}
      </div>
      
      <div>
        <h3>Users in the Chat:</h3>
        <ul>
          {usersList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>

      {/* Add a "Leave Chat" button */}
      <button onClick={leaveChat}>Leave Chat</button>
    </div>
  );
};

export default ChatRoom;
