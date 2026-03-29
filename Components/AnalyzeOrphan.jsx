import React, { useState } from "react";

const OrphanPrediction = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [predictedNeed, setPredictedNeed] = useState(null);

  const handlePrediction = async () => {
    const orphanData = {
      age: age,
      gender: gender,
      medicalConditions: medicalConditions,
      schoolName: schoolName,
      gradeLevel: gradeLevel,
      governorate: governorate
    };

    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orphanData)
      });

      const data = await response.json();
      setPredictedNeed(data.predicted_need);  // Show the predicted need
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  return (
    <div>
      <h1>Predict Orphan's Needs</h1>
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
      <input
        type="text"
        placeholder="Medical Conditions"
        value={medicalConditions}
        onChange={(e) => setMedicalConditions(e.target.value)}
      />
      <input
        type="text"
        placeholder="School Name"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Grade Level"
        value={gradeLevel}
        onChange={(e) => setGradeLevel(e.target.value)}
      />
      <input
        type="text"
        placeholder="Governorate"
        value={governorate}
        onChange={(e) => setGovernorate(e.target.value)}
      />
      <button onClick={handlePrediction}>Get Prediction</button>

      {predictedNeed && <p>Predicted Need: {predictedNeed}</p>}
    </div>
  );
};

export default OrphanPrediction;
