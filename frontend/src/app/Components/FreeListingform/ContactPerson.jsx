"use client";
import React, { useState } from "react";
import "../../pages/freelistingform/freelistingform.css";

const ContactPerson = ({ setKey, formData, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Handle input changes for all fields
  const handleChange = (e) => {
    setFormData({ ...formData, contactPerson: { ...formData.contactPerson, [e.target.name]: e.target.value } });
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on form submission

    try {
      setKey("business"); // Replace "business" with the key of the next step
    } catch (err) {
      setError(err.message); // Display error if any occurs
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <h5 className="section-title">
          Fill Your Contact Details<sup>*</sup>
        </h5>
      </div>

      {/* Display error message if any */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">
          Title<sup>*</sup>
        </label>
        <select
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
        >
          <option value="">Select Title</option>
          <option value="Mr">Mr</option>
          <option value="Ms">Ms</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          First Name<sup>*</sup>
        </label>
        <input
          type="text"
          className="form-control"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Last Name<sup>*</sup>
        </label>
        <input
          type="text"
          className="form-control"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Contact Number<sup>*</sup>
        </label>
        <input
          type="number"
          className="form-control"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          WhatsApp Number<sup>*</sup>
        </label>
        <input
          type="number"
          className="form-control"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Email<sup>*</sup>
        </label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="btn btn-primary w-100 py-3"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Next"}
      </button>
    </form>
  );
};

export default ContactPerson;
