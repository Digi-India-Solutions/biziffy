'use client'

import Businesslistingdetails from "../../../Components/Businesslistingdetails/Businesslistingdetails";
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const Page = ({ params }) => {
  const { Id } = use(params);
  const [businesses, setBusinesses] = useState([]);
 
  // console.log("Received ID:", Id);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get(`https://api.biziffy.com/api/get-all-listings-by-id/${Id}`);
        // console.log("API Response:", response.data);
        if (response.status) {
          setBusinesses(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    }

    if (Id) {
      fetchBusinessDetails()
    }
  }, [Id]);




  return (
    <>
      <div className="container">
        <div className="row">
          <Businesslistingdetails businesses={businesses} />
        </div>
      </div>
    </>
  );
};

export default Page;
