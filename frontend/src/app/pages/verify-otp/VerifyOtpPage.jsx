"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingComponent from "../../Components/loadingcomponent/Loadingcomponent";
import { postData } from "../../services/FetchNodeServices";
const VerifyOtpPage = ({ formData, title, openOtp, setOpenOtp, loading, setLoading }) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOtpSubmit = async (e) => {
    if (!formData.email || !otp) {
      alert("Please enter email and otp");
      return
    }

    try {
      setLoading(true);
      const res = await postData("verify-otp", { ...formData, otp, });

      if (res.data.status) {
        setLoading(false);
        alert("OTP Verified Successfully!");
        setTimeout(() => {
          router.push("/pages/login");
        }, 1000);
      } else {
        setLoading(false);
        alert(res.data.message || " Invalid OTP. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center py-5">
      <div className="auth-card w-100" style={{ maxWidth: "400px" }}>
        <h4 className="text-center mb-3">Verify OTP</h4>
        <p className="text-center">We sent a verification code to <strong>{formData.email}</strong></p>

        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            className="login-input mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="validation-text text-danger">{error}</p>}

          <button className="login-btn w-100">{loading ? <LoadingComponent /> : "Verify & Continue"}</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
