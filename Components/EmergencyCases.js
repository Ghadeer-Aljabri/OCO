import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans } from "../Features/OrphanSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/EmergencyCases.css";
import Header from "./Header";
import Footer from "./Footer";

const EmergencyCases = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orphans = useSelector((state) => state.orphan.orphans);
  const status = useSelector((state) => state.orphan.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrphans());
    }
  }, [dispatch, status]);


  const handleDonate = (id) => {
    navigate(`/EmergencyDonations/${id}`);
  };


  const filteredOrphans = orphans.filter(
    (orphan) =>
      orphan.predictedNeed &&
      orphan.predictedNeed !== "None" &&
      orphan.predictedNeed.trim() !== ""
  );

  return (
    <div> 
      <Header/>
    <Container className="emergency-container mt-4">


      <Row>
        {filteredOrphans.length === 0 ? (
          <Col>
            <h4 className="no-cases">No Urgent Cases Found</h4>
          </Col>
        ) : (
          filteredOrphans.map((orphan) => (
            <Col sm="12" md="6" lg="4" key={orphan._id} className="mb-4">
              <Card className="orphan-card">
                <CardBody>
                  <CardTitle tag="h5">{orphan.name}</CardTitle>
                  <CardText>Age: {orphan.age}</CardText>
                  <CardText>Gender: {orphan.gender}</CardText>

                  <CardText>
                    <strong>Urgent Need:</strong> {orphan.predictedNeed}
                  </CardText>
                  <Button color="danger" size="sm" onClick={() => handleDonate(orphan._id)}>
                    Donate Now
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
    <Footer/>
    </div>
  );
};

export default EmergencyCases;
