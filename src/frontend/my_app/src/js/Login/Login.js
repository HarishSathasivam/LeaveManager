import React, { useState } from 'react';
import axios from 'axios';
import Constants from '../../utilities/constans.js';

const Login = (props) => {
  const { loadLandingPage, handleCurrentUser, togglePage } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    if (name === "Email") {
      setEmail(value);
    } else if (name === "Password") {
      setPassword(value);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(Constants.serverIp + 'authenticate', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        setMessage("Login successful");
        getCurrentUser();
        localStorage.setItem('token', response.data.token);
        loadLandingPage();
      } else {
        setMessage(`Login failed: ${response.data.message}`);
      }
    } catch (error) {
      setMessage(`Request failed: ${error.response ? error.response.data.message : error.message}`);
      console.error('Error:', error);
    }
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    let url = Constants.serverIp + "getUserById?email=" + email;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        handleCurrentUser(response.data);
      }
    } catch (error) {
      console.log("error = ", error);
    }
  };

  return (
    <div className="form-container">
      <h4>Login</h4>
      <form onSubmit={handleFormSubmit}>
        <div className="input-group">
          <input
            name="Email"
            type="text"
            value={email}
            onChange={handleLoginChange}
            placeholder='Email'
            required
          />
           <input
            name="Password"
            type="password"
            value={password}
            onChange={handleLoginChange}
            placeholder='Password'
            required
          />
        </div>
        
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="button-container">
        <span onClick={togglePage} className="toggle-button">Go to Sign In</span>
      </div>
    </div>
  );
};

export default Login;
