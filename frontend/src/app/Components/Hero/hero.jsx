// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import UserLocation from "../UserLocation/UserLocation";
// import "./hero.css";
// import { getData } from "../../services/FetchNodeServices";

// const Hero = () => {
//   const router = useRouter();

//   const [location, setLocation] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pinCodes, setPinCodes] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [listing, setListing] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoryResponse = await getData("categories");
//         const categories = categoryResponse?.map((cat) => cat?.name);
//         setCategoryList(categories);
//         // Fetch listings
//         const listingResponse = await getData("get-all-listings");
//         setListing(listingResponse?.data?.map(listing => listing?.businessDetails?.businessName));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Suggestions update
//   useEffect(() => {
//     if (searchText.trim() === "") {
//       setSuggestions([]);
//       return;
//     }

//     const filtered = categoryList?.filter((cat) =>
//       cat?.toLowerCase().includes(searchText?.toLowerCase())
//     );
//     setSuggestions(filtered);
//   }, [searchText]);

//   const handleSuggestionClick = (text) => {
//     setSearchText(text);

//     setTimeout(() => { setSuggestions([]); }, 50);
//   };


//   const placeholderTexts = [
//     "Search for plumbers...",
//     "Find the best tutors...",
//     "Looking for car services?",
//     "Explore wedding planners...",
//     "Find electricians near you...",
//   ];
//   const [placeholderIndex, setPlaceholderIndex] = useState(0);
//   const [animatedText, setAnimatedText] = useState("");

//   // Fetch pin codes
//   useEffect(() => {
//     const fetchPinCodes = async () => {
//       try {
//         const response = await getData("pincode/get-all-pin-codes");
//         console.log("responseresponse:=>", response)
//         if (response?.status) {
//           setPinCodes(response?.pinCodes);
//         }
//       } catch (error) {
//         console.error("Error fetching pin codes:", error);
//       }
//     };
//     fetchPinCodes();
//   }, []);

//   const extractPincode = (locationText) => {
//     const pincode = locationText.match(/\d{6}$/);
//     return pincode ? pincode[0] : "";
//   };

//   const handleSelect = (loc) => {
//     setSelectedLocation(loc);
//     setLocation({ pincode: loc.pinCode });
//   };

//   const handleClear = () => {
//     setSelectedLocation(null);
//     setLocation(null);
//   };

//   const handleSearch = () => {
//     const pincode = selectedLocation?.pincode || location?.pincode;
//     const state = selectedLocation?.stateName || location?.state;
//     console.log("LOCATION:=>", pincode, "LOCATION 2:=>", location);
//     if (!pincode || !searchText.trim()) {
//       alert("Please wait for location and enter a search term.");
//       return;
//     }
//     const slugify = (text) =>
//       text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

//     router.push(
//       `/pages/bussiness-listing/${pincode || 12121}/${slugify(state || 'state')}/${slugify(searchText)}`
//     );
//   };

//   // console.log("CCCCCCCC:-", pinCodes)
//   const filteredLocations = pinCodes.filter((loc) => {
//     const lowerSearch = searchTerm.toLowerCase();
//     return (
//       loc?.stateName?.toLowerCase().includes(lowerSearch) ||
//       loc?.area?.toLowerCase().includes(lowerSearch) ||
//       loc?.pincode?.toString().includes(lowerSearch)
//     );
//   });

//   // Animated placeholder
//   useEffect(() => {
//     let charIndex = 0;
//     const text = placeholderTexts[placeholderIndex];
//     const interval = setInterval(() => {
//       setAnimatedText(text.slice(0, charIndex));
//       charIndex++;
//       if (charIndex > text.length) {
//         clearInterval(interval);
//         setTimeout(() => {
//           setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
//         }, 1500);
//       }
//     }, 100);

//     return () => clearInterval(interval);
//   }, [placeholderIndex]);

//   return (
//     <section className="some-page-hero-bg">
//       <div className="container">
//         <div className="hero-main">
//           <div className="row">
//             <div className="col-md-12">
//               <div className="hero-content">
//                 <h1 className="hero-title">
//                   We Are Connecting! <span>Stay Hold</span> Your Success is Near.
//                 </h1>

