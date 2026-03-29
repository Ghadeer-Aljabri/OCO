import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { FaChild } from "react-icons/fa";
import Header from "./Header";
import HomeCarousel from "./HomeCarousel";
import HomeCards from "./HomeCards";
import Footer from "./Footer";
import PreferencesModal from "./PreferencesModal";
import "../styles/Home.css";
import longcard from "../Images/long4.jpg";
import DonationsSummary from "./DonationsSummary";
import { motion } from "framer-motion";  // Import motion from Framer Motion
import { useTheme } from '../ThemeContext'; // Import your theme hook

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);


  const [animate, setAnimate] = useState(false);
  const { changeTheme, theme } = useTheme(); // Now also get `theme`

  
  const themeFilter = {
    light: 'none',
    dark: 'brightness(0.7) contrast(1.2)',
    blue: 'hue-rotate(180deg)',
    green: 'hue-rotate(90deg)',
  };

  const textColors = {
    light: '#000000',  // Dark text for light theme
    dark: '#ffffff',   // Light text for dark theme
    blue: '#1e88e5',   // Blue text for blue theme
    green: '#388e3c',  // Green text for green theme
  };
  
  const currentTextColor = textColors[theme] || '#000000';
  

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const bottomPosition = document.documentElement.scrollHeight;

      if (scrollPosition >= bottomPosition - 10) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigate]);

 

  const goToSponsorshipPage = () => {
    navigate("/sponsorship");
  };

  return (
    <Container
      fluid
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <PreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
  
      <Row className="carousel" style={{ flex: 1 }}>
        <Col>
          <HomeCarousel />
        </Col>
      </Row>
  
      <Row
        className="orphan-support-section"
        style={{ marginTop: "30px", textAlign: "center", padding: "100px" }}
      >
        <Col>
          <motion.div
            className="orphan-support-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <motion.h2
              style={{ color: currentTextColor }}
              initial={{ x: -500 }}
              animate={{ x: 0 }}
              transition={{ duration: 2.5 }}
            >
              {t("home.supportTitle")}
            </motion.h2>
  
            <div className="paragraphs-group">
              <motion.p
                style={{ color: currentTextColor }}
                initial={{ x: 500 }}
                animate={{ x: 0 }}
                transition={{ duration: 2.5, delay: 0.5 }}
              >
                {t("home.supportParagraph1")}
              </motion.p>
              <motion.p
                style={{ color: currentTextColor }}
                initial={{ x: -500 }}
                animate={{ x: 0 }}
                transition={{ duration: 2.5, delay: 1 }}
              >
                {t("home.supportParagraph2")}
              </motion.p>
              <motion.p
                style={{ color: currentTextColor }}
                initial={{ x: 500 }}
                animate={{ x: 0 }}
                transition={{ duration: 2.5, delay: 1.5 }}
              >
                {t("home.supportParagraph3")}
              </motion.p>
            </div>
  
            <Row style={{ padding: "40px" }}>
              <Col>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <FaHandsHelping className="holo-icon" />
                </motion.div>
              </Col>
              <Col>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                >
                  <FaHeart className="holo-icon" />
                </motion.div>
              </Col>
              <Col>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  <FaChild className="holo-icon" />
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>
  
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Row>
          <Col md="12">
            <img
              src={longcard}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                filter: themeFilter[theme] || "none",
                transition: "filter 0.3s ease",
              }}
              alt="Themed"
            />
            <Button
              onClick={goToSponsorshipPage}
              style={{
                position: "absolute",
                top: "80%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgb(4, 41, 13)",
                borderColor: "#28a745",
                padding: "10px 20px",
                fontSize: "16px",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className="sponsorship-btn"
            >
              {t("home.Go to Sponsorship")}
            </Button>
          </Col>
        </Row>
      </div>
              <div style={{ paddingTop: "300px" }}>
      <DonationsSummary />
  </div>
      <Row style={{ paddingTop: "300px" }}>
        <div
          className={`fade-in delay-2 ${animate ? "animated" : ""}`}
          style={{ color: currentTextColor }}
        >
          <h2 style={{ paddingBottom: "20px" }}>
            {t("home.Our Areas of Impact")}
          </h2>
        </div>
        <HomeCards />
      </Row>
  
      <Footer isAtBottom={isAtBottom} />
    </Container>
  );
  
}

export default Home;
