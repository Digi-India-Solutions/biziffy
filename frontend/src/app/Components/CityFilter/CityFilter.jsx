"use client";

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./cityFilter.css";
import Link from "next/link";
import Heading from "../Heading/SecHeading";
import Image from "next/image";
import LoadingComponent from "../loadingcomponent/Loadingcomponent";
import { getData } from "../../services/FetchNodeServices";
export default function CityCards() {
  const [cityData, setCityData] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getData("populerCity/get-all-popular-cities");
        console.log("res->", res);
        if (res?.status === true) {
          setCityData(res?.data);
        }
        // Assuming the response contains a 'cities' array
        // setCityData(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <Heading title="Top Cities" subtitle="Businesses by city" />

      {/* TEMPORARY DEBUGGING */}
      {/* <pre>{JSON.stringify(cityData, null, 2)}</pre> */}

      <div className="container">
        <div className="row g-4">
          {cityData?.length === 0 ? (
            <LoadingComponent />
          ) : (
            cityData?.map((city) => {
              console.log("City:", city); // Debug: Check city object

              return (
                <div key={city._id} className="col-sm-4 col-6 col-md-3">
                  <div
                    className={`cityCard ${hoveredCard === city._id ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredCard(city._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ "--card-color": city.city.color }}
                  >
                    <div className="cardImageContainer">
                      <img
                        src={city.city.cityImage || "/default-image.jpg"} // Use fallback image if city image is missing
                        alt={`${city.city.name}, ${city.city.country}`}
                        className="cardImage"
                        width={300}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="cardOverlay"></div>
                    </div>
                    <div className="cardBadge">
                      <span>{city.badge || "New"}</span>
                    </div>
                    <div className="cardContent">
                      <div className="cardHeader">
                        <h2 className="cityName">{city?.city?.name}</h2>
                        <p className="countryName">{city?.city?.country}</p>
                      </div>
                      <div className="cardFooter">
                        <Link href={`/pages/citytourismGuide/${city?._id}`}>
                          <button className="exploreButton">
                            <i className="bi bi-geo-alt me-1"></i>
                            Explore
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="cardDecoration"></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
