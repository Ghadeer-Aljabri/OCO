import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import donationImage from "../Images/card5.jpg"; 
import Header from "./Header";
import Footer from "./Footer";
import { useTheme } from '../ThemeContext'; 


const Donation = () => {
  const [amountPaid, setAmount] = useState("");
  const navigate = useNavigate();

  const { changeTheme, theme } = useTheme(); // Now also get `theme`

  // Determine hue rotation or tint per theme
  const themeFilter = {
    light: 'none',
    dark: 'brightness(0.7) contrast(1.2)',
    blue: 'hue-rotate(180deg)',
    green: 'hue-rotate(90deg)',
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // ✅ Navigate to carddetails with amount only
    navigate('/carddetails', { state: { amountPaid, mode: 'donation' } });

  };

  return (
    <div>
      <Header />
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md="6" className="mb-4 mb-md-0">
            <img
              src={donationImage}
              alt="Donation"
              className="img-fluid rounded shadow"
              style={{ borderRadius: '10px',
                filter: themeFilter[theme] || 'none',
                transition: 'filter 0.3s ease'}}
            />
          </Col>
          <Col md="6">
            <Card className="shadow-sm border-0">
              <CardBody>
                <CardTitle tag="h3" className="text-success mb-4 text-center">
                  Make a Donation
                </CardTitle>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="amount">Donation Amount (OMR)</Label>
                    <Input
                      type="number"
                      id="amount"
                      placeholder="Enter amount"
                      value={amountPaid}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      step="0.5"
                    />
                  </FormGroup>
                  <Button
                    color="success"
                    type="submit"
                    block
                    className="mt-3"
                  >
                    Proceed to Payment
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default Donation;
