"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import Heading from "../Heading/SecHeading";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-loading-skeleton/dist/skeleton.css";
import "./HomeCategoryslider.css";
import { getData } from "../../services/FetchNodeServices";

const HomeCategorySlider = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getData("admin/subcategories");
      console.log("XXXXXXXXXX:--", response);
      // if (response?.status === 200) {
        setCategories(response);
      // } else {
      //   setError("Failed to fetch categories");
      // }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Get user's location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await getCityAndState(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation(loc);
        } catch (err) {
          console.error("Location fetch failed:", err);
          setError("Failed to determine your location.");
        }
      },
      () => {
        setError("Location access denied.");
      }
    );
  };

  const getCityAndState = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url, {
      headers: { "User-Agent": "biziffy-app" },
    });
    const data = await response.json();
    const address = data.address || {};
    return {
      city: address.city || address.town || address.village || address.hamlet || "",
      state: address.state || "",
      pincode: address.postcode || "",
    };
  };

  const handleSubcategoryClick = (card) => {
    const pincode = location?.pincode || "";
    const state = location?.state || "";
    router.push(
      `/pages/bussiness-listing?query=${encodeURIComponent(
        card?.name?.trim()
      )}&pincode=${encodeURIComponent(pincode)}&state=${encodeURIComponent(
        state
      )}&title=category`
    );
  };

  useEffect(() => {
    fetchCategories();
    requestLocation();
  }, []);

  return (
    <section className="home-category-section">
      <div className="container">
        <Heading title="Top Business Solutions" />

        {error && <p className="text-danger">{error}</p>}

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={5}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="home-category-swiper"
        >
          {loading
            ? Array(6)
                .fill(0)
                .map((_, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="home-category-card">
                      <Skeleton height={140} width={"100%"} borderRadius={8} />
                      <div className="card-body pt-2">
                        <Skeleton height={20} width={"60%"} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
            : categories?.map((card) => (
                <SwiperSlide key={card?._id}>
                  <div
                    onClick={() => handleSubcategoryClick(card)}
                    className="home-category-card cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSubcategoryClick(card)}
                  >
                    <Image
                      src={card?.image || "/images/default.jpg"}
                      alt={card?.name || "Category"}
                      width={90}
                      height={90}
                      className="home-category-card-image"
                    />
                    <div className="card-body pt-2">
                      <h5 className="home-category-card-title">{card?.name}</h5>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCategorySlider;
