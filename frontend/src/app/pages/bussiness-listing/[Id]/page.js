'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Businesslistingdetails from '../../../Components/Businesslistingdetails/Businesslistingdetails';

const Page = () => {
  const params = useParams();
  const Id = params?.Id;

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:18001/api/get-all-listings-by-id/${Id}`);
        if (response.status === 200) {
          setBusinesses(response.data?.data || []);
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

    if (Id) {
      fetchBusinessDetails();
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
          <Businesslistingdetails businesses={businesses} />
        )}
      </div>
    </div>
  );
};

export default Page;
