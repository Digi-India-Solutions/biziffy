// components/UserLocation.jsx
"use client";

import React, { useEffect, useState } from "react";
import './location.css'
export default function UserLocation({ location, setLocation }) {
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    const askLocation = setTimeout(() => {
      requestLocation();
    }, 2000);

    return () => clearTimeout(askLocation);
  }, []);

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const loc = await getCityAndState(
              position.coords.latitude,
              position.coords.longitude
            );
            setLocation(loc);
            setError(null);
          } catch (err) {
            setError("Failed to fetch location details.");
          }
        },
        (err) => {
          setError("Please allow location.");
          setRetry(true);
          setTimeout(() => {
            alert("⚠️ Location is mandatory. Please allow access.");
            requestLocation(); // retry after 4 seconds
          }, 8000);
        }
      );
    } else {
      setError("Geolocation is not supported in your browser.");
    }
  };

  const getCityAndState = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "biziffy-app",
      },
    });

    const data = await response.json();
    const address = data.address || {};

    const city = address.city || address.town || address.village || address.hamlet || "";
    const state = address.state || "";
    const pincode = address.postcode || "";
    return { city, state, pincode };
  };

  const truncateLocation = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.length <= 3 ? text : `${words.slice(0, 3).join(' ')}...`;
  };

  return (
    <div>
      {location ? (
        <>
        <div className="d-flex text-start">
          <p
            className="m-0 p-0 location-detact"
            title={location.city + ' ' + location.state} // Tooltip for full location
            >
            {truncateLocation(location.city + ' ' + location.state)}
          </p>
            </div>
        </>
      ) : (
        <>
          <p className="m-0 p-0 location-detact">Finding...</p>
          {error && <p className="m-0 p-0 location-detact">{error}</p>}
        </>
      )}
    </div>

  );
}
