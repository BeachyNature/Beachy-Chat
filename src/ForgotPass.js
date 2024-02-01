// ForgotPass.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPass = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:5000/change_pass/forgot-password', { email });
      alert('Password reset email sent. Check your email for instructions.');
    } catch (error) {
      console.error('Error sending forgot password request:', error);
      alert('Forgot password failed. Please try again.');
    }
  };  

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Reset Password</button>
    </div>
  );
};

export default ForgotPass;
