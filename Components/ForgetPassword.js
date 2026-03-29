import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ForgetPassword.css";
import { IoMdArrowBack } from "react-icons/io";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/forgot-password", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "rgb(222, 230, 222)", minHeight: "100vh", paddingTop: "100px" }}>
      <div className="reset-password-container">
        {/* Back Button with label */}
        <div
          onClick={() => navigate("/login")}
          className="back-nav clickable"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            cursor: "pointer",
            color: "#2e7d32",
            fontWeight: "500"
          }}
        >
          <IoMdArrowBack style={{ fontSize: "24px", marginRight: "8px" }} />
          <span>Back to Login</span>
        </div>

        <h2>Reset Password</h2>
        <p>Enter your email address, and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleInputChange}
            className="reset-password-input"
            required
          />
          <button type="submit" className="reset-password-button" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="reset-password-success">{message}</p>}
        {error && <p className="reset-password-error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
