import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';  // Added useLocation for accessing passed state
import { useDispatch,useSelector  } from 'react-redux';
import { createSponsorship } from '../Features/SponsorshipSlice'; // Import the action
import { createDonation } from '../Features/DonationSlice';

import {
  Card,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  FormFeedback,
} from 'reactstrap';
import paymentImage from '../Images/hands.jpg'; // Replace with your image path

const CardDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use Redux dispatch
  const { orphanId } = useParams(); // Getting orphanId from URL params
  const location = useLocation();  // To access the state passed from the Payment page
  const [cardDetails, setCardDetails] = useState({
    holderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.user.userInfo);  // Accessing the logged-in user from Redux store
  const [userId, setUserId] = useState(user ? user._id : ''); // Set the userId from Redux store
  
  // Retrieve the amount paid from the location state passed from the Payment page
  const { amountPaid, duration,mode } = location.state || {};


  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails((prev) => ({ ...prev, cardNumber: formatted }));

    const rawDigits = formatted.replace(/\D/g, '');
    const firstDigit = rawDigits.charAt(0);
    if (firstDigit === '4') setCardType('Visa');
    else if (firstDigit === '5') setCardType('MasterCard');
    else setCardType('');
  };

  const validate = () => {
    const newErrors = {};
    const { holderName, cardNumber, expiryDate, cvv } = cardDetails;

    const digitsOnly = cardNumber.replace(/\s/g, '');

    if (!holderName.trim()) newErrors.holderName = 'Card holder name is required.';
    if (digitsOnly.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits.';
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Expiry must be in MM/YY format.';
    } else {
      const [mm, yy] = expiryDate.split('/').map(Number);
      if (mm < 1 || mm > 12) {
        newErrors.expiryDate = 'Month must be between 01 and 12.';
      } else {
        const current = new Date();
        const exp = new Date(2000 + yy, mm);
        if (exp <= current) newErrors.expiryDate = 'Card has expired.';
      }
    }
    if (!/^\d{3}$/.test(cvv)) newErrors.cvv = 'CVV must be 3 digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isSponsorship = mode === 'sponsorship';
  
    const paymentData = isSponsorship
      ? {
          orphanId,
          userId: user._id,
          amountPaid,
          duration,
          paymentDetails: cardDetails,
        }
      : {
          userId: user._id,
          amountPaid,
          paymentDetails: cardDetails,
        };
  
    const dispatchAction = isSponsorship ? createSponsorship : createDonation;
    const paymentType = isSponsorship ? 'Sponsorship' : 'Donation';
  
    try {
      // Dispatch action for payment (either sponsorship or donation)
      await dispatch(dispatchAction(paymentData)).unwrap();
  
      alert(`${paymentType} payment for ${cardDetails.holderName} processed successfully!`);
  
      // Calculate the next due date if it's a sponsorship
      let nextDueDate = null;
      if (isSponsorship) {
        const durationInMonths = duration;
        const currentDate = new Date();
        nextDueDate = new Date(currentDate.setMonth(currentDate.getMonth() + durationInMonths)); // Adding duration to the current date
      }
  
      // Send receipt
      await fetch('http://localhost:8080/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          amountPaid,
          paymentType,
          date: new Date().toLocaleDateString('en-GB'),
          duration: isSponsorship ? duration : undefined,  // Include duration only for sponsorship
          nextDueDate: nextDueDate ? nextDueDate.toLocaleDateString('en-GB') : undefined,  // Only include nextDueDate for sponsorship
        }),
      });
  
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert(`Error processing ${paymentType}: ${error.message || error}`);
    }
  };
  
  
  

  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel?');
    if (confirmCancel) {
      navigate(-1); // Go back to the previous page
    }
  };

  return (
    <div className="container my-5">
      <Row className="justify-content-center">
        <Col md="10">
          <Card className="shadow-sm">
            <Row className="g-0">
              <Col md="6" className="d-flex align-items-center justify-content-center p-4">
                <img
                  src={paymentImage}
                  alt="Payment Illustration"
                  className="img-fluid"
                  width="700px"
                />
              </Col>

              <Col md="6" className="p-4">
                <h5 className="mb-4 text-center">Enter Payment Information</h5>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="holderName">Card Holder Name</Label>
                    <Input
                      type="text"
                      id="holderName"
                      placeholder="John Doe"
                      value={cardDetails.holderName}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, holderName: e.target.value })
                      }
                      invalid={!!errors.holderName}
                    />
                    <FormFeedback>{errors.holderName}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label for="cardNumber">Card Number</Label>
                    <Input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      invalid={!!errors.cardNumber}
                    />
                    <FormFeedback>{errors.cardNumber}</FormFeedback>
                    <small className="text-muted">
                      {cardType ? `Card Type: ${cardType}` : 'Enter card number to detect type'}
                    </small>
                  </FormGroup>

                  <FormGroup>
                    <Label for="expiryDate">Expiry Date</Label>
                    <Input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                      }
                      invalid={!!errors.expiryDate}
                    />
                    <FormFeedback>{errors.expiryDate}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label for="cvv">CVV</Label>
                    <Input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      maxLength="3"
                      invalid={!!errors.cvv}
                    />
                    <FormFeedback>{errors.cvv}</FormFeedback>
                  </FormGroup>

                  <div className="text-center">
                    <Button color="success" type="submit" className="w-100 mb-3">
                      Pay Now
                    </Button>
                    <Button color="danger" className="w-100" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CardDetails;
