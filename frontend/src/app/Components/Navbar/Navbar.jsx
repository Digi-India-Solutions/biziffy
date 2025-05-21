"use client";
import React, { useRef, useEffect, useState } from "react";
import "./navbar.css";
import Link from "next/link";
// import logo from "../../Images/logo.jpg";
import Image from "next/image";
import "../../pages/login/page";
import { useRouter } from "next/navigation";


const Header = () => {
  const navbarCollapseRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ NEW: state for login check
  const router = useRouter(); // ✅ NEW: used for logout redirection

  useEffect(() => {
    // ✅ NEW: Check localStorage for token on page load
    const token = localStorage.getItem("biziffyToken");
    console.log("Token:", token);
    setIsLoggedIn(!!token);
  }, []);

  // ✅ NEW: Logout handler
  const handleLogout = () => {
    localStorage.removeItem("biziffyToken");
    localStorage.removeItem("biziffyUser");
    setIsLoggedIn(false);
    router.push("/pages/login"); // redirect to login after logout
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target)
      ) {
        const bsCollapse = new window.bootstrap.Collapse(
          navbarCollapseRef.current,
          {
            toggle: false,
          }
        );
        bsCollapse.hide();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        {/* <div className="navbar-top">
          <div className="bg-light border-bottom py-2 px-3 d-flex justify-content-between align-items-center flex-wrap small">
            <div className="d-flex align-items-center gap-3 mb-2 mb-md-0">
              <span><i className="bi bi-envelope me-1"></i> info@bizifffy.com</span>
              <span><i className="bi bi-telephone me-1"></i> +91 9876543210</span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

        </div> */}
        <div className="container">
          <Link className="navbar-brand" href="/">
            <p className="logo-text">
              Bizi<span>ff</span>y{" "}
            </p>
            {/* <Image src={logo} alt="logo" /> */}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span>
              <i className="bi bi-list text-white"></i>
            </span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            ref={navbarCollapseRef}
          >
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/earn-with-us"
                  onClick={() => {
                    if (navbarCollapseRef.current) {
                      new window.bootstrap.Collapse(navbarCollapseRef.current, {
                        toggle: false,
                      }).hide();
                    }
                  }}
                >
                  Earn With Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/corporate-advertise"
                  onClick={() => {
                    if (navbarCollapseRef.current) {
                      new window.bootstrap.Collapse(navbarCollapseRef.current, {
                        toggle: false,
                      }).hide();
                    }
                  }}
                >
                  Corporate Advertise
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/free-listing"
                  onClick={() => {
                    if (navbarCollapseRef.current) {
                      new window.bootstrap.Collapse(navbarCollapseRef.current, {
                        toggle: false,
                      }).hide();
                    }
                  }}
                >
                  Free Listing
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href="/pages/mybusiness"
                  onClick={() => {
                    if (navbarCollapseRef.current) {
                      new window.bootstrap.Collapse(navbarCollapseRef.current, {
                        toggle: false,
                      }).hide();
                    }
                  }}
                >
                  My Business
                </Link>
              </li>
            </ul>
              {/* ✅ Conditionally render SignIn/Register OR My Profile/Logout */}
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

              <div className="dropdown">
              <button
                className="btn border-0 d-flex align-items-center"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ backgroundColor: 'transparent' }}
              >
                <i className="bi bi-person-circle fs-3 text-dark"></i>
              </button>
            
              <ul
                className="dropdown-menu dropdown-menu-end shadow-lg border-0"
                aria-labelledby="profileDropdown"
                style={{ minWidth: '150px' }}
              >
                <li>
                  <Link href="/pages/Profile" className="dropdown-item d-flex align-items-center gap-2">
                    <i className="bi bi-person"></i> Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
            
          )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
