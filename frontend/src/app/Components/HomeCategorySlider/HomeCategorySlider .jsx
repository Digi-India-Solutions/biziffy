"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./HomeCategoryslider.css";
import Image from "next/image";
import Link from "next/link";
import Automobile from "../../Images/Automobile.jpg";
import Education from "../../Images/Education.jpg";
import Healthcare from "../../Images/Healthcare.jpg";
import Retail from "../../Images/LocalShops.webp";
import Estate from "../../Images/RealEstate.jpg";
import HomeServices from "../../Images/HomeServices.png";
import Heading from "../Heading/SecHeading";

const cards = [
  { id: 1, title: "Automobile ", image: Automobile, link: "/Automobile" },
  { id: 2, title: "Education ", image: Education, link: "/Education" },
  { id: 3, title: "Healthcare ", image: Healthcare, link: "/Healthcare" },
  { id: 4, title: "Retail & Local Shops", image: Retail, link: "/Retail" },
  { id: 5, title: "Real Estate ", image: Estate, link: "/Estate" },
  { id: 6, title: "Home Services", image: HomeServices, link: "/HomeServices" },
];

const HomeCategorySlider = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="home-category-section">
        <div className="container">
          <Heading title="Top Business Solutions" />
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={5}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="home-category-swiper"
          >
            {loading
              ? // Show 6 skeleton slides while loading
                Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="home-category-card">
                        <Skeleton
                          height={140}
                          width={"100%"}
                          borderRadius={8}
                        />
                        <div className="card-body pt-2">
                          <Skeleton height={20} width={"60%"} />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
              : cards.map((card) => (
                  <SwiperSlide key={card.id}>
                    <Link href={card.link} className="text-decoration-none">
                      <div className="home-category-card">
                        <Image
                          src={card.image}
                          alt={card.title}
                          priority
                          className="home-category-card-image"
                        />
                        <div className="card-body pt-2">
                          <h5 className="home-category-card-title">{card.title}</h5>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default HomeCategorySlider;
