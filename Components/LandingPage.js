import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation
import "../styles/LandingPage.css"; // Create this for styling
import Logo from "../Images/Logo_transparent.png";

const LandingPage = () => {
    const { t } = useTranslation(); // Initialize translation hook
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login"); // Auto-redirect after 3 seconds
        }, 3000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, [navigate]);

    return (
        <div className="landing-container">
            <img src={Logo} alt="Logo" className="landing-logo" />
            <h1 className="landing-text">{t('landing.welcomeText')}</h1> {/* Translated Text */}
        </div>
    );
};

export default LandingPage;
