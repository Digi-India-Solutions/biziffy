"use client";
import Link from "next/link";
import Image from "next/image";
import "./footer.css";
import logo from "../../Images/logo.jpg";
import { useEffect, useState } from "react";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ NEW: state for login check
  useEffect(() => {
    // ✅ NEW: Check localStorage for token on page load
    const token = localStorage.getItem("biziffyToken");
    console.log("Token:", token);
    setIsLoggedIn(!!token);
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Logo & Social Media */}
          <div className="col-lg-3 col-md-6 col-6 footer-section">
            <Link className="navbar-brand" href="/">
              <p className="logo-text">
                Bizi<span>ff</span>y{" "}
              </p>
            </Link>
            <p className="footer-description">
              Your trusted partner in digital solutions.
            </p>
            <div className="social-icons">
              <Link target="_blank" href="https://x.com/biziffy_india">
                <i className="bi bi-twitter"></i>
              </Link>
              <Link target="_blank" href="https://www.facebook.com/people/Biziffy-India/pfbid05EeMQK7qXrw5nuEe2B6cKNhBwYTskFwsMrijTM1WdgijuLjvuXUa7GQ94WJM9AEvl/">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link target="_blank" href="#">
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link target="_blank" href="https://www.instagram.com/biziffyindia/">
                <i className="bi bi-instagram"></i>
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-2 col-md-6 col-6 footer-section">
            <h5>Company</h5>
            <ul>
              <li>
                <Link href="/pages/aboutus">About Us</Link>
              </li>
              <li>
                <Link href="/pages/Profile">Profile</Link>
              </li>
              <li>
                <Link href="/pages/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link href="/pages/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/pages/term-and-conditions">Term & Conditions</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6 footer-section">
            <h5>Services</h5>
            <ul>
              <li>
                <Link href="#">Digital Marketing</Link>
              </li>
              <li>
                <Link href="#">SEO Services</Link>
              </li>
              <li>
                <Link href="#">PPC Consulting</Link>
              </li>
              <li>
                <Link href="#">Free SEO Test</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6 footer-section">
            <h5>Resources</h5>
            <ul>
              <li>
                <Link href="#">SEO FAQ</Link>
              </li>
              <li>
                <Link href="#">Ecommerce SEO Guide</Link>
              </li>
              <li>
                <Link href="#">Construction SEO Guide</Link>
              </li>
            </ul>
          </div>

          {/* Member Section */}
          <div className="col-lg-3 col-md-6 footer-section">
            <h5>Biziffy Members</h5>
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
                ""
                // <div className="hero-buttons">
                //   <Link href="/pages/list-your-webiste" className="herobutton1">
                //     List Your Website
                //   </Link>
                //   <Link href="/pages/freelistingform" className="herobutton2">
                //     List Your Business
                //   </Link>
                // </div>
              )}
            </div>
            <p>Find and connect with businesses near you.</p>
          </div>
        </div>
        <hr />
        <div className="footer-bottom text-center">
          <p>
            © {new Date().getFullYear()} Biziffy Media Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
