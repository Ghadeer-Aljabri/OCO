import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonations } from "../Features/DonationSlice"; // adjust path if needed
import { Button, Table } from "reactstrap";
import "../styles/ReviewDonations.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ReviewDonations = () => {
  const dispatch = useDispatch();
  const {
    donations = [],
    loading,
    error,
  } = useSelector((state) => state.donations);
  console.log("Donations from Redux:", donations);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const filteredDonations = donations.filter(
    (donation) =>
      donation.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredDonations.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(filteredDonations.length / recordsPerPage);

  if (loading) {
    return <div className="donations-container">Loading donations...</div>;
  }

  if (error) {
    return (
      <div className="donations-container text-danger">Error: {error}</div>
    );
  }
  const gotoDonors = () => {
    navigate("/donorslist");
  };
  return (
    <div className="donations-container">
      <Link
        to="/admin-dashboard"
        className="text-primary text-decoration-none fw-bold"
      >
        ← Back to Admin Portal
      </Link>
      <h2>📊 Donation Records</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search by name or email..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <div className="table-container">
        <table bordered="true">
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Amount (OMR)</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation._id}</td>
                <td>{donation.userDetails?.name || "Unknown"}</td> {/* Displaying user name */}
                <td>{donation.userDetails?.email || "N/A"}</td> {/* Displaying user email */}
                <td className="text-right">{(donation.amountPaid || 0).toFixed(2)}</td> {/* Displaying donation amount */}
                <td className="text-center">
                  {new Date(donation.createdAt).toLocaleDateString("en-GB")} {/* Displaying donation date */}
                </td>
                <td className="status status-success">Successful</td> {/* Status can be mapped based on your logic */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No donations found
              </td>
            </tr>
          )}


          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <Button
          className={`btn-prev ${currentPage === 1 ? "btn-disabled" : ""}`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          className={`btn-next ${
            currentPage === totalPages ? "btn-disabled" : ""
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ▶
        </Button>
      </div>
      <div>
        <Button onClick={gotoDonors}>
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ReviewDonations;
