import React, { useState } from 'react';
import axios from 'axios';

const AuthorRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/authors/register', {
        username,
        password,
      });
      // Handle successful registration (e.g., show a success message)
    } catch (error) {
      console.error('Error registering:', error);
      // Handle error
    }
  };

  return (
    <div className="auth-container">
      <h2>Author Registration</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="auth-btn">Register</button>
      </form>
    </div>
  );
};

export default AuthorRegister;