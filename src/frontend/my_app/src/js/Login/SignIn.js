import React, { useState } from 'react';
import axios from 'axios';
import Constants from '../../utilities/constans.js';

const SignIn = (props) => {
  const { togglePage } = props;
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUserDel = (e) => {
    const { name, value } = e.target;
    if (name === "UserName") {
      setUserName(value);
    } else if (name === "Email") {
      setEmail(value);
    } else if (name === "Role") {
      setRole(value);
    } else if (name === "Password") {
      setPassword(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username: userName,
      email: email,
      role: role,
      password: password
    };
    try {
      const response = await axios.post(Constants.serverIp + 'signUp', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setMessage("User registered successfully");
      } else {
        setMessage(`Registration failed: ${response.data.message}`);
      }
    } catch (error) {
      setMessage(`Request failed: ${error.response ? error.response.data.message : error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="input-group">
          <input
            name="UserName"
            type="text"
            value={userName}
            onChange={handleUserDel}
            placeholder='Name'
            required
          />
        </div>
        <div className="input-group">
          <input
            name="Email"
            type="email"
            value={email}
            onChange={handleUserDel}
            placeholder='Email'
            required
          />
        </div>
        <div className="input-group">
          <select
            name="Role"
            value={role}
            onChange={handleUserDel}
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <div className="input-group">
          <input
            name="Password"
            type="password"
            value={password}
            onChange={handleUserDel}
            placeholder='Password'
            required
          />
        </div>
        <div className="button-container">
          <input type="submit" value="Save" />
        </div>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="button-container">
        <span onClick={togglePage} className="toggle-button">Go to Log In</span>
      </div>
    </div>
  );
};

export default SignIn;