//                 {/* SEARCH BAR */}
//                 <div className="hero-search-bar">
//                   <div className="hero-search-container">
//                     {/* LOCATION SELECT DROPDOWN */}
//                     <div className="dropdown" style={{ borderRight: "1px solid #ccc" }}>
//                       <button
//                         className="location-dropdown"
//                         type="button"
//                         id="locationDropdown"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         <i className="bi bi-geo-alt me-2"></i>
//                         {selectedLocation ? (
//                           `${selectedLocation.area}, ${selectedLocation.stateName}`
//                         ) : (
//                           <UserLocation location={location} setLocation={setLocation} />
//                         )}
//                       </button>

//                       <ul className="dropdown-menu home-select-location p-3 location-dropdown" aria-labelledby="locationDropdown">
//                         <li>
//                           <input
//                             type="text"
//                             className="form-control mb-2"
//                             placeholder="Search location..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                           />
//                         </li>
//                         <li className="dropdown-section-title d-flex justify-content-between">
//                           RECENT LOCATIONS
//                           <span className="text-danger fw-normal" style={{ cursor: "pointer" }} onClick={handleClear}>
//                             Clear All
//                           </span>
//                         </li>
//                         {filteredLocations?.length > 0 ? (
//                           filteredLocations?.map((loc, i) => (
//                             <li key={i}>
//                               <button
//                                 className="dropdown-item"
//                                 type="button"
//                                 onClick={() => handleSelect(loc)}
//                               >
//                                 {loc?.area}
//                                 {/* , {loc?.stateName} */}
//                               </button>
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-muted px-2">No matching locations</li>
//                         )}
//                       </ul>
//                     </div>

//                     {/* SEARCH INPUT */}
//                     <div style={{ position: "relative", width: "100%" }}>
//                       <input
//                         type="text"
//                         className="hero-search-input"
//                         value={searchText}
//                         onChange={(e) => setSearchText(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             e.preventDefault();
//                             handleSearch();
//                           }
//                         }}
//                         placeholder="Search categories..."
//                       />

//                       {/* Suggestions Dropdown */}
//                       {suggestions.length > 0 && (
//                         <ul className="suggestions-dropdown">
//                           {suggestions.map((item, index) => (
//                             <li key={index} onClick={() => handleSuggestionClick(item)}>
//                               <b> <i class="bi bi-search"></i></b> &nbsp; {item}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>

//                     {/* SEARCH BUTTON */}
//                     <button className="hero-search-btn" aria-label="Search" onClick={handleSearch}>
//                       <i className="bi bi-search"></i>
//                     </button>
//                   </div>
//                 </div>

//                 {/* CTA BUTTONS */}
//                 <div className="hero-buttons">
//                   <Link href="/pages/list-your-webiste" className="herobutton1">
//                     List Your Website
//                   </Link>
//                   <Link href="/pages/freelistingform" className="herobutton2">
//                     List Your Business
//                   </Link>
//                 </div>
//               </div>
//             </div>

//             {/* Optional Image Section */}
//             {/* <div className="col-lg-5 col-md-12 d-flex justify-content-center position-relative">
//               <div className="hero-image-container">
//                 <Image src={heroimage2} alt="Hero Illustration" layout="intrinsic" className="hero-background-shape" />
//                 <Image src={blueImage} alt="Background Shape" layout="intrinsic" className="hero-animated-image" />
//               </div>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserLocation from "../UserLocation/UserLocation";
import { getData } from "../../services/FetchNodeServices";
import "./hero.css";

