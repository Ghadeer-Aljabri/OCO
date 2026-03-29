import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans } from "../Features/OrphanSlice";
import {
  Container,
  Card,
  CardBody,
  CardText,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import boyAvatar from "../Images/boy2.jpg";
import girlAvatar from "../Images/girl3.jpg";
import Header from "./Header";
import "../styles/Payment.css";
import Footer from "./Footer";

const Payment = () => {
  const { orphanId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orphans, isLoading } = useSelector((state) => state.orphan);

  useEffect(() => {
    if (orphans.length === 0) {
      dispatch(fetchOrphans());
    }
  }, [dispatch, orphans.length]);

  const orphan = orphans.find((o) => o._id === orphanId);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner color="success" />
      </div>
    );
  }

  if (!orphan) {
    return (
      <h2 className="text-center text-danger mt-5">
        Orphan profile not found.
      </h2>
    );
  }

  return (
    <div style={{  minHeight: "100vh" }}>
      <Header />
      <Container className="py-5">
        {/* ❤️ Grateful Message */}
        <div
          className="text-center p-4 mb-4"
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
          }}
        >
          <h4 className="text-success fw-bold mb-2">
            Thank You for Your Kind Heart 
          </h4>
          <p className="text-muted mb-0">
            Your generosity is lighting up a young life. Sponsoring a child
            today means giving them hope, support, and a brighter future.
          </p>
        </div>
        <hr className="divider" />


        {/* Orphan Profile */}
        <Card
          className=" shadow-sm p-4 mb-5"
          style={{ borderRadius: "16px" }}
        >
          <CardBody className="text-center">
            <img
              src={orphan.gender === "Male" ? boyAvatar : girlAvatar}
              alt="Orphan Avatar"
              className="rounded-circle shadow mb-3"
              width="130"
              height="130"
            />
            <h4 className="text-success fw-bold mb-2">
              {orphan.name || "Orphan Name"}
            </h4>
            <CardText className="mb-1">
              <strong>Age:</strong> {orphan.age} years
            </CardText>
            {/* <CardText className="mb-1">
              <strong>Background:</strong> {orphan.background}
            </CardText>
            <CardText className="mb-1">
              <strong>Needs:</strong> {orphan.needs}
            </CardText>
            <CardText className="mb-1">
              <strong>Country:</strong> {orphan.country}
            </CardText>
            <CardText>
              <strong>Education Level:</strong> {orphan.educationLevel}
            </CardText> */}
          </CardBody>
        </Card>
        <hr className="divider" />

        {/* Sponsorship Options */}
        <h5 className="text-center mb-4 text-success fw-semibold">
          Choose Sponsorship Duration
        </h5>
        <Row className="justify-content-center">
          {[3, 6, 12].map((months) => (
            <Col md="4" sm="6" xs="12" key={months} className="mb-4">
              <Card
                className="text-center shadow-sm "
                style={{ borderRadius: "17px" }}
              >
                <CardBody>
                  <h6 className="fw-bold text-success">{months} Months</h6>
                  <CardText className="mb-2">
                    Total: <strong>${months * 30}</strong> OMR
                  </CardText>
                  <Button
                    color="success"
                    outline
                    className="w-100 custom-success-button"
                    onClick={() =>
                      navigate(`/carddetails/${orphanId}`, {
                        state: {
                          amountPaid: months * 30, // Total amount paid
                          duration: months, // Duration in months
                          mode: 'sponsorship', orphanId
                        },
                      })
                    }
                  >
                    Sponsor for {months} Months
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Go Back */}
        <div className="text-center mt-4"></div>
        <div className="text-center">
          <Link
            onClick={() => navigate(-1)}
            className="go-back-link text-success text-decoration-none fw-bold"
          >
            ← Go Back
          </Link>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Payment;
