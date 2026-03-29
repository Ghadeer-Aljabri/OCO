import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans } from "../Features/OrphanSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardText,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import boyAvatar from "../Images/boy2.jpg";
import girlAvatar from "../Images/girl3.jpg";
import Header from "./Header";
import longcard from "../Images/longcard1.png";
import "../styles/Sponsorship.css";
import Footer from "./Footer";
import { useTheme } from '../ThemeContext'; 


const Sponsorship = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState(""); // For age filter (low to high or high to low)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const { orphans, isLoading } = useSelector((state) => state.orphan);

  const { changeTheme, theme } = useTheme(); // Now also get `theme`

  // Determine hue rotation or tint per theme
  const themeFilter = {
    light: 'none',
    dark: 'brightness(0.7) contrast(1.2)',
    blue: 'hue-rotate(180deg)',
    green: 'hue-rotate(90deg)',
  };

  useEffect(() => {
    dispatch(fetchOrphans());
  }, [dispatch]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const handleFilterChange = (gender) => {
    setFilter(gender);
    setCurrentPage(1); // reset to page 1 when filter changes
  };

  const handleAgeFilterChange = (ageOrder) => {
    setAgeFilter(ageOrder);
    setCurrentPage(1); // reset to page 1 when age filter changes
  };

  const handleCardClick = (orphanId) => navigate(`/Payment/${orphanId}`);
  const getAvatar = (gender) => (gender === "Male" ? boyAvatar : girlAvatar);

  // Filter by gender
  const filteredOrphans = orphans.filter((orphan) =>
    filter === "all" ? true : orphan.gender === filter
  );

  // Sort by age
  const sortedOrphans = filteredOrphans.sort((a, b) => {
    if (ageFilter === "lowToHigh") {
      return a.age - b.age;
    } else if (ageFilter === "highToLow") {
      return b.age - a.age;
    }
    return 0; // Default to no sorting
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentOrphans = sortedOrphans.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(sortedOrphans.length / cardsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="sponsorship-div">
      <Header />
      <Row className="justify-content-center">
        <Col md="12">
          <img
            src={longcard} // Replace with actual banner image
            alt="Sponsor Banner"
            width="100%"
            height="80%"
            style={{
              borderRadius: '10px',
              filter: themeFilter[theme] || 'none',
              transition: 'filter 0.3s ease'
            }}
          />
        </Col>
      </Row>
      <Container className="sponsorship-container">
        <div className="section-header-wrapper text-center">
          <h1 className="section-title-custom">Sponsor an Orphan</h1>
        </div>

        {/* Combined Filter Dropdown */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="custom-dropdown-container">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret color="success">
                Filter:{" "}
                {filter === "all"
                  ? "All"
                  : filter === "Male"
                  ? "Boys"
                  : "Girls"}
                {" | "}
                {ageFilter === "lowToHigh"
                  ? "Age: Low to High"
                  : ageFilter === "highToLow"
                  ? "Age: High to Low"
                  : "Age: None"}
              </DropdownToggle>
              <DropdownMenu className="custom-dropdown-menu">
                <DropdownItem onClick={() => handleFilterChange("all")}>
                  All
                </DropdownItem>
                <DropdownItem onClick={() => handleFilterChange("Male")}>
                  Boys
                </DropdownItem>
                <DropdownItem onClick={() => handleFilterChange("Female")}>
                  Girls
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem
                  onClick={() => handleAgeFilterChange("lowToHigh")}
                >
                  Age: Low to High
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleAgeFilterChange("highToLow")}
                >
                  Age: High to Low
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Orphan Cards */}
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner color="success" />
          </div>
        ) : (
          <>
            <Row className="justify-content-center">
              {currentOrphans.map((orphan) => (
                <Col md="3" sm="6" xs="12" key={orphan._id} className="mb-4">
                  <Card className="orphan-card h-100">
                    <div className="avatar-wrapper ">
                      <img src={getAvatar(orphan.gender)} alt="Orphan Avatar" />
                    </div>
                    <CardBody className="card-body">
                      <CardText className="fw-bold">
                        {orphan.name || "N/A"}
                      </CardText>
                      <CardText className="text-muted">
                        {orphan.gender} | {orphan.age} yrs old
                      </CardText>
                      <button
                        className="sponsor-btn mt-2"
                        onClick={() => handleCardClick(orphan._id)}
                      >
                        Sponsor
                      </button>
                    </CardBody>
                    <div className="card-footer text-center">
                      ZAKAT | SADAQAH | LILLAH
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
              {[...Array(totalPages).keys()].map((num) => {
                const page = num + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn btn-sm mx-1 ${
                      page === currentPage
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            to="/home"
            className="go-back-home text-success text-decoration-none fw-bold"
          >
            ← Back to Home
          </Link>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Sponsorship;