const Hero = () => {
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [pinCodes, setPinCodes] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedText, setAnimatedText] = useState("");
  const placeholderTexts = [
    "Search for plumbers...",
    "Find the best tutors...",
    "Looking for car services?",
    "Explore wedding planners...",
    "Find electricians near you...",
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categories = await getData("categories");
        const categoryNames = categories?.map((cat) => cat?.name) || [];
        setCategoryList(categoryNames);

        const listings = await getData("get-all-listings");
        const listingNames = listings?.data?.map(l => l?.businessDetails?.businessName);
        // You can use this `listingNames` if needed for extended search
      } catch (err) {
        console.error("Error fetching categories or listings", err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPinCodes = async () => {
      try {
        const response = await getData("pincode/get-all-pin-codes");
        if (response?.status) {
          setPinCodes(response.pinCodes);
        }
      } catch (err) {
        console.error("Error fetching pin codes", err);
      }
    };

    fetchPinCodes();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) return setSuggestions([]);
    const filtered = categoryList.filter((item) =>
      item?.toLowerCase().includes(searchText.toLowerCase())
    );
    setSuggestions(filtered);
  }, [searchText]);

  useEffect(() => {
    let charIndex = 0;
    const text = placeholderTexts[placeholderIndex];
    const interval = setInterval(() => {
      setAnimatedText(text.slice(0, charIndex++));
      if (charIndex > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [placeholderIndex]);

  const handleSuggestionClick = (item) => {
    setSearchText(item);
    setSuggestions([]);
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setLocation({ pincode: loc.pinCode });
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setLocation(null);
  };

  const handleSearch = () => {
    const pincode = selectedLocation?.pincode || location?.pincode;
    const state = selectedLocation?.stateName || location?.state;
    if (!pincode || !searchText.trim()) {
      alert("Please wait for location and enter a search term.");
      return;
    }

    const slugify = (text) =>
      text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

    router.push(
      `/pages/bussiness-listing/${pincode}/${slugify(state || "state")}/${slugify(searchText)}`
    );
  };

  const filteredLocations = pinCodes.filter((loc) => {
    const search = searchLocation.toLowerCase();
    return (
      loc?.stateName?.toLowerCase().includes(search) ||
      loc?.area?.toLowerCase().includes(search) ||
      loc?.pincode?.toString().includes(search)
    );
  });

  return (
    <section className="some-page-hero-bg">
      <div className="container">
        <div className="hero-main">
          <div className="row">
            <div className="col-md-12">
              <div className="hero-content">
                <h1 className="hero-title">
                  We Are Connecting! <span>Stay Hold</span> Your Success is Near.
                </h1>

                {/* Search Bar */}
                <div className="hero-search-bar">
                  <div className="hero-search-container">
                    {/* Location Dropdown */}
                    <div className="dropdown" style={{ borderRight: "1px solid #ccc" }}>
                      <button
                        className="location-dropdown"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-geo-alt me-2"></i>
                        {selectedLocation ? (
                          `${selectedLocation.area}, ${selectedLocation.stateName}`
                        ) : (
                          <UserLocation location={location} setLocation={setLocation} />
                        )}
                      </button>

                      <ul className="dropdown-menu home-select-location p-3 location-dropdown">
                        <li>
                          <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search location..."
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                          />
                        </li>
                        <li className="dropdown-section-title d-flex justify-content-between">
                          RECENT LOCATIONS
                          <span
                            className="text-danger fw-normal"
                            style={{ cursor: "pointer" }}
                            onClick={handleClearLocation}
                          >
                            Clear All
                          </span>
                        </li>
                        {filteredLocations.length ? (
                          filteredLocations.map((loc, i) => (
                            <li key={i}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleSelectLocation(loc)}
                              >
                                {loc.area}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted px-2">No matching locations</li>
                        )}
                      </ul>
                    </div>

                    {/* Category Input */}
                    <div style={{ position: "relative", width: "100%" }}>
                      <input
                        type="text"
                        className="hero-search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder={animatedText || "Search categories..."}
                      />
                      {suggestions.length > 0 && (
                        <ul className="suggestions-dropdown">
                          {suggestions.map((item, i) => (
                            <li key={i} onClick={() => handleSuggestionClick(item)}>
                              <i className="bi bi-search me-2"></i> {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Search Button */}
                    <button className="hero-search-btn" onClick={handleSearch}>
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="hero-buttons">
                  <Link href="/pages/list-your-webiste" className="herobutton1">
                    List Your Website
                  </Link>
                  <Link href="/pages/freelistingform" className="herobutton2">
                    List Your Business
                  </Link>
                </div>
              </div>
            </div>

            {/* Optional image block can go here */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
