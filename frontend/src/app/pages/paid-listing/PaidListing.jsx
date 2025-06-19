"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { postData } from "../../services/FetchNodeServices";
import "./paid-listing.css";
import { useRouter } from "next/navigation";

const PaidListing = ({ websiteList = [], user }) => {
  const router = useRouter();
  const handleClick = async (id) => {
    if (!id) return;

    const key = `business_click_${id}`;
    const lastClickDay = localStorage.getItem(key);
    const currentDay = Math.floor(Date.now() / 86400000);

    if (!lastClickDay || parseInt(lastClickDay) < currentDay) {
      try {
        await postData(`admin/increase-click-count-website-listing/${id}`, { user });
        localStorage.setItem(key, currentDay.toString());
      } catch (err) {
        console.error("Error increasing click count:", err);
      }
    }
  };

  const renderStatusBadge = (status) => {
    const baseStyle = { padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "6px", };

    if (status === "Approved") {
      return (
        <span style={{ ...baseStyle, backgroundColor: "#d4edda", color: "#155724" }}>
          <i className="bi bi-patch-check-fill" /> Approved
        </span>
      );
    } else if (status === "Pending") {
      return (
        <span style={{ ...baseStyle, backgroundColor: "#fff3cd", color: "#856404" }}>
          <i className="bi bi-clock-fill" /> Pending
        </span>
      );
    } else {
      return (
        <span style={{ ...baseStyle, backgroundColor: "#f8d7da", color: "#721c24" }}>
          <i className="bi bi-x-circle-fill" /> Rejected
        </span>
      );
    }
  };
  console.log("websiteList:=>", websiteList)
  return (
    <section className="custom-section">
      <div className="container">
        <div className="col-md-12">
          <div className="custom-row">
            {websiteList?.map((shop, index) => (
              <div key={index} className="custom-col">
                <div>
                  <a
                    href={shop?.website?.startsWith("http") ? shop?.website : `https://${shop?.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => handleClick(shop?._id)}
                  >
                    <div className="listing-content">
                      <div className="d-grid">
                        <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                          <div className="fw-bold text-dark" style={{ fontSize: "16px" }}>
                            {shop?.companyName || "No Company Name"}
                          </div>
                          {/* <div className="mt-1">
                            {renderStatusBadge(shop?.verified || "Pending")}
                          </div> */}
                        </div>

                        <small className="text-muted mt-1" style={{ fontSize: "13px" }}>
                          {shop?.website?.replace(/^https?:\/\//, "") || "No website"}
                        </small>
                      </div>
                    </div>

                    <div className="align-items-center listing-title mt-2">
                      <p className="listing-description m-0">
                        {shop?.shortDescription?.slice(0, 50)}{" "}
                        <span style={{ color: "blue" }}>read more...</span>
                      </p>

                      <div className="d-flex flex-wrap align-items-center gap-1 mt-2">
                        {(shop?.service || []).slice(0, 3).map((keyword, idx) => (
                          <p key={idx} className="m-0 text-dark" style={{ fontSize: "13px" }}>
                            <i className="bi bi-check pe-1" />
                            {keyword}
                          </p>
                        ))}
                      </div>
                    </div>
                  </a>
                </div>

                <div className="listing-image mt-3 d-flex flex-column align-items-start">
                  {shop?.logo && (
                    <Image
                      src={shop.logo}
                      alt={shop?.companyName || "Listing Image"}
                      className="paid-listing-image mt-2"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaidListing;
