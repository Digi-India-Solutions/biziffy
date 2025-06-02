// "use client";
// import React, { useRef, useEffect, useState } from "react";
// import "../Navbar/navbar.css";
// import Link from "next/link";
// import logo from "../../Images/logo.jpg";
// import Image from "next/image";
// import "../../pages/login/page";
// import "./businessNavbar.css";
// import UserLocation from "../UserLocation/UserLocation";
// import { useRouter } from "next/navigation";

// const BusinessNavbar = () => {
//   const navbarCollapseRef = useRef(null);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         navbarCollapseRef.current &&
//         !navbarCollapseRef.current.contains(event.target)
//       ) {
//         const bsCollapse = new window.bootstrap.Collapse(
//           navbarCollapseRef.current,
//           {
//             toggle: false,
//           }
//         );
//         bsCollapse.hide();
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   const placeholderTexts = [
//     "Search for plumbers...",
//     "Find the best tutors...",
//     "Looking for car services?",
//     "Explore wedding planners...",
//     "Find electricians near you...",
//   ];
//   const [placeholderIndex, setPlaceholderIndex] = useState(0);
//   const [animatedText, setAnimatedText] = useState("");

//   useEffect(() => {
//     let charIndex = 0;
//     const interval = setInterval(() => {
//       setAnimatedText(placeholderTexts[placeholderIndex].slice(0, charIndex));
//       charIndex++;
//       if (charIndex > placeholderTexts[placeholderIndex].length) {
//         clearInterval(interval);
//         setTimeout(() => {
//           setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
//         }, 1500);
//       }
//     }, 100);
//     return () => clearInterval(interval);
//   }, [placeholderIndex]);


//   const handleSearch = async () => {
//     if (!location?.pincode || !searchText.trim()) {
//       alert("Please wait for location and enter a search term.");
//       return;
//     }

//     // try {
//     //   const res = await axios.get("https://api.biziffy.com/api/search", {
//     //     params: {
//     //       query: searchText.trim(),
//     //       pincode: location.pincode,
//     //     },
//     //   });

//     // console.log("Search Results:", res.data);
//     router.push(`/pages/bussiness-listing?query=${searchText.trim()}&pincode=${location.pincode}`);
//     // } catch (err) {
//     //   console.error("Search failed", err);
//     //   alert("Search failed. Try again later.");
//     // }
//   };

//   return (
//     <>
//       <section className="business-navbar">
//         <nav className="navbar navbar-expand-lg">
//           <div className="container-fluid">
//             <Link className="navbar-brand" href="/">
//               <Image src={logo} alt="logo" />
//             </Link>

//             {/* Desktop search bar */}
//             <div className="d-none d-lg-flex business-navbar-search-container">
//               <div className="hero-location-select">
//                 <UserLocation location={location} setLocation={setLocation} />
//               </div>
//               <input
//                 type="text"
//                 className="hero-search-input"
//                 onChange={(e) => setSearchText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault(); // prevent form submission if inside form
//                     if (searchText.trim() && location?.pincode) {
//                       router.push(`/pages/bussiness-listing?query=${searchText?.trim()}&pincode=${location.pincode}`);
//                     } else {
//                       alert("Please enter search text and allow location.");
//                     }
//                   }
//                 }}
//                 placeholder={animatedText}
//               />
//               <button className="hero-search-btn" onClick={handleSearch}>
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>

//             {/* Mobile search icon */}
//             <div className="d-flex gap-3 d-lg-none">
//               <button
//                 className="d-lg-none btn btn-link  p-0 ms-2"
//                 onClick={() => setShowMobileSearch(!showMobileSearch)}
//               >
//                 <i className="bi bi-search fs-4"></i>
//               </button>

//               <button
//                 className="navbar-toggler"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#navbarSupportedContent"
//                 aria-controls="navbarSupportedContent"
//                 aria-expanded="false"
//                 aria-label="Toggle navigation"
//               >
//                 <span>
//                   <i className="bi bi-list text-white"></i>
//                 </span>
//               </button>
//             </div>

//             <div
//               className="collapse navbar-collapse justify-content-end"
//               id="navbarSupportedContent"
//               ref={navbarCollapseRef}
//             >
//               <div className="d-flex align-items-center ">
//                 <Link
//                   href="/pages/login"
//                   className="btn btn bg-primary text-white me-2"
//                 >
//                   SignIn
//                 </Link>
//                 <Link
//                   href="/pages/signup"
//                   className="btn btn bg-dark text-white me-2"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </section>

//       {/* Mobile search dropdown */}
//       {showMobileSearch && (
//         <div className="mobile-search-slide animate__animated animate__slideInDown">
//           <div className="container-fluid d-flex flex-column bg-white p-3 shadow">
//             <div className="form-select mb-2">
//               <UserLocation />
//             </div>
//             <div className="d-flex">
//               <input
//                 type="text"
//                 className="form-control me-2"
//                 placeholder={animatedText}
//               />
//               <button className="btn btn-primary">
//                 <i className="bi bi-search"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default BusinessNavbar;


"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../Images/logo.jpg";
import UserLocation from "../UserLocation/UserLocation";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../Navbar/navbar.css";
import "./businessNavbar.css";
import "../Hero/hero.css";

const placeholderTexts = [
  "Search for plumbers...",
  "Find the best tutors...",
  "Looking for car services?",
  "Explore wedding planners...",
  "Find electricians near you...",
];

const BusinessNavbar = () => {
  const router = useRouter();
  const navbarCollapseRef = useRef(null);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pinCodes, setPinCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch PIN codes
  useEffect(() => {
    const fetchPinCodes = async () => {
      try {
        const response = await axios.get("https://api.biziffy.com/api/pincode/get-all-pin-codes");
        if (response.data?.status) {
          setPinCodes(response.data.pinCodes);
        }
      } catch (error) {
        console.error("Error fetching pin codes:", error);
      }
    };
    fetchPinCodes();
  }, []);

  const extractPincode = (pinCodeStr) => {
    const pincode = pinCodeStr?.match(/\d{6}$/);
    return pincode ? pincode[0] : "";
  };

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setLocation({ pincode: loc.pincode });
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setLocation({});
  };

  const filteredLocations = pinCodes.filter((loc) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      loc?.stateName?.toLowerCase().includes(lowerSearch) ||
      loc?.area?.toLowerCase().includes(lowerSearch) ||
      loc?.pincode?.toString().includes(lowerSearch)
    );
  });

  // Handle login state
  useEffect(() => {
    const token = localStorage.getItem("biziffyToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("biziffyToken");
    localStorage.removeItem("biziffyUser");
    setIsLoggedIn(false);
    router.push("/pages/login");
  };

  // Collapse outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target)
      ) {
        const bsCollapse = new window.bootstrap.Collapse(navbarCollapseRef.current, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      setAnimatedText(placeholderTexts[placeholderIndex].slice(0, charIndex));
      charIndex++;
      if (charIndex > placeholderTexts[placeholderIndex].length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 1500);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [placeholderIndex]);

  const handleSearch = () => {
    const finalPincode = selectedLocation?.pinCode || location?.pincode;
    if (!finalPincode) {
      alert("Please select or allow location.");
      return;
    }
    router.push(`/pages/bussiness-listing?query=${searchText.trim()}&pincode=${finalPincode}`);
  };

  return (
    <>
      <section className="business-navbar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/">
              <Image src={logo} alt="Company Logo" width={120} height={40} />
            </Link>

            {/* Desktop search */}
            <div className="d-none d-lg-flex business-navbar-search-container">
              <div className="dropdown" style={{ borderRight: "1px solid #ccc" }}>
                <button
                  className="location-dropdown"
                  type="button"
                  id="locationDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  {selectedLocation ? (
                    `${selectedLocation.area}, ${selectedLocation.stateName}`
                  ) : (
                    <UserLocation location={location} setLocation={setLocation} />
                  )}
                </button>

                <ul className="dropdown-menu home-select-location p-3 location-dropdown" aria-labelledby="locationDropdown">
                  <li>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Search location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </li>
                  <li className="dropdown-section-title d-flex justify-content-between">
                    RECENT LOCATIONS
                    <span className="text-danger fw-normal" style={{ cursor: "pointer" }} onClick={handleClear}>
                      Clear All
                    </span>
                  </li>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc, i) => (
                      <li key={i}>
                        <button className="dropdown-item" onClick={() => handleSelect(loc)}>
                          {loc.area}
                          {/* , {loc.stateName} */}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted px-2">No matching locations</li>
                  )}
                </ul>
              </div>

              <input
                type="text"
                className="hero-search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={animatedText}
              />
              <button className="hero-search-btn" onClick={handleSearch} aria-label="Search">
                <i className="bi bi-search"></i>
              </button>
            </div>

            {/* Mobile toggle */}
            <div className="d-flex gap-3 d-lg-none">
              <button className="btn btn-link p-0" onClick={() => setShowMobileSearch(!showMobileSearch)} aria-label="Toggle search">
                <i className="bi bi-search fs-4"></i>
              </button>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <i className="bi bi-list text-white"></i>
              </button>
            </div>

            {/* Right profile */}
            {!isLoggedIn ? (
              <div className="d-flex align-items-center">
                <Link href="/pages/login" className="btn btn bg-primary text-white me-2">
                  SignIn
                </Link>
                <Link href="/pages/signup" className="btn btn bg-dark text-white me-2">
                  Register
                </Link>
              </div>
            ) : (
              <div className="dropdown">
                <button className="btn border-0 d-flex align-items-center" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle fs-3 text-dark"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="profileDropdown" style={{ minWidth: "150px" }}>
                  <li>
                    <Link href="/pages/Profile" className="dropdown-item d-flex align-items-center gap-2">
                      <i className="bi bi-person"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </section>

      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="mobile-search-slide animate__animated animate__slideInDown">
          <div className="container-fluid d-flex flex-column bg-white p-3 shadow">
            <div className="form-select mb-2">
              <UserLocation location={location} setLocation={setLocation} />
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={animatedText}
              />
              <button className="btn btn-primary" onClick={handleSearch} aria-label="Search">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessNavbar;
