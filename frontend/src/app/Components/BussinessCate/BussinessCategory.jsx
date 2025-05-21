"use client";
import React, { useState, useEffect } from "react";
import "./BussinessCategory.css";
import Heading from "../Heading/SecHeading";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
// import hello from "../../pages/subCategoryFilter/subCategoryFilter"  

const BussinessCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://api.biziffy.com/api/categories");
        setCategories(res.data); // Assuming res.data is an array of categories
        console.log("Categories:", res.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading business categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Heading title="Top Business Categories" subtitle="Businesses by category" />
      <div className="container">
        <div className="row">
          {categories.map((category) => (
            <div key={category._id} className="col-lg-2 col-md-3 col-sm-4 col-4">
              {/* <Link className="text-decoration-none" href={`/pages/subCategoryFilter/subCategoryFilter?categoryId=${category._id}`} passHref> */}
              <Link className="text-decoration-none" href={`/pages/subCategoryFilter/?categoryId=${category._id}`} passHref>

                <div className="bussiness-category-card text-center p-3">
                  {category.icon && (
                    <img
                      src={`${category?.icon}`} 
                      alt={category?.name}
                      // onError={(e) => {
                      //   e.currentTarget.src = "/path/to/default-category-image.png";
                      // }}
                    />
                  )}
                  {!category.icon && (
                    <div className="default-icon">{category.name.charAt(0).toUpperCase()}</div>
                  )}
                  <h6 className="mt-2">{category.name}</h6>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BussinessCategory;
