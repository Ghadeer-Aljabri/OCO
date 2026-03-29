import React, { useState } from "react";
import {
  FaRegBell,
  FaMoon,
  FaLanguage,
  FaUser,
  FaCog,
  FaPaintBrush,
} from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook
import Profile from "./Profile";
import Account from "./Account";
import Appearance from "./Appearance";
import "../styles/Settings.css";
import { useTheme } from '../ThemeContext'; 


const SettingsPage = () => {
  const { i18n } = useTranslation(); // Initialize the i18n instance
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [arabicEnabled, setArabicEnabled] = useState(false);
  const [activePage, setActivePage] = useState("profile"); // Set profile as default


  // Function to handle page content rendering based on the selected page
  const renderPageContent = () => {
    switch (activePage) {
      case "profile":
        return <Profile />;
      case "account":
        return <Account />;
      case "appearance":
        return <Appearance />;
      default:
        return null;
    }
  };

  
  // Function to handle language toggle
  const toggleLanguage = () => {
    const newLanguage = arabicEnabled ? 'en' : 'ar';  // Toggle between Arabic and English
    i18n.changeLanguage(newLanguage);  // Change language using i18n
    setArabicEnabled(!arabicEnabled);  // Toggle the state to reflect the new language
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="settings-header">
          <IoMdArrowBack onClick={() => navigate("/home")} className="back-icon clickable" />
          <h2>Settings</h2>
        </div>

        {/* Profile first */}
        <div className="settings-option clickable" onClick={() => setActivePage("profile")}>
          <FaUser className="settings-icon" />
          <span>Profile Settings</span>
        </div>

        {/* Account second */}
        <div className="settings-option clickable" onClick={() => setActivePage("account")}>
          <FaCog className="settings-icon" />
          <span>Account Settings</span>
        </div>

        <div className="settings-option clickable" onClick={() => setActivePage("appearance")}>
          <FaPaintBrush className="settings-icon" />
          <span>Appearance</span>
        </div>



        {/* Language switch for Arabic */}
        <div className="settings-option clickable" onClick={toggleLanguage}>
          <FaLanguage className="settings-icon" />
          <span>{arabicEnabled ? 'Arabic Language' : 'English Language'}</span>
          <div className={`toggle-switch ${arabicEnabled ? "active" : ""}`} />
        </div>
      </div>

      <div className="settings-content">
        {renderPageContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
