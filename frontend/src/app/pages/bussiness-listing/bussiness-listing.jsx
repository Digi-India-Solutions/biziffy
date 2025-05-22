// 'use client';
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./businessListing.css";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import banner1 from "../../Images/slide1.webp";
import banner2 from "../../Images/slide2.webp";
import banner3 from "../../Images/slide3.webp";
import PaidListing from "../paid-listing/PaidListing"

const bussinesslisting = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [pincode, setPincode] = useState("");
  const [title, setTitle] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [businesses, setBusinesses] = useState([]);
  const [websiteList, setWebsiteList] = useState([]);
  const [tocken, setToken] = useState("");
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "", remember: false, });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    const user = localStorage.getItem("biziffyUser");
    console.log('USER:-', JSON.parse(user)?._id)
    setToken(token);
    setUser(JSON.parse(user)?._id)
  }, [])

  useEffect(() => {
    const q = searchParams.get("query") || "";
    const pin = searchParams.get("pincode") || "";
    const title = searchParams.get("title")
    setQuery(q);
    setPincode(pin);
    setTitle(title);
  }, [searchParams]);

  const bannerImages = [banner1, banner2, banner3];

  const handleToggleView = () => {
    if (visibleCount >= businesses.length) {
      setVisibleCount(4); // Reset
    } else {
      setVisibleCount((prev) => prev + 4);
    }
  };

  // const fetchBusinessesListing = useCallback(async() => {
  //   try {
  //     let response;
  //     if (pincode || query || title) {
  //       response = await axios.get("http://localhost:18001/api/search-listings", {
  //         params: { pincode, query, title },
  //       });
  //     }
  //     // else {
  //     //   response = await axios.get("http://localhost:18001/api/get-all-listings");
  //     // }
  //     console.log("FFFFFFFFFFF", response?.data)
  //     setBusinesses(response?.data?.data || []);
  //   } catch (error) {
  //     console.error("Failed to fetch listings:", error);
  //   }
  // }, [pincode, query]);

  // const fetchWebsiteListing = useCallback(async() => {
  //   try {
  //     let response;
  //     if (pincode || query || title) {
  //       response = await axios.get("http://localhost:18001/api/admin/search-website-listings", {
  //         params: { pincode, query, title },
  //       });
  //     }
  //     console.log("FFFFFFFFFFFWebsite", response?.data)
  //     if (response?.data?.status) {
  //       setWebsiteList(response?.data?.data || []);
  //     }

  //   } catch (error) {
  //     console.error("Failed to fetch listings:", error);
  //   }
  // }, [pincode, query])


  const fetchBusinessesListing = useCallback(async () => {
    try {
      let response;
      if (pincode || query || title) {
        response = await axios.get("http://localhost:18001/api/search-listings", {
          params: { pincode, query, title },
        });
      }
      console.log("FFFFFFFFFFF", response?.data);
      setBusinesses(response?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  }, [pincode, query, title]);  // ✅ add 'title'

  const fetchWebsiteListing = useCallback(async () => {
    try {
      let response;
      if (pincode || query || title) {
        response = await axios.get("http://localhost:18001/api/admin/search-website-listings", {
          params: { pincode, query, title },
        });
      }
      console.log("FFFFFFFFFFFWebsite", response?.data);
      if (response?.data?.status) {
        setWebsiteList(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  }, [pincode, query, title]);

  console.log("websiteList:=", websiteList)

  useEffect(() => {
    fetchBusinessesListing();
    fetchWebsiteListing();
  }, [fetchBusinessesListing, fetchWebsiteListing]);


  const handleCountClick = (type, businessId) => {

    if (!businessId || !type) return;

    const key = `business_click_${businessId}_${type}`;
    const lastClickDay = localStorage.getItem(key);
    console.log(`lastClickDay`, lastClickDay);
    const now = Date.now();
    const currentDay = Math.floor(now / 86400000);
    console.log(`currentDay`, currentDay);

    if (!lastClickDay || parseInt(lastClickDay) < currentDay) {

      axios.post(`http://localhost:18001/api/increase-click-count/${businessId}`, { type, user })
        .then(() => { console.log(`${type} click counted`); localStorage.setItem(key, currentDay.toString()); })
        .catch((err) => { console.error("Error increasing count", err) });
    } else {
      // console.log(`${type} already clicked today — not counted`);
    }
  };



  const visibleBusinesses = businesses.slice(0, visibleCount);

  return (
    <Suspense>
    <section className="business-listing-page">
      {/* Banner Section */}
      <div className="container">
        <div className="listing-banner">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            slidesPerView={1}
          >
            {bannerImages.map((img, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={img}
                  alt={`Banner ${index + 1}`}
                  className="business-listing-image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Business Listings */}
      <div className="container">
        <div className="business-listing-container">
          <h5 className="text-dark mb-1">Business Category Name</h5>
          <div className="row">
            {/* Business Cards */}
            <div className="col-md-6">
              <div className="col-5-scroll-css">
                {visibleBusinesses?.map((biz) => {
                  const isOpen = true;
                  const togglePasswordVisibility = () => {
                    setShowPassword((prev) => !prev);
                  };
                  const handleChange = (e) => {
                    const { name, value, type, checked } = e.target;
                    const updatedValue = type === "checkbox" ? checked : value;
                    // console.log(`Field Changed: ${name} =>`, updatedValue);

                    setFormData((prev) => ({ ...prev, [name]: updatedValue, }));
                    setErrors((prev) => ({ ...prev, [name]: "" }));
                  };

                  const handleCardClick = () => {
                    if (tocken) {
                      handleCountClick('listings', biz?._id)
                      window.location.href = `/pages/bussiness-listing/${biz?._id}`;
                    } else {
                      const modal = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
                      modal.show();
                    }
                  };

                  const validate = () => {
                    const newErrors = {};
                    const { email, password } = formData;

                    if (!email) {
                      newErrors.email = "Email is required.";
                    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                      newErrors.email = "Invalid email format.";
                    }

                    if (!password) {
                      newErrors.password = "Password is required.";
                    }

                    // console.log("Validation Errors:", newErrors);
                    setErrors(newErrors);
                    return Object.keys(newErrors).length === 0;
                  };

                  const handleSubmit = async (e) => {
                    e.preventDefault();
                    // console.log("Form submitted with:", formData);

                    if (!validate()) return;

                    setIsLoading(true);
                    try {
                      const response = await axios.post('http://localhost:18001/api/auth/user-login', { email: formData.email, password: formData.password, });
                      // console.log("API Response:", response.data.token);
                      if (response?.data?.status) {

                        // console.log("API Response:", response?.data);
                        localStorage.setItem("biziffyToken", response?.data?.token);
                        localStorage.setItem("biziffyUser", JSON.stringify(response?.data?.user));
                        setSuccessMessage("Login successful! Redirecting...");
                        setLoginError("");
                        // console.log("Redirecting to /dashboard...");
                        setTimeout(() => {
                          const modalElement = document.getElementById('exampleModalToggle');
                          const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                          modalInstance.hide();
                          window.location.reload()
                        }, 1500);
                      } else {
                        setLoginError(data.message || "Something went wrong.");
                        setSuccessMessage("");
                      }


                    } catch (error) {
                      console.error("Login Error:", error);
                      setLoginError("An error occurred while logging in.");
                      setSuccessMessage("");
                    } finally {
                      setIsLoading(false);
                    }
                  };

                  return (
                    <div key={biz?._id}>
                      {/* <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1"> */}
                      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                        <div  className="modal-dialog modal-dialog-centered">
                          <div  className="modal-content">
                            <div className="modal-header">
                              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">Please Login First</h1>
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                              <div className="auth-card">
                                <div className="text-center mb-3">
                                  <h4 className="mt-2">Welcome Back!</h4>
                                  <p>Sign in to continue</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                  <input type="email" name="email" placeholder="Email" className="login-input mb-3" value={formData.email} onChange={handleChange} />
                                  {errors.email && <p className="text-danger">{errors.email}</p>}

                                  <div className="password-input mb-3 position-relative">
                                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="login-input w-100" value={formData.password} onChange={handleChange} />
                                    <span className="show-password-btn position-absolute" style={{ top: "50%", right: "15px", transform: "translateY(-50%)", cursor: "pointer", }} onClick={togglePasswordVisibility}>
                                      {showPassword ? (
                                        <i className="bi bi-eye"></i>
                                      ) : (
                                        <i className="bi bi-eye-slash"></i>
                                      )}
                                    </span>
                                  </div>
                                  {errors.password && <p className="text-danger">{errors.password}</p>}

                                  <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                      <input type="checkbox" className="form-check-input" id="rememberMe" name="remember" checked={formData.remember} onChange={handleChange} />
                                      <label className="form-check-label" htmlFor="rememberMe">
                                        Remember me
                                      </label>
                                    </div>
                                    <Link href="/pages/forgot-password" className="text-decoration-none">
                                      Forgot Password?
                                    </Link>
                                  </div>

                                  <button type="submit" className="login-btn bg-primary text-white w-100">
                                    Login
                                  </button>

                                  {loginError && (
                                    <p className="text-danger text-center mt-3">{loginError}</p>
                                  )}
                                  {successMessage && (
                                    <p className="text-success text-center mt-3">{successMessage}</p>
                                  )}

                                  <p className="text-center mt-3">
                                    Don’t have an account?{" "}
                                    <Link href="/pages/signup" className="text-primary">
                                      Register
                                    </Link>
                                  </p>
                                </form>

                                {/* Google Login Button */}

                              </div>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">{isLoading ? "Login..." : "Login"}</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="business-card" onClick={handleCardClick} >
                        <div>
                          <Image
                            src={biz?.businessCategory?.businessImages?.[0]}
                            alt={biz?.name || "Business"}
                            className="listing-image"
                            width={300}
                            height={300}
                          />
                        </div>
                        <div>
                          <div className="d-flex gap-3 mb-2 align-items-center">
                            <h5>
                              {biz?.businessDetails?.businessName?.slice(0, 15)}...
                            </h5>
                            <span className="verified-text">
                              <i className="bi bi-check-all"></i> Biziffy Verified
                            </span>
                          </div>

                          <div className="d-flex gap-2 align-items-center">
                            <p>
                              {biz?.rating} <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i>
                              <i className="bi bi-star-fill"></i> ({biz?.reviews})
                            </p>
                            <span>|</span>
                            <p>{biz?.businessCategory?.category?.name}</p>
                          </div>

                          <div className="d-flex gap-2 align-items-center">
                            <p>{biz?.businessDetails?.yib || '0.6'} years in business</p>
                            <span>|</span>
                            <p>
                              {biz?.businessDetails?.city}, {biz?.businessDetails?.state}
                            </p>
                          </div>

                          <div className="d-flex gap-2 align-items-center">
                            <div className="opening-hours-container">
                              <p className={`status ${isOpen ? "open" : "closed"}`}>
                                {isOpen ? "Open Now" : "Closed Now"}
                              </p>
                            </div>
                            <span>|</span>
                            <p>Mobile: {biz?.contactPerson?.contactNumber}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {/* View More Button */}
                {businesses.length > 4 && (
                  <div className="text-center mt-3">
                    <button
                      className="business-listing-black-btn"
                      onClick={handleToggleView}
                    >
                      {visibleCount >= businesses.length ? "View Less" : "View More"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paid Listing Section */}
            {websiteList?.length > 0 && <div className="col-md-6"><PaidListing websiteList={websiteList} user={user} /></div>}
          </div>
        </div>
      </div>
    </section>
    </Suspense>
  );
};

export default bussinesslisting;
