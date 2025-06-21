import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getData } from "../../services/FetchNodeServices";
const DealOffers = () => {
  const [formData, setFormData] = useState({});
  // const data = {
  //   dealsAndOffers: [
  //     { name: "Kotak Mahindra Bank", link: "/deals/kotak-mahindra" },
  //     { name: "INOX Cinemas", link: "/deals/inox-cinemas" },
  //     { name: "Canara Bank", link: "/deals/canara-bank" },
  //     { name: "Pizza Hut Offers", link: "/deals/pizza-hut" },
  //     { name: "Amazon Discounts", link: "/deals/amazon" },
  //     { name: "Flipkart Sale", link: "/deals/flipkart" },
  //     { name: "Uber Coupons", link: "/deals/uber" },
  //     { name: "Zomato Gold", link: "/deals/zomato-gold" },
  //     { name: "Ola Cashback", link: "/deals/ola-cashback" },
  //     { name: "Paytm Offers", link: "/deals/paytm" },
  //     { name: "Swiggy Super Deals", link: "/deals/swiggy" },
  //     { name: "BookMyShow Combos", link: "/deals/bookmyshow" },
  //     { name: "Domino’s Deals", link: "/deals/dominos" },
  //     { name: "MakeMyTrip Offers", link: "/deals/makemytrip" },
  //     { name: "Cleartrip Discounts", link: "/deals/cleartrip" },
  //     { name: "RedBus Coupons", link: "/deals/redbus" },
  //     { name: "AirAsia Sales", link: "/deals/airasia" },
  //     { name: "BigBasket Offers", link: "/deals/bigbasket" },
  //     { name: "Myntra Mega Sale", link: "/deals/myntra" },
  //   ],
  // };

  const fetchPopulerCity = async () => {
    try {
      const res = await getData("populerCity/get-all-popular-cities");
      // console.log("res->", res.data.filter((item) => item?.isActive === true));
      if (res?.status === true) {
        setFormData((prevData) => ({
          ...prevData, popularCities: res?.data?.filter((item) => item?.isActive === true),
        }));
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  }

  const fetchSubCategory = async () => {
    try {
      const res = await getData("admin/subcategories");
      console.log("res->", res.filter((item) => item?.status === "active"));
      setFormData((prevData) => ({
        ...prevData, popularSubCategory: res.filter((item) => item?.status === "active") || [],
      }));
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  }
  useEffect(() => {
    fetchPopulerCity();
    fetchSubCategory();
  }, []);

  console.log("formData?.popularSubCategory", formData?.popularSubCategory)

  return (
    <>
      <div className="container my-4">
        {/* Popular Cities */}
        <div className="mb-4">
          <h6 className="fw-bold">Popular Cities</h6>
          <div className="d-flex flex-wrap gap-2" style={{ fontSize: "14px" }}>
            {formData?.popularCities?.length > 0 && formData?.popularCities?.map((item, index) => (
              <span key={index}>
                {/* <Link
                  // href={item?.link}
                  className="text-decoration-none text-dark"
                > */}
                {item?.city?.name}
                {/* </Link> */}
                {formData?.popularCities?.length - 1 && (
                  <span className="mx-2 text-muted">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* JD Collections */}
        <div className="mb-4">
          <h6 className="fw-bold">Explore Biziffy Collections</h6>
          <div className="d-flex flex-wrap gap-2" style={{ fontSize: "14px" }}>
            {formData?.popularSubCategory?.length > 0 && formData?.popularSubCategory?.map((item, index) => (
              <span key={index}>
                {/* <Link
                  href={item.link}
                  className="text-decoration-none text-dark"
                > */}
                {item?.name}
                {/* </Link> */}
                {index !== formData?.popularSubCategory?.length - 1 && (
                  <span className="mx-2 text-muted">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Deals and Offers */}
        {/* <div className="mb-4">
          <h6 className="fw-bold">Deals and Offers</h6>
          <div className="d-flex flex-wrap gap-2" style={{ fontSize: "14px" }}>
            {data.dealsAndOffers.map((item, index) => (
              <span key={index}>
                <Link
                  href={item.link}
                  className="text-decoration-none text-dark"
                >
                  {item.name}
                </Link>
                {index !== data.dealsAndOffers.length - 1 && (
                  <span className="mx-2 text-muted">|</span>
                )}
              </span>
            ))}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default DealOffers;
