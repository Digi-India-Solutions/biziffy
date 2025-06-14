"use client";
import React, { useEffect, useState , useCallback } from "react";
import LoginForCheckBusiness from "../../Components/MyBusiness/LoginForCheckBusiness";
import NoBusinessFound from "../../Components/MyBusiness/NoBusinessFound";
import BusinessList from "../../Components/MyBusiness/BusinessList";
import { getData } from "../../services/FetchNodeServices";
const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [businessListing, setBusinessListing] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    const storedUser = localStorage.getItem("biziffyUser");
    if (storedUser) {
      setUserId(JSON.parse(storedUser)?._id);
    }
    setIsLoggedIn(!!token);
  }, []);

  const fetchBussinessListing = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await getData(`get-all-listings-by-user-id/${userId}`);
      if (res?.status === true) {
        setBusinessListing(res?.data);
      }
    } catch (err) {
      console.error("Error fetching business listing:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchBussinessListing();
  }, [fetchBussinessListing]); // ✅ now ESLint is happy

  return (
    <div className="container">
      <div className="row">
        {isLoggedIn ? (
          businessListing.length > 0 ? (
            <BusinessList businessListing={businessListing} />
          ) : (
            <NoBusinessFound />
          )
        ) : (
          <LoginForCheckBusiness />
        )}
      </div>
    </div>
  );
};

export default Page;
