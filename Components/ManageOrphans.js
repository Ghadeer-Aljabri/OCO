import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans, deleteOrphan, updateOrphan } from "../Features/OrphanSlice";
import { Card, CardBody, CardTitle, CardText, Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from "reactstrap";
import "../styles/ManageOrphans.css"
import { Link } from "react-router-dom";

const ManageOrphans = () => {
    const dispatch = useDispatch();
    const { orphans, isLoading, isError } = useSelector((state) => state.orphan);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModal, setEditModal] = useState(false);
    const [currentOrphan, setCurrentOrphan] = useState(null);

    useEffect(() => {
        dispatch(fetchOrphans());
    }, [dispatch]);

    // Handle delete orphan
    const handleDelete = (id) => {
        dispatch(deleteOrphan(id));
    };

    // Open edit modal
    const openEditModal = (orphan) => {
        setCurrentOrphan(orphan);
        setEditModal(true);
    };

    // Handle edit input change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentOrphan((prev) => ({
            ...prev,
            [name]: value,
            address: name.startsWith("address.") ? { ...prev.address, [name.split(".")[1]]: value } : prev.address
        }));
    };

    // Handle form submission
    const handleEditSubmit = () => {
        dispatch(updateOrphan(currentOrphan));
        setEditModal(false);
    };

    // Filter orphans based on search term
    const filteredOrphans = orphans.filter((orphan) =>
        orphan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
        <Link to="/admin-dashboard" className=" text-primary text-decoration-none fw-bold">
                                  ← Back to Admin Portal
                  </Link>
        <div className="orphan-list-container">
            
            <h2>Orphan Management</h2>
            {isError && <p className="error">{isError}</p>}
            <Input type="text" placeholder="Search by name..." onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="orphan-cards">
                {isLoading ? (
                    <p>Loading...</p>
                ) : filteredOrphans.length === 0 ? (
                    <p>No orphans found</p>
                ) : (
                    filteredOrphans.map((orphan) => (
                        <Card key={orphan._id} className="orphan-card">
                            <CardBody>
                                <CardTitle tag="h5">{orphan.name}</CardTitle>
                                <CardText>Age: {orphan.age}</CardText>
                                <CardText>Gender: {orphan.gender}</CardText>
                                <CardText>Guardian: {orphan.guardianName}</CardText>
                                <CardText>Contact: {orphan.contactNumber}</CardText>
                                <CardText>City: {orphan.address.city}</CardText>
                                <CardText>School: {orphan.schoolName}</CardText>
                                <Button color="success" onClick={() => openEditModal(orphan)}>Edit</Button>{" "}
                                <Button color="danger" onClick={() => handleDelete(orphan._id)}>Delete</Button>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {currentOrphan && (
                <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
                    <ModalHeader toggle={() => setEditModal(!editModal)}>Edit Orphan</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input type="text" name="name" value={currentOrphan.name} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Age</Label>
                                <Input type="number" name="age" value={currentOrphan.age} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Guardian Name</Label>
                                <Input type="text" name="guardianName" value={currentOrphan.guardianName} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Relationship</Label>
                                <Input type="text" name="relationship" value={currentOrphan.relationship} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Contact Number</Label>
                                <Input type="text" name="contactNumber" value={currentOrphan.contactNumber} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Governorate</Label>
                                <Input type="text" name="address.governorate" value={currentOrphan.address.governorate} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>City</Label>
                                <Input type="text" name="address.city" value={currentOrphan.address.city} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Street</Label>
                                <Input type="text" name="address.street" value={currentOrphan.address.street} onChange={handleEditChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label>School Name</Label>
                                <Input type="text" name="schoolName" value={currentOrphan.schoolName} onChange={handleEditChange} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleEditSubmit}>Save Changes</Button>
                        <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
        </div>
    );
};

export default ManageOrphans;
