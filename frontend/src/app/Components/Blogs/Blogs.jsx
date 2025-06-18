"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Heading from "../../Components/Heading/SecHeading";
import blogImage1 from "../../Images/blog1.jpg";
import Image from "next/image";
import "./blog.css";
import Link from "next/link";
import { getData } from "../../services/FetchNodeServices";

const Blogs = () => {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await getData("blog/get-all-blogs");
    if (response?.status === true) {
      setBlogList(response?.data.filter((blog) => blog?.status === true));
    }
  };

  console.log("XXXXXXX:=>", blogList);

  return (
    <>
      <section className="blog-main">
        <div className="container">
          <Heading title="Blogs" subtitle="Here is our latest blogs" />
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {blogList?.length > 0 && blogList?.map((blog) => (
              <SwiperSlide key={blog?._id}>
                <div className="blog-card card">
                  <Image
                    src={blog?.image}
                    className="blog-card-img"
                    alt={blog?.Heading}
                    width={100}
                    height={100}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{blog?.heading}</h5>
                    <p className="card-text text-sm text-gray-600 mb-3 line-clamp-2">
                      {blog?.shortDisc}
                    </p>
                    <Link
                      href={`../../pages/blog/${blog?._id}`}
                      className="login-btn"
                    >
                      Read More <i className="bi bi-arrow-right-circle"></i>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="text-center mt-4">
            <Link href="/pages/blog">
              <button className="login-btn">View All <i className="bi bi-eye"></i></button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
