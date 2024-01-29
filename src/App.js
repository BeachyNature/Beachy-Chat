import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import RegisterUser from './RegisterUser';
import ForgotPassword from './ForgotPass';
import ChatRoom from './ChatRoom';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chatRoomName, setChatRoomName] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        setLoggedIn(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.' + error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setShowChatRoom(false);
  };

  const handleCreateChatRoom = () => {
    const roomName = window.prompt('Enter a chat room name:');
    if (roomName) {
      setChatRoomName(roomName);
      setShowChatRoom(true);
    }
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          <h1>Welcome, {username}!</h1>
          <button id="logoutButton" onClick={handleLogout}>Logout</button>
          
          {showChatRoom && <ChatRoom username={username} chatRoomName={chatRoomName} />} {/* Render ChatRoom component */}

          {!showChatRoom && (
            <button id="createChatRoomButton" onClick={handleCreateChatRoom}>Create Chat Room</button>
          )}
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <label>
            Username:
            <input
              type="text"
              id="usernameInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              id="passwordInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button id="loginButton" onClick={handleLogin}>Login</button>
          <ForgotPassword />
          <RegisterUser />
        </div>
      )}
    </div>
  );
};

export default App;
