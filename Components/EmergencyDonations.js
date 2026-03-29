import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans } from "../Features/OrphanSlice";
import { Container, Input, Button } from "reactstrap";
import "../styles/EmergencyDonations.css"; // Ensure this file exists for styles
import Header from "./Header";
import Footer from "./Footer";

const EmergencyDonations = () => {
  const { orphanId } = useParams();  // Get orphanId from the URL parameters
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [amountPaid, setAmountPaid] = useState("");

  const orphans = useSelector((state) => state.orphan.orphans);
  const status = useSelector((state) => state.orphan.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrphans());
    }
  }, [status, dispatch]);

  const orphan = orphans.find((o) => o._id === orphanId);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // ✅ Navigate to carddetails with orphanId, amount, and mode
    navigate('/CardDetails', { state: { amountPaid, orphanId, mode: 'donation' } });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!orphan) return <p className="centered-text">Loading orphan details...</p>;

  return (
    <div>
        <Header/>
    <Container className="donation-container">
      <Button color="secondary" className="go-back-button" onClick={handleGoBack}>
        Go Back
      </Button>
      <h2 className="donation-title">
        Donating to <strong>{orphan.name}</strong> – Emergency Case
      </h2>

      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          placeholder="Enter donation amount (OMR)"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="donation-input"
        />
        <Button color="success" className="donation-button" type="submit">
          Pay Now
        </Button>
      </form>
    </Container>
    <Footer/>
    </div>
  );
};

export default EmergencyDonations;
