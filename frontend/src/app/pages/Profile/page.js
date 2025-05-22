"use client";
import React, { useEffect, useState } from "react";
import profileImage from "../../Images/gourav.jpg";
import Image from "next/image";
import Link from "next/link";
import "./profile.css";
import EditBusinessProfile from "../../Components/ProfilesComponents/Edit-business-profile/Edit-business-profile";
import EditWebsiteProfile from "../../Components/ProfilesComponents/Edit-Website-Profile/EditWebsiteProfile"
import AllEnquiry from "../../Components/ProfilesComponents/all-enquiry/all-enquiry";
import Support from "../../Components/ProfilesComponents/Support/Support";
import { toast, ToastContainer } from "react-toastify";
import Head from "next/head";
import axios from "axios";
import Dashboard from "../../Components/Dashboard/Dashboard"
import { useRouter } from "next/navigation";
import ShowWebsiteCout from "../../Components/ShowWebsiteCout/ShowWebsiteCout"
const ProfilePage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userId, setUserId] = useState("");
  const [profileData, setProfileData] = useState({});
  const [previewImage, setPreviewImage] = useState(profileData?.profileImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [businessListing, setBusinessListing] = useState([]);
  const [websiteListing, setWebsiteListing] = useState([]);
  const [listingId, setListingId] = useState('')
  const [showWebsiteVijiter, setShowWebsiteVijiter] = useState(false)
  const [showsiteVijiter, setWebsiteVijiter] = useState(false)
  // const [listings, setListings] = useState([
  //   { id: 1, title: "Awesome Cafe", address: "Bawana Delhi 110039", image: profileImage, },
  //   { id: 2, title: "ModakWala Cafe", address: "Bawana Delhi 110039", image: profileImage, },
  //   { id: 3, title: "Hari Sweets", address: "Bawana Delhi 110039", image: profileImage, },
  // ]);

  const userProfile = {
    firstname: "Maria",
    lastname: "Fernanda",
    userType: "Premium User",
    plans: "Premium",
    email: "gouravpanchal80107@gmail.com",
    mobile: "9131904943",
    whtnum: "+91 9131904943",
    address: "Digi India Solution, Rohini Sector 24",
    city: "Rampura",
    state: "Bhagalpura",
    planDetail: ["Featured Business Listing", "Business Description & Contact Details", "5 Product/Service Listings", "Social Media Links", "Inquiry Form Integration",],
  };

  // Fetch user ID from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("biziffyUser");

      if (!storedUser) {
        window.location.href = "/pages/login";
        return;
      }

      const user = JSON.parse(storedUser);
      if (user?._id) {
        setUserId(user._id);
      } else {
        window.location.href = "/pages/login";
      }
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      window.location.href = "/pages/login";
    }
  }, []);

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:18001/api/auth/get-user-by-id/${userId}`);
        // console.log("req.params.id:-", res.data)
        if (res.data.status === true) {
          setProfileData(res.data.user);
        } else {
          toast.error("User data not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Something went wrong while fetching user data.");
      }
    };

    const fetchBussinessListing = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:18001/api/get-all-listings-by-user-id/${userId}`);
        // console.log("Business Listings", res?.data?.data);
        if (res?.data?.status === true) {
          setBusinessListing(res?.data?.data);
        } else {
          toast.error("Business listing not found.");
        }
      } catch (err) {
        console.error("Error fetching business listing:", err);
      }
    };

    const fetchWebsiteListing = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:18001/api/admin/get-all-website-listings-by-user-id/${userId}`);
        // console.log("Website Listings", res?.data?.data);
        if (res?.data?.status === true) {
          setWebsiteListing(res?.data?.data);
        } else {
          toast.error("Business listing not found.");
        }
      } catch (err) {
        console.error("Error fetching business listing:", err);
      }
    };

    fetchUserData();
    fetchBussinessListing();
    fetchWebsiteListing()
  }, [userId]);

  // const handleDelete = (id) => {
  //   toast.info(
  //     ({ closeToast }) => (
  //       <div>
  //         <p>Are you sure you want to delete this listing?</p>
  //         <div className="d-flex justify-content-end gap-2">
  //           <button
  //             onClick={() => {
  //               confirmDelete(id);
  //               closeToast();
  //             }}
  //             className="btn btn-sm btn-danger"
  //           >
  //             Yes
  //           </button>
  //           <button onClick={closeToast} className="btn btn-sm btn-secondary">
  //             No
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //     {
  //       position: "top-center",
  //       autoClose: false,
  //       closeOnClick: false,
  //       draggable: false,
  //       closeButton: false,
  //     }
  //   );
  // };

  // const confirmDelete = (id) => {
  //   try {
  //     const response = axios.delete(`http://localhost:18001/api/delete-business-listing/${id}`);
  //     if (response.status === true) {
  //       setListings((prev) => prev.filter((item) => item.id !== id));
  //       toast.success("Listing deleted successfully!", { position: "top-right", autoClose: 3000 });
  //     }
  //   } catch (err) {
  //     console.error("Error deleting listing:", err);
  //   }

  // };

  // Handle Logout
  const handleLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="mb-2">Are you sure you want to logout?</p>
          <div className="d-flex justify-content-end gap-2">
            <button onClick={() => { confirmLogout(); closeToast(); }} className="btn btn-sm btn-danger">Yes</button>
            <button onClick={closeToast} className="btn btn-sm btn-secondary">No</button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const confirmLogout = () => {
    localStorage.removeItem("biziffyUser");
    toast.success("Logout Successfully!", { position: "top-right", autoClose: 3000 });
    window.location.href = "/pages/login";
  };

  // Handle Save Profile Changes
  const handleSaveChanges = async () => {
    try {
      if (profileData && profileData._id) {
        const response = await axios.post(`http://localhost:18001/api/auth/update-user/${profileData._id}`, profileData);
        if (response.data.status) {
          localStorage.setItem("biziffyUser", JSON.stringify(response.data.user));
          toast.success("Profile updated successfully!");
        } else {
          toast.error("Failed to update profile.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating profile.");
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedFile || !profileData?._id) return;
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await axios.post(`http://localhost:18001/api/auth/upload-profile-image/${profileData._id}`, formData);

      if (res.data.status) {
        setIsEditing(false);
        setProfileData((prev) => ({ ...prev, image: res.data.imageUrl }));
        localStorage.setItem("biziffyUser", JSON.stringify({ ...profileData, image: res.data.imageUrl })
        );
        toast.success("Profile photo updated successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("An error occurred while uploading.");
    }
  };

  const showListing = (listing) => {
    setShowWebsiteVijiter(true)
    setWebsiteVijiter(listing?.cliCkCount?.websiteClick)
  }
  // console.log("User ID:", userId);

  // console.log("XXXXXXXXXXXXX:__--:-", profileData)
  return (
    <>
      <ToastContainer />
      <Head>
        <title>User Profile | Manage Business & Personal Info - Biziffy</title>
        <meta
          name="description"
          content="Manage your personal and business information with your Biziffy profile. Edit bio data, contact info, and business details to keep your profile updated."
        />
        <meta
          name="keywords"
          content="user profile, manage profile, edit business info, update biodata, personal details, business account, profile settings, biziffy account, update contact info, profile management, business profile, edit profile, company details, user dashboard, update email, change password, account preferences, business identity"
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="User Profile | Biziffy" />
        <meta
          property="og:description"
          content="Access your Biziffy profile to manage your business and personal information. Keep your data up-to-date for better visibility and lead generation."
        />
        <meta property="og:url" content="https://biziffy.com/profile" />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Biziffy" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="User Profile | Biziffy" />
        <meta
          name="twitter:description"
          content="Log in to your Biziffy profile and manage your personal and business info with ease."
        />
        <meta name="twitter:creator" content="@biziffy" />
      </Head>

      <section className="profile-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 p-0">
              <div className="sidebar">
                <div className="d-grid justify-content-center text-center">
                  {(previewImage || profileData.profileImage) ? (
                    <Image
                      src={previewImage || profileData.profileImage}
                      alt="Profile"
                      className="profile-img rounded-circle"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <Image
                      src="/default-profile.png" 
                      alt="Default Profile"
                      className="profile-img rounded-circle"
                      width={150}
                      height={150}
                    />
                  )}
                  {isEditing ? (
                    <>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mt-2" style={{ maxWidth: 250, margin: "0 auto" }} />
                      {selectedFile && (
                        <button className="btn btn-sm btn-success mt-2" onClick={uploadProfileImage}>
                          Save Profile Photo
                        </button>
                      )}
                    </>
                  ) : (
                    <button className="btn btn-sm btn-primary mt-2" onClick={() => setIsEditing(true)}>Change Profile Photo</button>
                  )}

                  <h3 className="text-white mt-3">{profileData?.fullName}</h3>
                  <p className="text-warning m-0">{profileData?.userType}</p>
                </div>

                {/* <div className="d-grid justify-content-center text-center">
                  {(previewImage || profileData.profileImage) ? (
                    <Image
                      src={previewImage || profileData.profileImage}
                      alt="Profile"
                      className="profile-img rounded-circle"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <div className="profile-img rounded-circle bg-secondary" style={{ width: 150, height: 150 }} />
                  )}

                  {isEditing ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control mt-2"
                        style={{ maxWidth: 250, margin: "0 auto" }}
                      />
                      {selectedFile && (
                        <button className="btn btn-sm btn-success mt-2" onClick={uploadProfileImage}>
                          Save Profile Photo
                        </button>
                      )}
                    </>
                  ) : (
                    <button className="btn btn-sm btn-primary mt-2" onClick={() => setIsEditing(true)}>
                      Change Profile Photo
                    </button>
                  )}

                  <h3 className="text-white mt-3">{profileData?.fullName}</h3>
                  <p className="text-warning m-0">{profileData?.userType}</p>
                </div> */}

                <hr className="text-white" />
                <div className="sidebar-button-main">
                  <button
                    className={`sidebar-tab ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
                    <i className="bi bi-pencil-square"></i> Dashboard
                  </button>
                  <button className={`sidebar-tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}
                  >
                    <i className="bi bi-person-circle"></i> Contact Info
                  </button>
                  <button
                    className={`sidebar-tab ${activeTab === "all-enquiry" ? "active" : ""}`} onClick={() => setActiveTab("all-enquiry")}  >
                    <i className="bi bi-info-circle"></i> All Enquiry
                  </button>

                  <button
                    className={`sidebar-tab ${activeTab === "listing" ? "active" : ""}`} onClick={() => setActiveTab("listing")}>
                    <i className="bi bi-list-task"></i> My Business Listing
                  </button>
                  <button
                    className={`sidebar-tab ${activeTab === "websitelisting" ? "active" : ""}`} onClick={() => setActiveTab("websitelisting")}>
                    <i className="bi bi-globe2"></i> My Website Listing
                  </button>
                  <button
                    className={`sidebar-tab ${activeTab === "plan" ? "active" : ""}`} onClick={() => setActiveTab("plan")}>
                    <i className="bi bi-pentagon-half"></i> My Plan
                  </button>
                  <button
                    className={`sidebar-tab ${activeTab === "support" ? "active" : ""}`} onClick={() => setActiveTab("support")} >
                    <i className="bi bi-patch-question"></i> Support
                  </button>
                  <button className="sidebar-tab" onClick={() => handleLogout()} >
                    <i className="bi bi-box-arrow-left"></i> Logout
                  </button>
                  {/* Toast container must be in your component tree */}
                  <ToastContainer />
                </div>
              </div>
            </div>
            <div className="col-md-9 py-3 fix-scroll-height">
              {activeTab === "overview" && (
                <div className="profile-overview card border-0 rounded-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="profile-overview-main avatar bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                        {profileData?.fullName?.charAt(0)}
                      </div>
                      <div>
                        <h5 className="mb-1 text-dark fw-bold">{profileData?.fullName}</h5>
                        <p className="text-muted m-0">{profileData?.email}</p>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-primary" onClick={() => setActiveTab("edit")}>
                        <i className="bi bi-pencil-square"></i> Edit Profile
                      </button>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <i className="bi bi-phone fs-4 text-primary me-3"></i>
                        <div>
                          <small className="text-muted">Mobile</small>
                          <p className="fw-semibold mb-0">{profileData?.phone}  </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <i className="bi bi-geo-alt fs-4 text-danger me-3"></i>
                        <div>
                          <small className="text-muted">Address</small>
                          <p className="fw-semibold mb-0">{profileData?.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <i className="bi bi-buildings fs-4 text-info me-3"></i>
                        <div>
                          <small className="text-muted">City</small>
                          <p className="fw-semibold mb-0">{profileData?.city}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <i className="bi bi-map fs-4 text-success me-3"></i>
                        <div>
                          <small className="text-muted">State</small>
                          <p className="fw-semibold mb-0">{profileData?.state}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "edit" && (
                <div className="profile-edit">
                  <h3>Edit Profile</h3>
                  <p>Update your profile details below:</p>
                  <hr />
                  <form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input type="text" className="form-control" onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} defaultValue={profileData.fullName} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} defaultValue={profileData.email} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Mobile</label>
                          <input type="tel" className="form-control" onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} defaultValue={profileData.phone} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Whatsapp Number</label>
                          <input type="tel" className="form-control" onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })} defaultValue={profileData.whatsappNumber} />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <input type="tel" className="form-control" onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} defaultValue={profileData.address} /></div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">City</label>
                          <input type="tel" className="form-control" onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} defaultValue={profileData.city} /></div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">State</label>
                          <input type="tel" className="form-control" onChange={(e) => setProfileData({ ...profileData, state: e.target.value })} defaultValue={profileData.state} /> </div>
                      </div>

                    </div>
                    <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
                  </form>
                </div>
              )}

              {activeTab === "all-enquiry" && (
                <>
                  <AllEnquiry />
                </>
              )}

              {activeTab === "listing" && (
                <div className="profile-plan-table">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3>My Listing</h3>
                    <div>
                      <button className="btn btn-primary" onClick={() => router?.push("/pages/freelistingform")}>
                        <i className="bi bi-pencil-square"></i> Add New Business
                      </button>
                    </div>
                  </div>
                  <hr />
                  <ToastContainer />
                  {businessListing.length > 0 ? (
                    businessListing.map((listing) => (
                      <div className="profile-listing mb-3" key={listing?._id}>
                        <div className="row listing-item">
                          <div className="col-md-3">
                            <Image src={listing?.businessCategory?.businessImages[0]} width={200} height={200} alt={listing.title} className="listing-img" />
                          </div>
                          <div className="col-md-9">
                            <h4 className="text-primary">{listing?.businessDetails?.businessName}</h4>
                            <p className="text-success">{[listing?.businessDetails?.area, listing?.businessDetails?.city, listing?.businessDetails?.state, listing?.businessDetails?.pinCode].filter(Boolean).join(", ")}</p>
                            <Link href="/pages/free-listing#paidlisting" className="login-btn me-2" >
                              Advertise Now
                            </Link>
                            <button className={`black-btn ${activeTab === "edit-business" ? "active" : ""}`} onClick={() => { setActiveTab("edit-business"), setListingId(listing) }}>
                              Edit Business
                            </button>

                            {/* <button className="btn btn-danger" onClick={() => handleDelete(listing?._id)}>
                              <i className="bi bi-trash"></i>
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-listing">
                      You have no listings. Please go to the listing page.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "websitelisting" && (
                <div className="profile-plan-table">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3>My website Listing</h3>
                    <div>
                      {showWebsiteVijiter === false ? <button className="btn btn-primary" onClick={() => router?.push("/pages/list-your-webiste")}>
                        <i className="bi bi-pencil-square"></i> Add New Website
                      </button> : <button className="btn btn-primary" onClick={() => setShowWebsiteVijiter(false)}>
                        <i className="bi bi-pencil-square"></i> Back Website Listing
                      </button>}
                    </div>
                  </div>
                  <hr />
                  <ToastContainer />
                  {showWebsiteVijiter === false ? <>{websiteListing?.length > 0 ? (
                    websiteListing?.map((listing) => (

                      <div className="profile-listing mb-3" key={listing?._id}>
                        <div className="row listing-item">
                          <div className="col-md-3">
                            <Image src={listing?.logo} alt={listing?.companyName}  width = {100} height = {100} className="listing-img" />
                          </div>
                          <div className="col-md-9">
                            <h4 className="text-primary">{listing?.companyName}</h4>
                            {/* <p className="text-success">{[listing?.area, listing?.city, listing?.state, listing?.pinCode].filter(Boolean).join(", ")}</p> */}
                            <Link href="/pages/free-listing#paidlisting" className="login-btn me-2" >
                              Advertise Now
                            </Link>
                            <button className={`black-btn ${activeTab === "edit-website" ? "active" : ""}`} onClick={() => { setActiveTab("edit-website"), setListingId(listing) }}>
                              Edit Website
                            </button>

                            <button className="btn btn-danger" onClick={() => showListing(listing)}>
                              <i className="bi bi-eye"></i> View Visitors <div style={{ color: "black" }}>{listing?.cliCkCount?.websiteClick?.count}</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-listing">
                      You have No Website Listings. Please Go To List Your Business.
                    </p>
                  )}</> : <>
                    <ShowWebsiteCout setWebsiteVijiter={setWebsiteVijiter} websiteVijiter={showsiteVijiter} />
                  </>}
                </div>
              )}

              {activeTab === "edit-business" && (
                <>
                  <EditBusinessProfile listingId={listingId} />
                </>
              )}

              {activeTab === "edit-website" && (
                <>
                  {/* <EditWebsiteProfile listingId={listingId} /> */}
                </>
              )}




              {activeTab === "plan" && (

                <div className="profile-plan-table">
                  <h3>My Plan</h3>
                  <hr />

                  <div className="d-flex justify-content-between align-items-center">
                    <h1 className="text-primary">Premium Plan</h1>
                    <h3 className="text-warning">₹2999</h3>
                  </div>
                  <div>
                    <h5>Plan Details:</h5>
                    <ul className="plan-list">
                      {userProfile.planDetail.map((item, index) => (
                        <li key={index}>
                          <i className="bi bi-check-circle text-success"></i>{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h5 className="m-0">Plan Status:</h5>
                    <p className="text-success m-0">
                      Active <i className="bi bi-check-circle"></i>
                    </p>
                  </div>
                </div>
              )}
              {activeTab === "support" && (
                <>
                  <Support />
                </>
              )}
              {activeTab === "dashboard" && (
                <>
                  <Dashboard businessListing={businessListing} />
                </>
              )}


            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
