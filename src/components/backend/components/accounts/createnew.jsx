import React, { useState } from "react";
import API from "../../../../api.jsx"
import "./main.scss";

export default function CreateNew() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // General email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = {};
    setErrors({});
  
    // Email validation
    if (!validateEmail(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }
  
    // Password validation
    if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const userData = { name: username, email, password };
  
    try {
      // Send POST request to backend
      const response = await API.post("/createaccounts", userData);
    
      // Handle success
      setMessage(response.data.message || "Account created successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      // Handle error
      const backendError = error.response?.data?.error;
    
      // Check if the error is related to email
      if (backendError === "Email already exists") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: backendError, // Set email-specific error
        }));
      } else {
        setMessage(backendError || "An error occurred while creating the account.");
      }
    }
  };

  return (
    <div className="create-new">
      <div className="meow">
        <h1>Create New User</h1>
        <form onSubmit={handleSubmit}>
          <div className="username">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="email">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="password">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button type="submit" className="create-account-button">Create Account</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}