import React, { useState } from 'react';
import './App.css';
import RegisterUser from './RegisterUser';
import ForgotPassword from './ForgotPass';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        // Login successful, update state or perform other actions
        setLoggedIn(true);
      } else {
        // Handle login failure
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error
      alert('Login failed. Please try again.' + error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          <h1>Welcome, {username}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleLogin}>Login</button>
          <ForgotPassword />

          <RegisterUser />
        </div>
      )}
    </div>
  );
};

export default App;
