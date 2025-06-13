"use client";
import React, { useEffect, useState } from "react";
import LoginForCheckBusiness from "../../Components/MyBusiness/LoginForCheckBusiness";
import NoBusinessFound from "../../Components/MyBusiness/NoBusinessFound";
import BusinessList from "../../Components/MyBusiness/BusinessList";
import { getData } from "../../services/FetchNodeServices";
const page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [businessListing, setBusinessListing] = useState([])

  useEffect(() => {
    // ✅ NEW: Check localStorage for token on page load
    const token = localStorage.getItem("biziffyToken");
    const storedUser = localStorage.getItem("biziffyUser");
    if (storedUser) {
      setUserId(JSON.parse(storedUser)?._id);
    }
    console.log("Token:", token);
    setIsLoggedIn(!!token);
  }, []);

  const fetchBussinessListing = async () => {
        if (!userId) return;
        try {
          const res = await getData(`get-all-listings-by-user-id/${userId}`);
       
          if (res?.status === true) {
            setBusinessListing(res?.data);
          }
          
        } catch (err) {
          console.error("Error fetching business listing:", err);
        }
      };

  useEffect(() => {
    fetchBussinessListing();
  }, [userId]);

  return (
    <>
      <div className="container">
        <div className="row">
          {
            isLoggedIn ?
            businessListing.length > 0 ?
                <BusinessList businessListing={businessListing} /> :
                <NoBusinessFound /> :
              <LoginForCheckBusiness />
          }

        </div>
      </div>
    </>
  );
};

export default page;
