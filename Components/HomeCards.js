import React from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardImg,
  CardSubtitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useTheme } from '../ThemeContext'; // Import the useTheme hook
import Card1 from "../Images/Card1.png";
import Card2 from "../Images/Card2.jpg";
import Card3 from "../Images/Card3.png";

const HomeCards = () => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Get the current theme

  // Function to determine the tint based on the theme
  const getThemeTint = () => {
    switch (theme) {
      case 'dark':
        return 'rgba(0, 0, 0, 0.6)'; // Dark tint for dark theme
      case 'blue':
        return 'rgba(30, 136, 229, 0.4)'; // Blue tint for blue theme
      case 'green':
        return 'rgba(56, 142, 60, 0.4)'; // Green tint for green theme
      default:
        return 'rgba(255, 255, 255, 0.4)'; // Light tint for light theme
    }
  };

  return (
    <Container className="home-cards-container">
      <Row>
        <Col md="4" className="card-wrapper">
          <Card className="custom-card">
            <CardImg
              alt="Card image cap"
              src={Card1}
              top
              className="card-image"
              style={{ position: 'relative' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: getThemeTint(), // Apply the tint
                zIndex: 1,
              }}
            ></div>
            <CardBody style={{ position: 'relative', zIndex: 2 }}>
              <CardTitle tag="h5">{t("cards.Education")}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {t("cards.Empowering through knowledge")}
              </CardSubtitle>
              <CardText>
                {t("cards.Supporting education for a brighter future.")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" className="card-wrapper">
          <Card className="custom-card">
            <CardImg
              alt="Card image cap"
              src={Card2}
              top
              className="card-image"
              style={{ position: 'relative' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: getThemeTint(), // Apply the tint
                zIndex: 1,
              }}
            ></div>
            <CardBody style={{ position: 'relative', zIndex: 2 }}>
              <CardTitle tag="h5">{t("cards.Emergency")}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {t("cards.Immediate response and care")}
              </CardSubtitle>
              <CardText>
                {t("cards.Providing aid during critical moments.")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4" className="card-wrapper">
          <Card className="custom-card">
            <CardImg
              alt="Card image cap"
              src={Card3}
              top
              className="card-image"
              style={{ position: 'relative' }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: getThemeTint(), // Apply the tint
                zIndex: 1,
              }}
            ></div>
            <CardBody style={{ position: 'relative', zIndex: 2 }}>
              <CardTitle tag="h5">{t("cards.Health")}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {t("cards.Promoting well-being")}
              </CardSubtitle>
              <CardText>
                {t("cards.Enhancing health and wellness.")}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeCards;
