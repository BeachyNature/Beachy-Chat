// RegisterUser.js

import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username,
        password,
        email,
      });      

      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Register User</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterUser;
