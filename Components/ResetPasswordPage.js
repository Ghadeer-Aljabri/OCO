import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from '../Features/UserSlice';
import { IoMdArrowBack } from "react-icons/io";
import "../styles/ResetPasswordPage.css"; // 👈 create this for styling

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user || {});
  const { isLoading, resetPasswordMessage, resetPasswordError } = userState;

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location]);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
    if (!/\d/.test(password)) return "Password must contain at least one number.";
    if (!/[\W_]/.test(password)) return "Password must contain at least one special character.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    dispatch(resetPassword({ token, newPassword }));
  };

  useEffect(() => {
    if (resetPasswordMessage) {
      navigate("/");
    }
  }, [resetPasswordMessage, navigate]);

  useEffect(() => {
    if (resetPasswordError) {
      setConfirmPasswordError(resetPasswordError);
    }
  }, [resetPasswordError]);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (!token) {
    return (
      <div className="reset-password-container">
        <IoMdArrowBack onClick={() => navigate("/")} className="back-icon clickable" />
        <h2>Invalid or Expired Token</h2>
        <p>Please check the link or request a new password reset.</p>
      </div>
    );
  }

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <IoMdArrowBack onClick={() => navigate("/")} className="back-icon clickable" />
        <h2>Set a New Password</h2>
        <form onSubmit={handleSubmit} className="reset-password-form">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {passwordError && <p className="error-text">{passwordError}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}

          <button type="submit" disabled={isLoading} className="reset-password-button">
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
