// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import RegisterUser from './RegisterUser';
import ForgotPassword from './ForgotPass';
import ChatRoom from './ChatRoom';
import Profile from './Profile';
import EditProfileForm from './EditProfileForm';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatRoomName, setChatRoomName] = useState('');
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Function to update the user profile when editing is saved
  const handleProfileUpdate = (newProfilePicture) => {
    setCurrentUser((prevUser) => ({
      prevUser,
      profilePicture: newProfilePicture,
    }));
  };

  // Login Handler
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        setLoggedIn(true);
        setCurrentUser(response.data.user); // Set the current user information
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

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          {/* Render the Profile component when logged in */}
          <Profile user={currentUser} onProfileUpdate={handleProfileUpdate} />

          <div>
            {isEditingProfile ? (
              <EditProfileForm user={userProfile} setIsEditing={setIsEditingProfile} onProfileUpdate={handleProfileUpdate} />
            ) : (
              <Profile user={userProfile} onEditClick={() => setIsEditingProfile(true)} />
            )}
          </div>

          <button id="logoutButton" onClick={handleLogout}>
            Logout
          </button>

          {showChatRoom && <ChatRoom username={username} chatRoomName={chatRoomName} />}

          {!showChatRoom && (
            <button id="createChatRoomButton" onClick={handleCreateChatRoom}>
              Create Chat Room
            </button>
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
          <button id="loginButton" onClick={handleLogin}>
            Login
          </button>

          {/* Button to load ForgotPass component */}
          <button id="forgotPasswordButton" onClick={handleForgotPasswordClick}>
            Forgot Password
          </button>

          {/* Show ForgotPass component if state is true */}
          {showForgotPassword && <ForgotPassword />}
          <RegisterUser />
        </div>
      )}
    </div>
  );
};

export default App;
