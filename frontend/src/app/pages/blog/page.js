"use client";
import React, { useEffect, useState } from "react";
import "./blogpage.css";
import breadbg from "../../Images/bread.jpg";
import blogImage1 from "../../Images/blog1.jpg";
import Head from "next/head";

import Image from "next/image";
import Link from "next/link";
import { getData } from "../../services/FetchNodeServices";
const Page = () => {
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await getData("blog/get-all-blogs");
    if (response?.status === true) {
      setBlogList(response?.data);
    }
  };

  return (
    <>
      <Head>
        <title>
          Biziffy Blog - Business Growth, SEO, Marketing & Digital Tips
        </title>
        <meta
          name="description"
          content="Read expert blogs on business growth, digital marketing, SEO strategies, lead generation, and success stories. Stay updated with Biziffy insights."
        />
        <meta
          name="keywords"
          content="Biziffy blog, business blog, digital marketing tips, SEO blog, online business growth, lead generation strategies, content marketing, small business blog, B2B marketing, business visibility, local business growth, listing strategies, free business promotion, social media tips, search engine optimization, ranking on Google, online advertising, blog for startups, blogging for entrepreneurs, business strategy blog, customer acquisition, business tips India, how to get leads online, increase website traffic, business automation, CRM, sales funnel, business branding, lead capture, marketing tools, digital business solutions, startup advice, online business directory, business blog India, marketing growth hacks, web presence, business awareness blog, bizify articles, entrepreneur success blog"
        />
        <meta
          property="og:title"
          content="Biziffy Blog - Business & Marketing Insights"
        />
        <meta
          property="og:description"
          content="Explore expert articles from Biziffy on how to grow your business, improve online visibility, and generate leads effectively."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://biziffy.com/blog" />
        <meta property="og:site_name" content="Biziffy Blog" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Biziffy Blog - Boost Your Business with Expert Tips"
        />
        <meta
          name="twitter:description"
          content="Stay updated with Biziffy’s blog on business tips, SEO, lead generation, and marketing strategies."
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>
      <section>
        <div className="all-breadcrumb">
          <Image
            src={breadbg}
            alt="Breadcrumb Background"
            layout="fill"
            objectFit="cover"
          />
          <div className="bread-overlay"></div>{" "}
          {/* Overlay should be separate */}
          <div className="container">
            <div className="bread-content">
              <h1>Stay Update With Trending Business Ideas 💡</h1>
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol>
                  <li>
                    <Link href="/" className="hover:text-blue-500">
                      Home
                    </Link>
                  </li>
                  <li>
                    <i className="bi bi-chevron-double-right"></i>
                  </li>
                  <li style={{ color: "var(--blue)" }}>Blog</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-main">
        <div className="container">
          <div className="row">
            {blogList?.map((blog, index) => (
              <div key={index} className="col-md-4 gy-3">
                <div className="blog-card card">
                  <Image
                    src={blog?.image}
                    className="blog-card-img"
                    alt={blog?.heading}
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
                      Read More <i className="bi bi-arrow-right-circle "></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
