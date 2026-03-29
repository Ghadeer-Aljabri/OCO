import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerOrphan,clearMessages  } from "../Features/OrphanSlice";
import { Button, Form, FormGroup, Label, Input, Alert, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/OrphanRegistration.css"; // Importing styles

const OrphanRegistration = () => {
  const dispatch = useDispatch();
  const { isLoading, isError ,isSuccess} = useSelector((state) => state.orphan);

  const [orphan, setOrphan] = useState({
    name: "",
    age: "",
    gender: "Male",
    dob: "",
    guardianName: "",
    relationship: "",
    contactNumber: "",
    governorate: "",
    city: "",
    street: "",
    medicalConditions: "",
    schoolName: "",
    gradeLevel: "",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    setOrphan({ ...orphan, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedOrphan = {
        ...orphan,
        dob: new Date(orphan.dob).toISOString(), // Ensure dob is sent as a Date string
        address: {  // Match backend schema for address
            governorate: orphan.governorate,
            city: orphan.city,
            street: orphan.street,
        }
    };

    dispatch(registerOrphan(formattedOrphan));
};

useEffect(() => {
    if (isSuccess || isError) {
        setTimeout(() => {
            dispatch(clearMessages());
        }, 3000);
    }
}, [isSuccess, isError, dispatch]);

  return (
    <div className="orphan-registration-container">
      <Link to="/admin-dashboard" className=" text-primary text-decoration-none fw-bold">
                            ← Back to Admin Portal
            </Link>
      <h2>Register Orphan</h2>
      {isError && <Alert color="danger">{isError}</Alert>}
      {isSuccess && <Alert color="success">{isSuccess}</Alert>}

      <Form className="orphan-form" onSubmit={handleSubmit}>
        <Row>
          {/* Left Column */}
          <Col md={6}>
            <FormGroup>
              <Label>Full Name</Label>
              <Input type="text" name="name" value={orphan.name} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Age</Label>
              <Input type="number" name="age" value={orphan.age} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Gender</Label>
              <Input type="select" name="gender" value={orphan.gender} onChange={handleChange} className="form-input">
                <option>Male</option>
                <option>Female</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Date of Birth</Label>
              <Input type="date" name="dob" value={orphan.dob} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Guardian Name</Label>
              <Input type="text" name="guardianName" value={orphan.guardianName} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Relationship</Label>
              <Input type="text" name="relationship" value={orphan.relationship} onChange={handleChange} required className="form-input" />
            </FormGroup>
          </Col>

          {/* Right Column */}
          <Col md={6}>
            <FormGroup>
              <Label>Contact Number</Label>
              <Input type="text" name="contactNumber" value={orphan.contactNumber} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Governorate</Label>
              <Input type="text" name="governorate" value={orphan.governorate} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>City</Label>
              <Input type="text" name="city" value={orphan.city} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Street Address</Label>
              <Input type="text" name="street" value={orphan.street} onChange={handleChange} required className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>Medical Conditions</Label>
              <Input type="text" name="medicalConditions" value={orphan.medicalConditions} onChange={handleChange} className="form-input" />
            </FormGroup>
            <FormGroup>
              <Label>School Name</Label>
              <Input type="text" name="schoolName" value={orphan.schoolName} onChange={handleChange} className="form-input" />
            </FormGroup>
          </Col>
        </Row>

        {/* Additional Notes & Submit Button (Full Width) */}
        <FormGroup>
          <Label>Additional Notes</Label>
          <Input type="textarea" name="additionalNotes" value={orphan.additionalNotes} onChange={handleChange} className="form-input" />
        </FormGroup>

        <Button color="primary" type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Registering..." : "Register Orphan"}
        </Button>
      </Form>
    </div>
  );
};

export default OrphanRegistration;
