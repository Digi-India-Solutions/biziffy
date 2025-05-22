"use client";

import React, { useEffect, useState } from "react";
import "../citytourismGuide.css";
import Link from "next/link";
import Head from "next/head";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const Page = () => {
  const { id } = useParams(); // ✅ get dynamic route param
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchTopCity = async () => {
      try {
        const res = await axios.get(
          `http://api.biziffy.com/api/populerCity/get-popular-city-by-id/${id}`
        );
        const result = res.data?.data;
        // console.log("res:====", res?.data.data);
        if (res.data?.status) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching city details:", error);
      }
    };

    fetchTopCity();
  }, [id]);

  if (!data) return <div>Loading...</div>; // Optional loading state

  return (
    <>
      <Head>
        <title>{data?.cityName} - Top Businesses | Biziffy</title>
        <meta
          name="description"
          content={`Discover top businesses in ${data?.cityName} on Biziffy.`}
        />
      </Head>

      <section>
        <div className="all-breadcrumb">
          <Image
            src={data?.banner}
            alt="Breadcrumb Background"
            className="w-100"
            layout="fill"
            objectFit="cover"
          />
          <div className="city-bread-overlay"></div>
          <div className="container">
            <div className="bread-content">
              <h1>Discover the Best of {data?.cityName}</h1>
              <h6>Welcome to the City of Dreams</h6>
            </div>
          </div>
        </div>
      </section>

      <section className="citys-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="citys-section-head">
                <h1 className="citys-section-heading">
                  What are you looking for?
                </h1>
              </div>
            </div>
            {data?.category?.map((category, index) => (
              <div key={index} className="col-md-2 col-sm-3 col-4">
                <div className="city-category-select-data">
                  <Link
                    href={`/pages/bussiness-listing?query=${
                      category?.name
                    }&pincode=${data?.city?.pinCode}&title=${"CityPage"}`}
                  >
                    <div className="city-category-img">
                      <Image
                        src={category?.icon}
                        alt={category?.name}
                        className="city-category-round-img"
                        height={100}
                        width={100}
                      />
                    </div>
                  </Link>
                  <h4 className="city-category-title">{category?.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="city-about-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="city-about-div">
                <Image
                  src={data?.city?.cityImage}
                  alt="About Mumbai"
                  className="city-about-image"
                   height={100}
                        width={100}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="city-about-content">
                <h1 className="city-about-title">About {data?.cityName}</h1>
                <p className="city-about-text">
                  {data?.description ||
                    `Explore the best businesses and attractions in ${data?.cityName}.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
