import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUser, deleteUser } from "../Features/UserSlice"; 
import { Button, Table, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from "reactstrap";
import "../styles/ManageUsers.css";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users = [], isLoading, isError, errorMessage } = useSelector((state) => state.user);

  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const governorates = ["All Users", ...new Set(users.map((user) =>  user.governorate))];

  // Filter users based on governorate selection
  const filteredUsersByGovernorate = selectedGovernorate && selectedGovernorate !== "All Users"
    ? users.filter(user => user.governorate === selectedGovernorate)
    : users;

  // Filter users based on search query (name or email)
  const filteredUsers = filteredUsersByGovernorate.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch users on component mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Handle edit button click
  const handleEditClick = (user) => {
    setEditUser({ ...user });
    setEditModalOpen(true);
  };

  // Handle form submission for editing
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      dispatch(updateUser(editUser));
      setEditModalOpen(false);
    }
  };

  // Handle delete
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="mu-bg">
      <Link to="/admin-dashboard" className=" text-primary text-decoration-none fw-bold">
                      ← Back to Admin Portal
      </Link>
      <div className="container mt-4">
        <h2 className=" text-primary text-decoration-none fw-bold">User Management</h2>
        
        {/* Search Bar */}
        <div className="search-container mb-3">
          <Input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Governorate Filter */}
        <div className="filter-container">
          <Label for="governorateFilter" className="filter-label">Filter by Governorate:</Label>
          <Input
            type="select"
            id="governorateFilter"
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
            className="filter-dropdown"
          >
            {governorates.map((gov, index) => (
              <option key={index} value={gov}>
                {gov}
              </option>
            ))}
          </Input>
        </div>

        {/* User Table */}
        <table bordered hover striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Governorate</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNo}</td>
                  <td>{user.governorate}</td>
                  <td>
                    {Array.isArray(user.feedback) && user.feedback.length > 0 ? (
                      user.feedback.map((fb, index) => (
                        <p key={index}>
                          {fb.message} - ⭐{fb.rating}
                        </p>
                      ))
                    ) : (
                      <p>No feedback yet</p>
                    )}
                  </td>
                  <td>
                    <Button color="success" size="sm" onClick={() => handleEditClick(user)}>
                      Edit
                    </Button>
                    <Button color="danger" size="sm" className="ms-2" onClick={() => handleDelete(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Edit User Modal */}
        <Modal isOpen={isEditModalOpen} toggle={() => setEditModalOpen(false)}>
          <ModalHeader toggle={() => setEditModalOpen(false)}>Edit User</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleEditSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={editUser?.name || ""}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editUser?.email || ""}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone</Label>
                <Input
                  type="text"
                  value={editUser?.phoneNo || ""}
                  onChange={(e) => setEditUser({ ...editUser, phoneNo: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Governorate</Label>
                <Input
                  type="text"
                  value={editUser?.governorate || ""}
                  onChange={(e) => setEditUser({ ...editUser, governorate: e.target.value })}
                />
              </FormGroup>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsers;
