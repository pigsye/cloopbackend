import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api"; // Import API functions
import "./Login.scss"; // Import styles

export default function Login() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await API.post("/login", formData); // Use formData correctly
          console.log("🔹 Login API Response:", response.data);

          if (response.data.token) {
              localStorage.setItem("token", response.data.token); // ✅ Store the token
              console.log("🔹 Stored Token in localStorage:", localStorage.getItem("token")); 
              navigate("/accounts"); // Redirect to admin dashboard after login
          } else {
              console.error("❌ No token received from API.");
          }
      } catch (err) {
          console.error("❌ Login error:", err.response ? err.response.data : err);
      }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </section>
    </main>
  );
}