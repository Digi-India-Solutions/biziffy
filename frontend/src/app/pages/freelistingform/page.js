"use client";
import React, { use, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tabs, Tab, Form } from "react-bootstrap";
import "./freelistingform.css";
import Image from "next/image";
import contactImage from "../../Images/Step1.png";
import businessImage from "../../Images/Step2.png";
import categoryImage from "../../Images/Step3.png";
import timingImage from "../../Images/Step3.png";
import upgradeImage from "../../Images/Step4.png";
import Head from "next/head";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BusinessDetails from "../../Components/FreeListingform/BusinessDetails";
import ContactPerson from "../../Components/FreeListingform/ContactPerson";
import BusinessCategory from "../../Components/FreeListingform/BusinessCategory";
import BusinessTiming from "../../Components/FreeListingform/BusinessTiming";
import UpgradeListing from "../../Components/FreeListingform/UpgradeListing";
import { useRouter } from "next/navigation";
import { postData } from "../../services/FetchNodeServices";


const Page = () => {
  const [key, setKey] = useState("contact");
  const [formData, setFormData] = useState({ contactPerson: { userId: "" } });
  const router = useRouter();
  const tabImages = { contact: contactImage, business: businessImage, category: categoryImage, timing: timingImage, upgrade: upgradeImage, };

  console.log("FORMDATA:-", formData);
  const handleListingSubmit = async () => {
    // console.log("FORMDATA2:-", formData.businessCategory?.businessImages?.bImage);
    const form = new FormData();
    form.append("contactPerson", JSON.stringify(formData?.contactPerson));
    form.append("businessDetails", JSON.stringify(formData?.businessDetails));
    form.append("businessTiming", JSON.stringify(formData?.timings));
    form.append("businessCategory", JSON.stringify(formData?.businessCategory));
    form.append("upgradeListing", JSON.stringify(formData?.upgradeListing));
    if (formData?.businessCategory?.businessImages?.bImage) {
      formData.businessCategory?.businessImages?.bImage.forEach((file) => form.append("businessImages", file));
    }

    try {
      const response = await postData("createBusinessListing", form);
      console.log("ZZZZZZZZZZ:=>", response.status)
      if (response?.status) {
        toast.success(response.message);
        router.push('/pages/freelistingform/freelistingformsuccess')

      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const storedData = localStorage.getItem('biziffyUser');
    const userData = JSON.parse(storedData);
    // console.log("Stored Data:", userData);

    if (!storedData) {
      router.push('/pages/login');
    } else {
      setFormData(f => ({ ...f, contactPerson: { userId: userData._id } }));
    }
  }, [router]);

  return (
    <>
      <ToastContainer />
      <Head>
        <title>Free Business Listing | List Your Businesses on Biziffy</title>
        <meta
          name="description"
          content="List your business for free on Biziffy and reach thousands of customers. Submit your company details, contact info, category, and go live today!"
        />
        <meta
          name="keywords"
          content="free business listing, list my business, online business directory, submit business form, business listing India, local business promotion, contact info form, free local listing, company registration online, promote my business, free business form, Biziffy listing form, digital listing, get listed for free, business leads, grow online, SEO for local business, free SME registration, list startup, MSME online visibility"
        />

        {/* Open Graph for social media */}
        <meta
          property="og:title"
          content="Free Business Listing | Submit Your Business on Biziffy"
        />
        <meta
          property="og:description"
          content="Submit your business details for free. Reach more customers through Biziffy’s high-performing local directory."
        />
        <meta property="og:url" content="https://biziffy.com/free-listing" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Biziffy" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free Business Listing | List Your Company on Biziffy"
        />
        <meta
          name="twitter:description"
          content="Fill out the free listing form and start getting leads from your local area. No payment required!"
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>

      <section className="freelistingform-page-css">
        <div className="container">
          <div className="row">
            {/* Fixed Image Section */}
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <Image
                src={tabImages[key]}
                alt="Tab Illustration"
                className="tab-image"
              />
            </div>

            {/* Form Section */}
            <div className="col-md-6">
              <h4 className="tab-form-title">Please Fill Your Details</h4>
              <div className="free-listing-multitab">
                <Tabs activeKey={key} className="border-0">
                  <Tab eventKey="contact" className="tab-stlye">
                    <ContactPerson setKey={setKey} formData={formData} setFormData={setFormData} />
                  </Tab>
                  <Tab eventKey="business" className="tab-stlye">
                    <BusinessDetails setKey={setKey} formData={formData} setFormData={setFormData} />
                  </Tab>

                  <Tab eventKey="category" className="tab-stlye">
                    <BusinessCategory setKey={setKey} formData={formData} setFormData={setFormData} />
                  </Tab>
                  <Tab eventKey="timing" className="tab-stlye">
                    <BusinessTiming setKey={setKey} formData={formData} setFormData={setFormData} />
                  </Tab>
                  <Tab eventKey="upgrade" className="tab-stlye">
                    <UpgradeListing setKey={setKey} handleListingSubmit={handleListingSubmit} formData={formData} setFormData={setFormData} />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;