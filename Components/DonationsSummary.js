import React, { useEffect, useState } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import '../styles/Summary.css';
const DonationsSummary = () => {
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalSponsorships, setTotalSponsorships] = useState(0);
    useEffect(() => {
      AOS.init({ duration: 1000, once: true });
    }, []);
    useEffect(() => {
      // Fetch sponsorships data
      const fetchSponsorships = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/sponsorships");
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          console.log("Fetched sponsorships data:", data); // Debugging: check response structure
  
          if (data && Array.isArray(data) && data.length > 0) {
            const totalDonationsAmount = data.reduce((sum, record) => sum + record.amountPaid, 0);
            const orphanIds = new Set(data.map(record => record.orphanId.toString()));
            const totalSponsorshipsCount = orphanIds.size;
  
            setTotalDonations(totalDonationsAmount);
            setTotalSponsorships(totalSponsorshipsCount);
          } else {
            console.log("No sponsorship data or invalid response.");
          }
        } catch (error) {
          console.error("Error fetching sponsorships:", error);
        }
      };
  
      // Fetch donations data
      const fetchDonations = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/donations");
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          const data = await response.json();
          console.log("Fetched donations data:", data); // Debugging: check response structure
  
          if (data && Array.isArray(data) && data.length > 0) {
            const totalDonationAmount = data.reduce((sum, record) => sum + record.amount, 0);
            setTotalDonations((prev) => prev + totalDonationAmount);
          } else {
            console.log("No donation data or invalid response.");
          }
        } catch (error) {
          console.error("Error fetching donations:", error);
        }
      };
  
      // Fetch both sponsorships and donations data
      fetchSponsorships();
      fetchDonations();
    }, []); // Runs once when component mounts
  
    // Combine total donations and sponsorships for display
    const combinedTotal = totalDonations + totalSponsorships;
  
    return (
      <div className="sponsorship-summary-container">
       
  
        {/* Static Combined Total Donations and Sponsorships */}
        <div className="totals-summary" data-aos="fade-up">
        <div className="shape one" data-aos="fade-right" data-aos-delay="300"></div>
      <div className="shape two" data-aos="fade-left" data-aos-delay="500"></div>
      <div className="shape three" data-aos="zoom-in" data-aos-delay="700"></div>
         
          <h3 data-aos="fade-up" data-aos-delay="900">
        Total Donations : ${combinedTotal}
      </h3>
      <h4 data-aos="fade-up" data-aos-delay="1100">
        Total Children Sponsored: {totalSponsorships}
      </h4>
        </div>
      </div>
    );
  };

export default DonationsSummary;
