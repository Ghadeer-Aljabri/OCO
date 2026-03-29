import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../Images/Logo_transparent.png";
import { GoGear } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { useTheme } from "../ThemeContext"; // Import your theme hook
import "../styles/Header.css";

function Header(args) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const [isOpen, setIsOpen] = useState(false);

  // Using the useTranslation hook to get translation functions
  const { t } = useTranslation();
  
  // Get the current theme
  const { theme } = useTheme();

  // Default theme styles (light and dark themes)
  const themeStyles = {
    light: {
      backgroundColor: "#ffffff", // Light background
      color: "#000000", // Dark text for light theme
    },
    dark: {
      backgroundColor: "#333333", // Dark background
      color: "#ffffff", // Light text for dark theme
    },
    blue: {
      backgroundColor: "#e3f2fd", // Light blue background
      color: "#000000", // Dark text for blue theme
    },
    green: {
      backgroundColor: "#c8e6c9", // Light green background
      color: "#000000", // Dark text for green theme
    },
  };
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "user/logout" });
    navigate("/");
  };

  const toggle = () => setIsOpen(!isOpen);
  const [notificationCount, setNotificationCount] = useState(0);


  useEffect(() => {
    const checkUpcomingSponsorships = async () => {
      try {
        if (!user?._id) {
          console.log("No logged in user ID found yet.");
          return;
        }
        
        console.log("Fetching sponsorships for user:", user._id);
  
        const response = await fetch(`http://localhost:8080/api/sponsorships/user/${user._id}`);
        const data = await response.json();
  
        console.log("Fetched sponsorships data:", data);
  
        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);
  
        const upcomingSponsorships = data.filter((record) => {
          const createdAt = new Date(record.createdAt);
          const nextDueDate = new Date(createdAt);
          nextDueDate.setMonth(nextDueDate.getMonth() + record.duration);
  
          console.log(`Sponsorship ID: ${record._id}, Next due date: ${nextDueDate.toISOString()}, Now: ${now.toISOString()}, One week from now: ${oneWeekFromNow.toISOString()}`);
  
          return nextDueDate > now && nextDueDate <= oneWeekFromNow;
        });
  
        console.log("Upcoming sponsorships after filtering:", upcomingSponsorships);
  
        setNotificationCount(upcomingSponsorships.length);
      } catch (err) {
        console.error("Error fetching sponsorships", err);
      }
    };
  
    checkUpcomingSponsorships();
  }, [user]);
  
  const handleBellClick = async () => {
    if (!user?._id) {
      toast.info("Please log in to see notifications.", { position: "top-right" });
      return;
    }
  
    console.log("Bell button clicked! Fetching sponsorships for user:", user._id);
    try {
      const response = await fetch(`http://localhost:8080/api/sponsorships/user/${user._id}`);
      const data = await response.json();
  
      console.log("Fetched sponsorships data:", data);
  
      const now = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(now.getDate() + 7);
  
      const upcomingSponsorships = data.filter(record => {
        const createdAt = new Date(record.createdAt);
        const nextDueDate = new Date(createdAt);
        nextDueDate.setMonth(nextDueDate.getMonth() + record.duration);
  
        console.log(`Checking sponsorship ${record._id}, next due: ${nextDueDate.toISOString()}`);
  
        return nextDueDate > now && nextDueDate <= oneWeekFromNow;
      });
  
      if (upcomingSponsorships.length === 0) {
        toast.info("No notifications 📭", { position: "top-right" });
      } else {
        upcomingSponsorships.forEach(record => {
          const createdAt = new Date(record.createdAt);
          const nextDueDate = new Date(createdAt);
          nextDueDate.setMonth(nextDueDate.getMonth() + record.duration);
          const formattedDueDate = nextDueDate.toLocaleDateString('en-GB');
          toast.success(`Upcoming Sponsorship Due: ${formattedDueDate}`, { position: "top-right" });
        });
      }
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
      toast.error("Error fetching notifications", { position: "top-right" });
    }
  };
  

  return (
    <Navbar
      {...args}
      expand="md"
      className="custom-navbar"
      style={{
        backgroundColor: themeStyles[theme]?.backgroundColor,
        color: themeStyles[theme]?.color,
      }}
    >
      <NavbarBrand href="/home" navbar-logo="true">
        <img alt="Logo" src={Logo} className="navbar-logo" />
      </NavbarBrand>

      <NavbarToggler onClick={toggle} className="custom-toggler" />

      <Collapse isOpen={isOpen} navbar>
        <Nav className="mx-auto navbar-center" navbar>
          <NavItem>
            <button onClick={() => navigate("/home")} className="nav-button">
              {t("header.home")}
            </button>
          </NavItem>
          <NavItem>
            <button onClick={() => navigate("/sponsorship")} className="nav-button">
              {t("header.sponsorship")}
            </button>
          </NavItem>
          <NavItem>
            <button onClick={() => navigate("/donation")} className="nav-button">
              {t("header.donation")}
            </button>
          </NavItem>
          {user.role === "admin" && (
            <NavItem>
              <button onClick={() => navigate("/admin-dashboard")} className="nav-button">
                {t("header.admin")}
              </button>
            </NavItem>
          )}
          <NavItem>
            <button onClick={() => navigate("/emergency")} className="nav-button">
              {t("header.emergency")}
            </button>
          </NavItem>
          <NavItem>
            <button onClick={() => navigate("/help")} className="nav-button">
              {t("header.help")}
            </button>
          </NavItem>
        </Nav>
      </Collapse>

      <div className="icon-buttons">
        <button onClick={() => navigate("/setting")} className="icon-button">
          <GoGear size={20} />
        </button>
        <div className="notification-bell-wrapper">
  <button onClick={handleBellClick} className={`icon-button ${notificationCount > 0 ? 'shake' : ''}`}>
    <FaBell size={20} />
    {notificationCount > 0 && (
      <span className="notification-badge">{notificationCount}</span>
    )}
  </button>
</div>

        <button onClick={handleLogout} className="icon-button logout-icon">
          <FiLogOut size={20} />
        </button>
      </div>
      <ToastContainer />
    </Navbar>
  );
}

export default Header;
