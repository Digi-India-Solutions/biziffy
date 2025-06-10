"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TrustPilot.css";
import Link from "next/link";
import Image from "next/image";
import Choice1 from "../../Images/Choice1.png";
import Choice2 from "../../Images/Choice2.png";
import Choice3 from "../../Images/Choice3.png";
import Choice4 from "../../Images/Choice4.png";
import Heading from "../Heading/SecHeading";
import { useEffect, useState } from "react";

const TrustPilot = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ NEW: state for login check
  useEffect(() => {
    // ✅ NEW: Check localStorage for token on page load
    const token = localStorage.getItem("biziffyToken");
    console.log("Token:", token);
    setIsLoggedIn(!!token);
  }, []);


  return (

    <>
      <section>
        <Heading title="Millions User Trust" subtitle="Customer Reviews" />
        <div className="container">
          <div className="trustpilot-section">
            <div className="row align-items-center">
              {/* Left Content */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="content-wrapper">
                  <h1 className="display-5 fw-bold mb-3 TrustHeading">
                    Help millions make the right choice
                  </h1>
                  <p className="lead text-dark mb-4">
                    Share your experience on Trustpilot, where real reviews make a
                    difference.
                  </p>
                  <div className="d-flex  login-function align-items-center flex-wrap">
                    {!isLoggedIn ? (

                      <div className="d-flex align-items-center ">
                        <Link
                          href="/pages/login"
                          className="btn btn bg-primary text-white me-2"
                        >
                          SignIn
                        </Link>
                        <Link
                          href="/pages/signup"
                          className="btn btn bg-dark text-white me-2"
                        >
                          Register
                        </Link>
                      </div>
                    ) : (

                      <div className="hero-buttons">
                        <Link href="/pages/list-your-webiste" className="herobutton1">
                          List Your Website
                        </Link>
                        <Link href="/pages/freelistingform" className="herobutton2">
                          List Your Business
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Swiper Slider */}
              <div className="col-lg-3 col-6">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  direction="vertical" // This makes the slider move from bottom to top
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation
                  loop={true}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  className="trustpilot-swiper"
                >
                  <SwiperSlide>
                    <Image
                      src={Choice1}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      src={Choice2}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      src={Choice3}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="col-lg-3 col-6">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  direction="vertical" // This makes the slider move from bottom to top
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation
                  loop={true}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  className="trustpilot-swiper"
                >
                  <SwiperSlide>
                    <Image
                      src={Choice4}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      src={Choice3}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      src={Choice1}
                      className="d-block rounded-4"
                      alt="Trustpilot review"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  );
};

export default TrustPilot;
