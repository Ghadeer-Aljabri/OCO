import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Form, FormGroup, Label, Input, Button, Alert, Row, Col } from "reactstrap";
import { FaStar } from "react-icons/fa";
import Header from "./Header";
import { submitFeedback } from "../Features/FeedbackSlice";
import "../styles/Help.css"; // Import CSS file for styling
import Footer from "./Footer";

const Help = () => {
  const [formData, setFormData] = useState({ rating: 0, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [hover, setHover] = useState(null);
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      alert("User not logged in!");
      return;
    }
    dispatch(submitFeedback({
      userId: user._id,
      rating: formData.rating,
      message: formData.message
    }));
    setSubmitted(true);
  };

  return (
    <div className="help-bg">
    <Header />

    <Container className="help-container d-flex align-items-center justify-content-center vh-100">
      <Row className="justify-content-center w-100">
        <Col md="12" lg="12">
          {submitted ? (
            <Alert color="success" className="text-center fade-in">Thank you for your feedback!</Alert>
          ) : (
            <Form onSubmit={handleSubmit} className="feedback-form text-center">
                        <h2 className="text-center title">We'd Love to Hear from You, {user.name}!</h2>

              <FormGroup>
                <Label className="rating-label">Rate Your Experience</Label>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        size={30}
                        onClick={() => setFormData({ ...formData, rating: ratingValue })}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                        className={ratingValue <= (hover || formData.rating) ? "star active" : "star"}
                      />
                    );
                  })}
                </div>
              </FormGroup>
              <FormGroup>
                <Label for="message">Message</Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  rows="5"
                  placeholder="Write your message here"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="message-box"
                />
              </FormGroup>
              <Button color="primary" block type="submit" className="submit-btn">Submit</Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
    <Footer/>
    </div>

  );
};

export default Help;
