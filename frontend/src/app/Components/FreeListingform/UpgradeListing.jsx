"use client";
import React from "react";
import "../../pages/freelistingform/freelistingform.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpgradeListing = ({ formData, setFormData, handleListingSubmit, setKey, loading, setLoading }) => {
  const isHttpsUrl = (url) => {
    return url === "" || url?.startsWith("https://");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      upgradeListing: {
        ...prev.upgradeListing,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoading(true);
    const { upgradeListing = {} } = formData;
    const allFields = ["direction", "website", "facebook", "instagram", "linkedin", "twitter"];

    const invalidField = allFields.find(
      // setLoading(false),
      (field) => !isHttpsUrl(upgradeListing?.[field] || "")
    );

    if (invalidField) {
      // setLoading(false);
      toast.error(`Invalid URL in "${invalidField}" field. Please use HTTPS.`);
      return;
    }

    handleListingSubmit(); // All validations passed

  };

  const socialPlatforms = ["facebook", "instagram", "linkedin", "twitter"];

  return (
    <form onSubmit={handleSubmit} className="business-timing-container">
      <div className="text-center mb-4">
        <h2 className="section-title">Additional URLs</h2>
      </div>
      <hr />

      {/* Google Map URL */}
      <div className="mb-3">
        <label className="form-label">Google Map URL</label>
        <input
          type="url"
          className="form-control"
          name="direction"
          placeholder="https://maps.google.com/..."
          value={formData.upgradeListing?.direction || ""}
          onChange={handleChange}
        />
      </div>

      {/* Business Website URL */}
      <div className="mb-3">
        <label className="form-label">Business Website URL</label>
        <input
          type="url"
          className="form-control"
          name="website"
          placeholder="https://yourbusiness.com"
          value={formData.upgradeListing?.website || ""}
          onChange={handleChange}
        />
      </div>

      {/* Social Media Links */}
      <div className="mb-3">
        <label className="form-label">
          Social Media Links <span style={{ color: "red" }}>(Optional)</span>
        </label>
        {socialPlatforms.map((platform) => (
          <input
            key={platform}
            type="url"
            className="form-control mb-2"
            name={platform}
            placeholder={`https://${platform}.com/yourprofile`}
            value={formData.upgradeListing?.[platform] || ""}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Button Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
        <button
          type="button"
          style={{ backgroundColor: "#343a40", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", flex: 1, transition: "background 0.3s ease" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#212529")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#343a40")}
          onClick={() => setKey?.("timing")}
        >
          ← Back
        </button>

        <button
          type="submit"
          className="btn btn-success fw-bold"
          style={{ flex: 1 }}
        >
         {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </form>
  );
};

export default UpgradeListing;
