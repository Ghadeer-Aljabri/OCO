import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrphans, updateOrphan } from "../Features/OrphanSlice"; 
import axios from "axios";
import "../styles/UrgentFund.css"; // Ensure styles are applied properly

const AdminUrgentAssistance = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false); // For controlling button state during processing
  const dispatch = useDispatch();
  
  // Access orphans state from Redux store
  const { orphans, isLoading } = useSelector((state) => state.orphan);
  
  // Filter orphans based on search input
  const filteredOrphans = orphans.filter((orphan) =>
    orphan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trigger prediction for individual orphan
  const triggerPrediction = async (orphanId) => {
    try {
      const orphan = orphans.find((o) => o._id === orphanId);
      
      // Prepare the data for prediction (ensure proper formatting)
      const predictionData = {
        age: orphan.age,
        gender_Female: orphan.gender === "Female" ? 1 : 0,
        gender_Male: orphan.gender === "Male" ? 1 : 0,
        medicalConditions_None: orphan.medicalConditions === "None" ? 1 : 0,
        medicalConditions_diabetic: orphan.medicalConditions === "diabetic" ? 1 : 0,
        schoolName_Not_enrolled: orphan.schoolName === "Not enrolled" ? 1 : 0,
        schoolName_Al_Noor_School: orphan.schoolName === "Al Noor School" ? 1 : 0,
        schoolName_Bright_Future_Academy: orphan.schoolName === "Bright Future Academy" ? 1 : 0,
        address_governorate_Muscat: orphan.address?.governorate === "Muscat" ? 1 : 0,
        address_governorate_Nizwa: orphan.address?.governorate === "Nizwa" ? 1 : 0,
        address_governorate_Dhofar: orphan.address?.governorate === "Dhofar" ? 1 : 0
      };

      console.log("Form Data being sent for prediction:", predictionData); // Log the prediction data

      // Send the prediction request
      const predictionResponse = await axios.post("http://127.0.0.1:5001/predict", predictionData);

      const predictedNeed = predictionResponse.data.predicted_need;
      console.log("Prediction Response:", predictionResponse.data); // Log the full prediction response

      // Check if prediction data is valid
      if (!predictedNeed || predictedNeed === "") {
        console.error("No valid prediction received.");
        return; // Exit if no prediction data is returned
      }

      // Create an updated orphan object with the predicted need
      const updatedOrphan = {
        ...orphan,
        predictedNeed: predictedNeed, // Update predicted need
      };

      // Dispatch the update action to update the orphan in the Redux store
      await dispatch(updateOrphan(updatedOrphan));

    } catch (error) {
      console.error("Error triggering prediction:", error);
    }
  };

  // Trigger predictions for all orphans
  const triggerAllPredictions = async () => {
    setIsProcessing(true); // Set processing flag to true to disable the button

    try {
      for (const orphan of orphans) {
        // Prepare the data for prediction (ensure proper formatting)
        const predictionData = {
          age: orphan.age,
          gender_Female: orphan.gender === "Female" ? 1 : 0,
          gender_Male: orphan.gender === "Male" ? 1 : 0,
          medicalConditions_None: orphan.medicalConditions === "None" ? 1 : 0,
          medicalConditions_diabetic: orphan.medicalConditions === "diabetic" ? 1 : 0,
          schoolName_Not_enrolled: orphan.schoolName === "Not enrolled" ? 1 : 0,
          schoolName_Al_Noor_School: orphan.schoolName === "Al Noor School" ? 1 : 0,
          schoolName_Bright_Future_Academy: orphan.schoolName === "Bright Future Academy" ? 1 : 0,
          address_governorate_Muscat: orphan.address?.governorate === "Muscat" ? 1 : 0,
          address_governorate_Nizwa: orphan.address?.governorate === "Nizwa" ? 1 : 0,
          address_governorate_Dhofar: orphan.address?.governorate === "Dhofar" ? 1 : 0
        };

        console.log("Form Data being sent for prediction:", predictionData); // Log the prediction data

        // Send the prediction request
        const predictionResponse = await axios.post("http://127.0.0.1:5001/predict", predictionData);

        const predictedNeed = predictionResponse.data.predicted_need;
        console.log("Prediction Response:", predictionResponse.data); // Log the full prediction response

        // Check if prediction data is valid
        if (predictedNeed && predictedNeed !== "") {
          // Create an updated orphan object with the predicted need
          const updatedOrphan = {
            ...orphan,
            predictedNeed: predictedNeed, // Update predicted need
          };

          // Dispatch the update action to update the orphan in the Redux store
          await dispatch(updateOrphan(updatedOrphan));
        }
      }
    } catch (error) {
      console.error("Error triggering predictions for all orphans:", error);
    } finally {
      setIsProcessing(false); // Reset processing flag when done
    }
  };

  // Use effect hook to fetch data on component mount
  useEffect(() => {
    dispatch(fetchOrphans());
  }, [dispatch]);

  return (
    <div>
      <h2>Admin Urgent Assistance</h2>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search by orphan name..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
      />

      {/* Button to trigger predictions for all */}
      <Button
        color="danger"
        onClick={triggerAllPredictions}
        disabled={isProcessing} // Disable the button if predictions are being processed
      >
        {isProcessing ? "Processing..." : "Trigger Prediction for All"}
      </Button>

      {/* Orphans List */}
      <div className="fund-cards">
        {isLoading ? (
          <p>Loading orphans...</p>
        ) : filteredOrphans.length === 0 ? (
          <p>No orphans available</p>
        ) : (
          filteredOrphans.map((orphan) => (
            <Card key={orphan._id} className="fund-card">
              <CardBody>
                <CardTitle tag="h5">{orphan.name}</CardTitle>
                <CardText>
                  <strong>Age:</strong> {orphan.age} <br />
                  <strong>Medical Condition:</strong> {orphan.medicalConditions} <br />
                  <strong>School:</strong> {orphan.schoolName} <br />
                  <strong>Needs:</strong> {orphan.predictedNeed || "Not classified yet"}
                </CardText>
                <Button color="primary" onClick={() => triggerPrediction(orphan._id)}>
                  Trigger Prediction
                </Button>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUrgentAssistance;
