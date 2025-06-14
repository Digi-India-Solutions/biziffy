// import React, { useState, useRef, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import Link from "next/link";
// import './dashboard.css'
// import DashboardDetails from "../DashboardDetails/DashboardDetails";
// const Dashboard = ({ businessListing }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [singleData, setSingleData] = useState(businessListing?.length > 0 ? businessListing[0]?._id : []);
//   const [type, setType] = useState({});
//   const menuRef = useRef();
//   useEffect(() => {
//     const handler = (e) => {
//       if (!menuRef.current?.contains(e.target)) setDropdownOpen(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const filteredData = businessListing?.find((item) => item?._id === singleData);

//   const clickCountsArray = filteredData?.clickCounts
//     ? Object.entries(filteredData.clickCounts).map(([key, { count, user }]) => ({
//       title: key.charAt(0).toUpperCase() + key.slice(1), count, user
//     }))
//     : [];


//   const totalListings = businessListing.reduce((acc, item) => {
//     return acc + (item?.clickCounts?.listings.count || 0);
//   }, 0);

//   const gradients = [
//     "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//     "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
//     "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)",
//     "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
//     "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
//     "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)"
//   ];

//   console.log("bbbbbbbbb:=", clickCountsArray)
//   return (
//     <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
//       <div className="flex-grow-1">
//         {/* Navbar */}
//         <nav className="navbar navbar-light bg-white shadow-sm px-4 d-flex justify-content-between">
//           <Link className="navbar-brand" href="/">
//             <p className="logo-text">
//               Bizi<span>ff</span>y{" "}
//             </p>
//             {/* <Image src={logo} alt="logo" /> */}
//           </Link>

//           {/* Profile Dropdown */}
//           <div className="position-relative" ref={menuRef}>
//             <button
//               className="btn btn-light d-flex align-items-center gap-2 m-0"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <i className="bi bi-person-circle fs-5"></i>
//               <i className={`bi ${dropdownOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"} fs-6`}></i>
//             </button>
//             {dropdownOpen && (
//               <div
//                 className="position-absolute end-0 bg-white border shadow rounded p-2"
//                 style={{ minWidth: "160px", zIndex: 1000 }}
//               >
//                 <Link href="/pages/Profile" className="dropdown-item">
//                   <i className="bi bi-person"></i> Profile
//                 </Link>
//                 <button onClick={() => alert("Logout logic here")} className="dropdown-item text-danger">
//                   <i className="bi bi-box-arrow-right"></i> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Content */}
//         <div className="p-4">
//           <div className="row d-flex align-items-start justify-content-between mb-4">
//             <div className="col-md-8">
//               <h2 className="mb-4">Dashboard Overview</h2>
//             </div>
//             <div className="col-md-4">
//               <select value={singleData} onChange={(e) => setSingleData(e.target.value)} className="form-control">
//                 <option value="">Select Business</option>
//                 {businessListing?.map((item, i) => (
//                   <option key={i} value={item?._id}>{item?.businessDetails?.businessName}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="row g-4">
//             <div key={"Total Profile Views"} className="col-md-3  " onClick={() => setType("table")}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body">
//                   <h5 className="card-title">Total Profile Views</h5>
//                   <p className="card-text display-6">{totalListings}</p>
//                 </div>
//               </div>
//             </div>

//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[1])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(1 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[1]?.title || 'Listings'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[1]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>

//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[2])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(2 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[2]?.title || 'Whatsapp'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[2]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>
//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[3])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(3 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[3]?.title || 'Website'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[3]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>
//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[4])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(4 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[4]?.title || 'Contact'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[4]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>
//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[5])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(4 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[5]?.title || 'share'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[5]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>
//             <div key={'i'} className="col-md-3" onClick={() => setType(clickCountsArray[6])}>
//               <div className="card shadow-sm border-0">
//                 <div className="card-body dashboard-card-body" style={{ background: gradients[(5 + 1) % gradients.length] }}>
//                   <h5 className="card-title">{clickCountsArray[6]?.title || 'direction'}</h5>
//                   <p className="card-text display-6">{clickCountsArray[6]?.count || 0}</p>
//                   <div style={{ margin: "auto", color: "#0d6efd", cursor: 'pointer' }}>View All</div>
//                 </div>
//               </div>
//             </div>

//             <DashboardDetails setType={setType} type={type} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";
import "./dashboard.css";
import DashboardDetails from "../DashboardDetails/DashboardDetails";

const Dashboard = ({ businessListing }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [singleData, setSingleData] = useState(businessListing?.[0]?._id || "");
  const [type, setType] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredData = businessListing?.find((item) => item?._id === singleData);
  const clickCountsArray = filteredData?.clickCounts
    ? Object.entries(filteredData.clickCounts).map(([key, { count, user }]) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      count,
      user,
      key,
    }))
    : [];

    // console.log("businessListing", businessListing)
  const totalListings = businessListing.reduce((acc, item) => {
    return acc + (item?.clickCounts?.listings?.count || 0);
  }, 0);

  const gradients = [
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
  ];
 console.log("TYPE:-",type)
  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="flex-grow-1">
        {/* Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 d-flex justify-content-between">
          <Link className="navbar-brand" href="/">
            <p className="logo-text">
              Bizi<span>ff</span>y{" "}
            </p>
          </Link>

          {/* Profile Dropdown */}
          <div className="position-relative" ref={menuRef}>
            <button
              className="btn btn-light d-flex align-items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <i className="bi bi-person-circle fs-5"></i>
              <i className={`bi ${dropdownOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"} fs-6`}></i>
            </button>
            {dropdownOpen && (
              <div
                className="position-absolute end-0 bg-white border shadow rounded p-2"
                style={{ minWidth: "160px", zIndex: 1000 }}
              >
                <Link href="/pages/Profile" className="dropdown-item">
                  <i className="bi bi-person"></i> Profile
                </Link>
                <button onClick={() => alert("Logout logic here")} className="dropdown-item text-danger">
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="p-4">
          <div className="row align-items-start justify-content-between mb-4">
            <div className="col-md-8">
              <h2 className="mb-4">Dashboard Overview</h2>
            </div>
            <div className="col-md-4">
              <select
                value={singleData}
                onChange={(e) => {
                  setSingleData(e.target.value);
                  setType(null); // Reset type on business change
                }}
                className="form-control"
              >
                <option value="">Select Business</option>
                {businessListing?.map((item, i) => (
                  <option key={i} value={item?._id}>
                    {item?.businessDetails?.businessName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-4">
            {/* Total Profile Views Card */}
            <div className="col-md-3" onClick={() => setType("table")}>
              <div className="card shadow-sm border-0">
                <div className="card-body dashboard-card-body">
                  <h5 className="card-title">Total Profile Views</h5>
                  <p className="card-text display-6">{totalListings}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Cards */}
            {Array.from({ length: 6 }).map((_, i) => {
              const data = clickCountsArray[i + 1] || {
                title: ["Listings", "Whatsapp", "Website", "Contact", "Share", "Direction"][i],
                count: 0,
              };
              console.log("data=>", data?.user)
              return (
                <div key={i} className="col-md-3" onClick={() => setType(data)}>
                  <div className="card shadow-sm border-0">
                    <div
                      className="card-body dashboard-card-body"
                      style={{ background: gradients[i % gradients.length] }}
                    >
                      <h5 className="card-title">{data.title}</h5>
                      <p className="card-text display-6">{data.count}</p>
                      <div style={{ color: "#0d6efd", cursor: "pointer" }}>View All</div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Dashboard Details */}
            <DashboardDetails setType={setType} type={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
