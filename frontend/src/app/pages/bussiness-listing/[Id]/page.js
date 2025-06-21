'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Businesslistingdetails from '../../../Components/Businesslistingdetails/Businesslistingdetails';
import { getData } from '../../../services/FetchNodeServices';

const Page = () => {
  const params = useParams();
  const Id = params?.Id;

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advertisements, setAdvertisements] = useState([])

   const fetchBusinessDetails = async () => {
      try {
        const response = await getData(`get-all-listings-by-id/${Id}`);
        console.log("Business Listings:=>", response);
        if (response?.status === true) {
          setBusinesses(response?.data || []);
        } else {
          setError('Failed to fetch data.');
        }
      } catch (err) {
        setError('Error fetching business details.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
  
    const fetchAdvartisMant = async () => {
      try {
        const response = await getData("advertisements/get-all-advertisements");
        const activeAds = response?.filter((ad) => ad?.status === "Active" && ad.type === 'Listing detail Right') || [];
        setAdvertisements(activeAds);
        console.log("Filtered active ads:", activeAds);
      } catch (error) {
        console.error("Failed to fetch advertisements:", error);
        setAdvertisements([]);
      }
    };

    if (Id) {
      fetchBusinessDetails();
      fetchAdvartisMant();
    }
  }, [Id]);

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <p>Loading business details...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Businesslistingdetails fetchBusinessDetails={fetchBusinessDetails}  advertisements={advertisements} businesses={businesses} />
        )}
      </div>
    </div>
  );
};

export default Page;
