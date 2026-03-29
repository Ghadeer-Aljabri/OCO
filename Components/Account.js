import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardTitle, CardText, Spinner } from "reactstrap";
import { fetchSponsorships } from "../Features/SponsorshipSlice"; // Adjust path if needed

const Account = () => {
  const dispatch = useDispatch();
  
  // Access the logged-in user info from Redux
  const user = useSelector((state) => state.user.userInfo);
  
  // State for sponsorships, loading, and error
  const { sponsorships, isLoading, error } = useSelector((state) => state.sponsorship);

  // Fetch sponsorships when the component mounts or when the user changes
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchSponsorships(user._id)); // Pass the logged-in user's ID
    }
  }, [dispatch, user]);

  return (
    <div className="p-3">
      <h3 className="mb-4">Account Settings</h3>

      {isLoading ? (
        <Spinner color="success" />
      ) : error ? (
        <div className="text-danger">Error: {error}</div>
      ) : (
        <>
          {sponsorships.length > 0 ? (
            <div>
              <h5>Sponsored Children</h5>
              {sponsorships.map((sponsorship, index) => (
                <Card className="mb-3" key={index}>
                  <CardBody>
                    <CardTitle tag="h6">{sponsorship.orphanDetails.name}</CardTitle>
                    <CardText>
                      Age: {sponsorship.orphanDetails.age} <br />
                      Country: {sponsorship.orphanDetails.country} <br />
                      Amount Paid: {sponsorship.amountPaid} OMR <br />
                      Duration: {sponsorship.duration} months <br />
                    </CardText>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <p>No sponsored children found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
