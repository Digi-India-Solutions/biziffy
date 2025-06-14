"use client";
import React, { useState } from "react";
import "../../pages/freelistingform/freelistingform.css";

const BusinessTiming = ({ setKey, formData, setFormData }) => {
  const availableTimes = [
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
    "5:30",
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
  ];
  const periods = ["AM", "PM"];

  const [timing, setTiming] = useState([
    { day: "Monday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
    { day: "Tuesday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
    { day: "Wednesday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
    { day: "Thursday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
    { day: "Friday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
    { day: "Saturday", openTime: "", openPeriod: "AM", closeTime: "", closePeriod: "PM", isOpen: false },
  ]);

  const [allDaysTime, setAllDaysTime] = useState({
    openTime: "",
    openPeriod: "AM",
    closeTime: "",
    closePeriod: "PM",
  });

  // Toggle individual day selection
  const handleToggleOpen = (index) => {
    const updatedTiming = [...timing];
    updatedTiming[index].isOpen = !updatedTiming[index].isOpen;
    setTiming(updatedTiming);
  };

  // Handle time changes for individual days
  const handleChange = (index, field, value) => {
    const updatedTiming = [...timing];
    updatedTiming[index][field] = value;
    setTiming(updatedTiming);
  };

  // Apply selected time to all selected days
  const applyAllDaysTime = () => {
    const updatedTiming = timing.map((item) => ({
      ...item,
      openTime: item.isOpen ? allDaysTime.openTime : item.openTime,
      openPeriod: item.isOpen ? allDaysTime.openPeriod : item.openPeriod,
      closeTime: item.isOpen ? allDaysTime.closeTime : item.closeTime,
      closePeriod: item.isOpen ? allDaysTime.closePeriod : item.closePeriod,
    }));
    setTiming(updatedTiming);
  };

  // Handle Select All Checkbox
  const handleSelectAll = () => {
    const allSelected = timing.every((item) => item.isOpen);
    const updatedTiming = timing.map((item) => ({
      ...item,
      isOpen: !allSelected,
    }));
    setTiming(updatedTiming);
  };

  // API Integration for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if all required fields are filled
    const invalidTimings = timing.some(
      (item) => item.isOpen && (!item.openTime || !item.closeTime)
    );

    if (invalidTimings) {
      console.error("Please fill in all timings for selected days.");
      return;
    }

    const timingsData = timing.map(item => ({
      day: item.day,
      openTime: item.openTime,
      openPeriod: item.openPeriod,
      closeTime: item.closeTime,
      closePeriod: item.closePeriod,
      isOpen: item.isOpen,
    }));
    setFormData({ ...formData, timings: timingsData });
    try {
      // const response = await fetch("https://api.biziffy.com/api/admin/createBusinessTiming", {

      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ timings: timingsData }),
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   console.log("Timings saved successfully", data);
      setKey("upgrade"); // Proceed to next step
      // } else {
      //   const error = await response.json();
      //   console.error("Error saving timings", error.message);
      // }
    } catch (error) {
      console.error("Error connecting to server", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="business-timing-container">
      <div className="text-center mb-4">
      <h5 className="section-title">
        Select Business Days & Timing<sup>*</sup>
      </h5>
      </div>
      {/* Select All Button */}
      <div className="select-all-container">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={timing.every((item) => item.isOpen)}
        />
        <label className="ms-2">Select All Days</label>
      </div>

      {/* Opening and Closing Time for All */}
      <div className="all-days-time mb-3">
        <div className="row align-items-self-end">
          <div className="col-md-4 time-selection-div">
            <label>Open Time</label>
            <select
              className="form-control"
              value={allDaysTime.openTime}
              onChange={(e) =>
                setAllDaysTime({ ...allDaysTime, openTime: e.target.value })
              }
            >
              <option value="">Select Time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              className="form-control"
              value={allDaysTime.openPeriod}
              onChange={(e) =>
                setAllDaysTime({ ...allDaysTime, openPeriod: e.target.value })
              }
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 time-selection-div">
            <label>Close Time</label>
            <select
              className="form-control"
              value={allDaysTime.closeTime}
              onChange={(e) =>
                setAllDaysTime({ ...allDaysTime, closeTime: e.target.value })
              }
            >
              <option value="">Select Time</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <select
              className="form-control"
              value={allDaysTime.closePeriod}
              onChange={(e) =>
                setAllDaysTime({ ...allDaysTime, closePeriod: e.target.value })
              }
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Apply to All Button */}
          <button
            type="button"
            className="btn col-md-4 btn-dark apply-time-btn"
            onClick={applyAllDaysTime}
          >
            Apply to All
          </button>
        </div>
      </div>

      {/* Individual Days Selection */}
      {timing.map((item, index) => (
        <div className="timing-row" key={index}>
          <input
            type="checkbox"
            checked={item.isOpen}
            onChange={() => handleToggleOpen(index)}
          />
          <label className="day-label">{item.day}</label>
          <div className="seprate-day-time">
            {item.isOpen && (
              <>
                <select
                  className="form-control time-input"
                  value={item.openTime}
                  onChange={(e) =>
                    handleChange(index, "openTime", e.target.value)
                  }
                >
                  <option value="">Select Time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control time-input"
                  value={item.closeTime}
                  onChange={(e) =>
                    handleChange(index, "closeTime", e.target.value)
                  }
                >
                  <option value="">Select Time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Button Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
        <button
          type="button"
          style={{ backgroundColor: "#343a40", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", flex: 1, transition: "background 0.3s ease" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#212529")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#343a40")}
          onClick={() => setKey?.("category")}
        >
          ← Back
        </button>

        <button
          type="submit"
          className="btn btn-success fw-bold"
          style={{ flex: 1 }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BusinessTiming;
