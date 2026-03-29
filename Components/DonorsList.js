import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonations } from "../Features/DonationSlice";
import { Container, Card, CardBody, Table, Spinner, Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../styles/DonorsList.css"; // Ensure this file exists for styles

const DonorsList = () => {
  const dispatch = useDispatch();
  const { donations = [], loading, error } = useSelector((state) => state.donations);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  const openReceiptModal = (donation) => {
    setSelectedDonation(donation);
    setModalOpen(true);
  };

  const handlePrint = (tableId) => {
    const printContents = document.getElementById(tableId).innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        table {
          border-collapse: collapse;
          width: 100%;
        }
        table th, table td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }
        table th {
          background-color: #f2f2f2;
        }
      }
    `;
    document.head.appendChild(style);

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleDownloadPDF = (tableId) => {
    const element = document.getElementById(tableId);
    html2pdf()
      .from(element)
      .set({ margin: 1, filename: "Donation_Receipt.pdf", html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "letter", orientation: "portrait" } })
      .save();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner color="success" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger py-5">
        Error: {error}
      </div>
    );
  }

  const totalAmount = donations.reduce((acc, donation) => acc + (donation.amountPaid || 0), 0);

  const topDonors = [...donations]
    .sort((a, b) => (b.amountPaid || 0) - (a.amountPaid || 0))
    .slice(0, 5);

  const donationsByRegion = donations.reduce((regions, donation) => {
    const region = donation.userDetails?.governorate || "Unknown";
    regions[region] = (regions[region] || 0) + (donation.amountPaid || 0);
    return regions;
  }, {});

  // Utility to format month as "Month Year" (e.g., "May 2025")
const formatMonth = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

// Compute total donations per month
const monthlyTotals = donations.reduce((acc, donation) => {
  const month = formatMonth(donation.createdAt);
  acc[month] = (acc[month] || 0) + (donation.amountPaid || 0);
  return acc;
}, {});

const donationsByUser = donations.reduce((acc, donation) => {
  const name = donation.userDetails?.name || "Unknown";
  if (!acc[name]) {
    acc[name] = { total: 0, count: 0 };
  }
  acc[name].total += donation.amountPaid || 0;
  acc[name].count += 1;
  return acc;
}, {});

  return (
    <Container className="py-5">
      <Link
        to="/admin-dashboard"
        className="text-primary text-decoration-none fw-bold mb-4 d-block"
      >
        ← Back to Admin Portal
      </Link>

      <h2 className="text-success mb-5 text-center">📋 Donors Full Report</h2>

      {/* Donations Table */}
      <Card className="mb-5 shadow-sm border-0">
        <CardBody>
          <h4 className="mb-4 text-center text-secondary">All Donation Records</h4>
          <div id="donations-table">
          <Table bordered responsive hover className="text-center" id="donations-table">
            <thead className="table-success">
              <tr>
                <th>Donor Name</th>
                <th>Email</th>
                <th>Amount Donated (OMR)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.userDetails?.name || "Unknown"}</td>
                    <td>{donation.userDetails?.email || "N/A"}</td>
                    <td>{(donation.amountPaid || 0).toFixed(2)}</td>
                    <td>
                      {new Date(donation.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No donors found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          <div className="text-center mt-3">
            <Button color="primary"  className="me-2" onClick={() => handlePrint("donations-table")}>🖨️ Print Table</Button>
            <Button color="success"  onClick={() => handleDownloadPDF('donations-table')}>📄 Download PDF</Button>
          </div>
        </CardBody>
      </Card>
      <Card className="mb-5 shadow-sm border-0">
  <CardBody>
    <h4 className="text-success mb-4 text-center">🤝 Donations Summary by Donor</h4>

    <div id="donations-summary-table">
      <Table bordered responsive hover className="text-center">
        <thead className="table-info">
          <tr>
            <th>Donor Name</th>
            <th>Total Donated (OMR)</th>
            <th>Number of Donations</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(donationsByUser).map(([name, data]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{data.total.toFixed(2)}</td>
              <td>{data.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    <div className="text-center mt-3">
      <Button color="primary" className="me-2" onClick={() => handlePrint("donations-summary-table")}>
        🖨️ Print Table
      </Button>
      <Button color="success" onClick={() => handleDownloadPDF("donations-summary-table")}>
        📄 Download PDF
      </Button>
    </div>
  </CardBody>
</Card>

      <Card className="mb-5 shadow-sm border-0">
  <CardBody>
    <h4 className="text-success mb-4 text-center">📈 Donations by Month</h4>
    
    <div id="monthly-donations-table">
      <Table bordered responsive hover className="text-center">
        <thead className="table-success">
          <tr>
            <th>Month</th>
            <th>Total Donations (OMR)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(monthlyTotals).map(([month, total]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    <div className="text-center mt-3">
      <Button color="primary" className="me-2" onClick={() => handlePrint("monthly-donations-table")}>
        🖨️ Print Table
      </Button>
      <Button color="success" onClick={() => handleDownloadPDF("monthly-donations-table")}>
        📄 Download PDF
      </Button>
    </div>
  </CardBody>
</Card>


      {/* Highest Paid Donors */}
      <Card className="mb-5 shadow-sm border-0">
        <CardBody>
          <h4 className="text-success mb-4 text-center">🏆 Highest Paid Donors</h4>
          <div id="top-donors-table">
          <Table bordered responsive hover className="text-center" id="top-donors-table">
            <thead className="table-info">
              <tr>
                <th>Donor Name</th>
                <th>Email</th>
                <th>Amount Donated (OMR)</th>
              </tr>
            </thead>
            <tbody>
              {topDonors.length > 0 ? (
                topDonors.map((donor) => (
                  <tr key={donor._id}>
                    <td>{donor.userDetails?.name || "Unknown"}</td>
                    <td>{donor.userDetails?.email || "N/A"}</td>
                    <td>{(donor.amountPaid || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No donors found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          </div>
          <div className="text-center mt-3">
            <Button color="primary" onClick={() => handlePrint('top-donors-table')}>🖨️ Print Table</Button>
            <Button color="success" onClick={() => handleDownloadPDF('top-donors-table')}>📄 Download PDF</Button>
          </div>
        </CardBody>
      </Card>

      {/* Top Donations by Region */}
      <Card className="mb-5 shadow-sm border-0">
        <CardBody>
          <h4 className="text-success mb-4 text-center">🌍 Donations by Region</h4>
          <div id="region-donations-table">
          <Table bordered responsive hover className="text-center" id="region-donations-table">
            <thead className="table-warning">
              <tr>
                <th>Region</th>
                <th>Total Donated (OMR)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(donationsByRegion)
                .sort((a, b) => b[1] - a[1])
                .map(([region, total], index) => (
                  <tr key={index}>
                    <td>{region}</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          </div>
          <div className="text-center mt-3">
            <Button color="primary" onClick={() => handlePrint('region-donations-table')}>🖨️ Print Table</Button>
            <Button color="success" onClick={() => handleDownloadPDF('region-donations-table')}>📄 Download PDF</Button>
          </div>
        </CardBody>
      </Card>

      {/* Receipt Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} size="lg">
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Donation Acknowledgement Receipt
        </ModalHeader>
        <ModalBody>
          {selectedDonation && (
            <div id="receipt-content" className="p-4">
              <h4 className="text-center mb-3">📜 Received Donations Acknowledgement</h4>
              <hr />
              <p><strong>Receipt ID:</strong> {selectedDonation._id}</p>
              <p><strong>Donor Name:</strong> {selectedDonation.userDetails?.name || "Unknown"}</p>
              <p><strong>Email:</strong> {selectedDonation.userDetails?.email || "N/A"}</p>
              <p><strong>Amount Paid:</strong> {(selectedDonation.amountPaid || 0).toFixed(2)} OMR</p>
              <p><strong>Date:</strong> {new Date(selectedDonation.createdAt).toLocaleDateString("en-GB")}</p>
              <hr />
              <p className="text-center mt-4">Thank you for your generous support!</p>
              <p className="text-center">Organization Name | Contact Info</p>
            </div>
          )}
          {/* Buttons */}
          <div className="text-center mt-4">
            <Button color="primary" className="me-2" onClick={handlePrint}>
              🖨️ Print Receipt
            </Button>
            <Button color="success" onClick={handleDownloadPDF}>
              📄 Download Receipt PDF
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default DonorsList;
