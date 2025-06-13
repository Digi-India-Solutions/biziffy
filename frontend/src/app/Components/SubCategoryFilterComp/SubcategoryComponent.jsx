"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "./subCategoryComp.css";
import "../../pages/citytourismGuide/citytourismGuide.css";
import { getData } from "../../services/FetchNodeServices";

const SubcategoryComponent = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const router = useRouter();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [location, setLocation] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [error, setError] = useState(null);

  // Fetch category and subcategories
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) return;
      try {
        setLoadingCategory(true);
        const response = await getData(`categories/${categoryId}`);
        setCategory(response || null);
        setSubcategories(response?.subcategories || []);
        setError(null);
      } catch (err) {
        console.error("Category fetch failed:", err);
        setError("Failed to load category data.");
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  // Request user location
  useEffect(() => {
    const timeout = setTimeout(() => requestLocation(), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await getCityAndState(position.coords.latitude, position.coords.longitude);
          setLocation(loc);
          setError(null);
        } catch (err) {
          console.error("Location fetch failed:", err);
          setError("Failed to determine your location.");
        }
      },
      () => {
        setError("Location access denied. Please enable location access.");
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
      city: address?.city || address?.town || address.village || address.hamlet || "",
      state: address.state || "",
      pincode: address.postcode || "",
    };
  };

  const handleSubcategoryClick = (sub) => {
    const pincode = location?.pincode || "";
    const state = location?.state || "";
    const catName = sub?.name
    if (pincode || state) {
      router.push(
        `/pages/bussiness-listing?query=${catName?.trim()}&pincode=${pincode}&state=${state}`
      );
    } else {
      alert("Need pinCode Pleas wait")
    }

  };

  // Fallback UI
  if (!categoryId) return <div className="loader">❗ Category ID is missing...</div>;
  if (loadingCategory) return <div className="loader">🔄 Loading category data...</div>;
  if (error) return <div className="error-msg">⚠️ {error}</div>;

  return (
    <>
      {/* Banner Section */}
      <section>
        <div className="all-breadcrumb position-relative">
          <Image
            src={category?.banner || "/images/default-banner.jpg"}
            alt={category?.name || "Category Banner"}
            layout="fill"
            objectFit="cover"
            className="breadcrumb-banner-img"
            priority
          />
          <div className="city-bread-overlay"></div>
          <div className="container">
            <div className="bread-content">
              <h1>{category?.name || "Category"}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Grid */}
      <section className="subcategory-section">
        <div className="container">
          <div className="row justify-content-center">
            {subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <div key={sub?._id} className="col-md-3 col-sm-4 col-6">
                  <div
                    className="subcategory-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSubcategoryClick(sub)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubcategoryClick(sub)}
                  >
                    <div className="subcategory-filter-img">
                      <Image
                        src={sub?.image || "/images/default.jpg"}
                        alt={sub?.name}
                        width={300}
                        height={200}
                        loading="lazy"
                      />
                    </div>
                    <h4>{sub?.name}</h4>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">🚫 No subcategories available.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SubcategoryComponent;


{/* <div class="text-center mt-4 mb-4">
          <button class="btn btn-primary" type="submit">
            View All Categories
          </button>
        </div> */}