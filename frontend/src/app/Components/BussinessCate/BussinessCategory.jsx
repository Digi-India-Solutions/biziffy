"use client";
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./BussinessCategory.css";
import Heading from "../Heading/SecHeading";
import Link from "next/link";
import { getData } from "../../services/FetchNodeServices";

const BussinessCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getData("categories");
        setCategories(res); 
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Heading title="Top Business Categories" subtitle="Businesses by category" />
      <div className="container">
        <div className="row">
          {loading
            ? // Show 6 skeleton cards while loading
              Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="col-lg-2 col-md-3 col-sm-4 col-4">
                    <div className="bussiness-category-card text-center p-3">
                      <Skeleton circle={true} height={60} width={60} />
                      <Skeleton height={20} width={`80%`} style={{ marginTop: 10 }} />
                    </div>
                  </div>
                ))
            : categories?.map((category) => (
                <div key={category?._id} className="col-lg-2 col-md-3 col-sm-4 col-4">
                  <Link
                    className="text-decoration-none"
                    href={`/pages/subCategoryFilter/${category?._id}`}
                    passHref
                  >
                    <div className="bussiness-category-card text-center p-3">
                      {category.icon ? (
                        <img src={`${category.icon}`} alt={category.name} />
                      ) : (
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
