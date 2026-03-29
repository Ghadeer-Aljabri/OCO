import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Header from "./Header";
import users from "../Images/users.webp";
import donations from "../Images/donation.webp";
import manage from "../Images/manage.webp";
import urgent from "../Images/urgent.webp";
import reg from "../Images/register.webp";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    { title: "Manage Users", path: "/admin/manage-users", bgImage: users },
    { title: "Review Donations", path: "/admin/review-donations", bgImage: donations },
    { title: "Manage Orphan Profiles", path: "/admin/manage-orphans", bgImage: manage },
    { title: "Urgent Assistance Fund", path: "/admin/urgent-fund", bgImage: urgent },
    { title: "Register Orphans", path: "/admin/register-orphans", bgImage: reg },
  ];

  return (
    <div>
      <Header />
      <Container fluid className="admin-dashboard-container">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <Row className="justify-content-center">
          {modules.map((module, index) => (
            <Col md="6" key={index} className="mb-5">
              <div
                className="dashboard-card"
                style={{ backgroundImage: `url(${module.bgImage})` }}
                onClick={() => navigate(module.path)}
              >
                <div className="card-overlay" />
                <div className="card-content">
                  <h4 className="card-title-text">{module.title}</h4>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
