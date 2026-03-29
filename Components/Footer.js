import React from "react";
import { Container, Row, Col } from "reactstrap";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext'; // 🔹 Theme hook

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const footerColors = {
    light: {
      background: '#f1f1f1',
      text: '#000000',
      link: '#000000',
      hover: '#555555',
    },
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      link: '#ffffff',
      hover: '#cccccc',
    },
    blue: {
      background: '#1e88e5',
      text: '#ffffff',
      link: '#ffffff',
      hover: '#e3f2fd',
    },
    green: {
      background: '#386e3c',
      text: '#ffffff',
      link: '#ffffff',
      hover: '#c8e6c9',
    },
  };

  const currentColors = footerColors[theme] || footerColors.light;

  const linkStyle = {
    color: currentColors.link,
    textDecoration: 'none',
    transition: 'color 0.2s ease, transform 0.3s ease',
  };

  const hoverStyle = {
    color: currentColors.hover,
    textDecoration: 'underline',
    transform: 'scale(1.05)',
  };

  return (
    <footer
      className="footer mt-5 py-4"
      style={{
        backgroundColor: currentColors.background,
        color: currentColors.text,
        transition: 'all 0.3s ease',
      }}
    >
      <Container>
        <Row>
          <Col md="4" className="mb-3">
            <h5 style={{ color: currentColors.text }}>{t("footer.aboutUs")}</h5>
            <p style={{ color: currentColors.text }}>{t("footer.aboutText")}</p>
          </Col>

          <Col md="4" className="mb-3">
            <h5 style={{ color: currentColors.text }}>{t("footer.contactUs")}</h5>
            <p style={{ color: currentColors.text }}>
              <FaPhoneAlt className="me-2" /> +968 24 123 456
            </p>
            <p style={{ color: currentColors.text }}>
              <FaEnvelope className="me-2" /> info@omanorphans.org
            </p>
            <p style={{ color: currentColors.text }}>
              <FaMapMarkerAlt className="me-2" /> Muscat, Sultanate of Oman
            </p>
          </Col>

          <Col md="4" className="mb-3">
            <h5 style={{ color: currentColors.text }}>{t("footer.quickLinks")}</h5>
            <ul className="list-unstyled">
              {["home", "about", "sponsorChild", "contact"].map((key, idx) => (
                <li key={idx}>
                  <a
                    href={key === "home" ? "/home" : `/${key}`}
                    style={linkStyle}
                    onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
                    onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                  >
                    {t(`footer.${key}`)}
                  </a>
                </li>
              ))}
            </ul>

            <div className="social-icons mt-3">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  style={{
                    ...linkStyle,
                    marginRight: '12px',
                    fontSize: '1.2rem',
                  }}
                  onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)}
                  onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: currentColors.text, opacity: 0.2 }} />
        <div className="text-center">
          <small style={{ color: currentColors.text }}>
            {t("footer.rightsReserved", { year: new Date().getFullYear() })}
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
