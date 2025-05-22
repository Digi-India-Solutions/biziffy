"use client";
import React, { useState, useEffect } from "react";
import "./EditBusinessProfile.css";
import axios from "axios";
import Image from "next/image";

const categories = [
  { id: "basic", label: "Basic Info", icon: "bi-person" },
  { id: "address", label: "Address", icon: "bi-geo-alt" },
  { id: "subcategory", label: "Category", icon: "bi-grid" },
  { id: "services", label: "Services", icon: "bi-briefcase" },
  { id: "servicearea", label: "Service Area", icon: "bi-map" },
  { id: "url", label: "Business URL", icon: "bi-link-45deg" },
  { id: "img", label: "Business Image", icon: "bi-card-image" },
  { id: "faq", label: "FAQ", icon: "bi-question-circle" },
];

export default function EditBusinessProfile({ listingId }) {
  // ====== Api Data ========
  // const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  // const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [oldImage, setOldImage] = useState([]);
  const [serviceAreaInput, setServiceAreaInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const [formData, setFormData] = useState({
    businessname: "", businessCategory: "", businessSubCategory: [], services: [], businessArea: [], Building: "",
    Street: "", Area: "", Landmark: "", city: "", state: "", pincode: "", phone: "", about: "", image: null,
    images: [], email: "", experience: "", whatsapp: "", websiteURL: "", googlemap: "", facebook: "", instagram: "",
    twitter: "", linkedin: "", faq: [{ question: "", answer: "" }],yib:'',
  });

  console.log("XXXXXXXXXXXXXlistingId:-", listingId);


  // ----- Images ------------

  useEffect(() => {
    if (listingId) {
      setFormData({
        // Contact Person Info
        title: listingId.contactPerson?.title || "", firstName: listingId.contactPerson?.firstName || "",
        lastName: listingId.contactPerson?.lastName || "", phone: listingId.contactPerson?.contactNumber || "",
        whatsapp: listingId.contactPerson?.whatsappNumber || "", email: listingId.contactPerson?.email || "",
        // Business Details
        businessname: listingId.businessDetails?.businessName || "", Building: listingId.businessDetails?.building || "",
        Street: listingId.businessDetails?.street || "", Area: listingId.businessDetails?.area || "",
        Landmark: listingId.businessDetails?.landmark || "", city: listingId.businessDetails?.city || "",
        state: listingId.businessDetails?.state || "", pincode: listingId.businessDetails?.pinCode || "",
        yib: listingId.businessDetails?.yib || "",
        // Business Category & Subcategory
        businessCategory: listingId.businessCategory?.category._id || "", businessSubCategory: listingId.businessCategory?.subCategory.map((item) => item._id) || [],
        // Images
        images: listingId.businessCategory?.businessImages || [],

        // About & Keywords
        about: listingId.businessCategory?.about || "", keywords: listingId.businessCategory?.keywords || [],
        // Services & Area
        services: listingId.businessCategory?.keywords || [], businessArea: listingId.businessCategory?.serviceArea || [],
        // Social & Web Links
        websiteURL: listingId.upgradeListing?.website || "", googlemap: listingId.upgradeListing?.direction || "",
        facebook: listingId.upgradeListing?.facebook || "", instagram: listingId.upgradeListing?.instagram || "",
        twitter: listingId.upgradeListing?.twitter || "", linkedin: listingId.upgradeListing?.linkedin || "",
        // Experience (if applicable)
        experience: listingId.experience || "", image: null,
        faq: listingId?.faq?.map((item) => ({ question: item?.question, answer: item?.answer }))
      });
    }
    setOldImage(listingId?.businessCategory?.businessImages || [],)

  }, [listingId]);



  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "images") {
      setFormData({ ...formData, images: [...formData.images, ...Array.from(files)], });
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  // ===========================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    // Contact Person
    form.append("contactPerson[userId]", listingId?.contactPerson?.userId);
    form.append("contactPerson[title]", formData?.title);
    form.append("contactPerson[firstName]", formData?.firstName);
    form.append("contactPerson[lastName]", formData?.lastName);
    form.append("contactPerson[contactNumber]", formData?.phone);
    form.append("contactPerson[whatsappNumber]", formData?.whatsapp);
    form.append("contactPerson[email]", formData?.email);

    // Business Details
    form.append("businessDetails[businessName]", formData?.businessname);
    form.append("businessDetails[building]", formData?.Building);
    form.append("businessDetails[street]", formData?.Street);
    form.append("businessDetails[area]", formData?.Area);
    form.append("businessDetails[landmark]", formData?.Landmark);
    form.append("businessDetails[city]", formData?.city);
    form.append("businessDetails[state]", formData?.state);
    form.append("businessDetails[pinCode]", formData?.pincode);
    form.append("businessDetails[yib]", formData?.yib);

    // Business Category
    form.append("businessCategory[category]", formData?.businessCategory);

    (formData?.businessSubCategory || []).forEach((id, index) => {
      form.append(`businessCategory[subCategory][${index}]`, id);
    });

    (formData?.keywords || []).forEach((keyword, index) => {
      form.append(`businessCategory[keywords][${index}]`, keyword);
    });

    (formData?.services || []).forEach((service, index) => {
      form.append(`businessCategory[businessService][${index}]`, service);
    });

    (formData?.businessArea || []).forEach((area, index) => {
      form.append(`businessCategory[serviceArea][${index}]`, area);
    });

    if (formData?.faq) {
      form.append(`faq`, JSON.stringify(formData?.faq));
    }
    form.append("businessCategory[about]", formData?.about);

    // Business Images
    (formData?.images || []).forEach((img, index) => {
      if (typeof img === "string") {
        form.append("businessImages", img);
      } else if (img instanceof File) {
        form.append("businessImages", img);
      }
    });

    // Upgrade Listing
    form.append("upgradeListing[direction]", formData?.googlemap);
    form.append("upgradeListing[website]", formData?.websiteURL);
    form.append("upgradeListing[facebook]", formData?.facebook);
    form.append("upgradeListing[instagram]", formData?.instagram);
    form.append("upgradeListing[linkedin]", formData?.linkedin);
    form.append("upgradeListing[twitter]", formData?.twitter);

    try {
      const response = await axios.post(`http://localhost:18001/api/update-listings-by-id/${listingId?._id}`, form);
      console.log("response:-", response)
      if (response)
        alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleFAQChange = (e, index, field) => {
    const updatedFaq = [...formData.faq];
    updatedFaq[index][field] = e.target.value;
    setFormData({ ...formData, faq: updatedFaq });
  };

  // To add a new FAQ entry
  const handleAddFAQ = () => {
    setFormData({ ...formData, faq: [...formData?.faq, { question: "", answer: "" }] });
  };

  // To remove a specific FAQ entry
  const handleRemoveFAQ = (index) => {
    const updatedFaq = formData.faq.filter((_, i) => i !== index);
    setFormData({ ...formData, faq: updatedFaq });
  };


  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:18001/api/categories");
        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (formData.businessCategory) {
      const fetchSubCategory = async () => {
        try {
          console.log("CCCCCCCCCCCCC", formData.businessCategory)
          const response = await axios.get(`http://localhost:18001/api/admin/get-Subcategories-by-category/${formData.businessCategory}`);
          setSubCategoryList(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategory();
    } else {
      setSubCategoryList([]);
    }
  }, [formData.businessCategory]);

  const handleSubCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, businessSubCategory: values }));
  };

  const removeItem = (itemToRemove) => {
    setFormData((prev) => ({ ...prev, businessSubCategory: prev.businessSubCategory.filter((item) => item !== itemToRemove), }));
  };

  const handleServiceKeyDown = (e) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      const trimmed = serviceInput.trim();
      if (!formData.services.includes(trimmed)) {
        setFormData({
          ...formData,
          services: [...formData.services, trimmed],
        });
      }
      setServiceInput("");
    }
  };

  const removeService = (indexToRemove) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== indexToRemove),
    });
  };

  // useEffect(() => {
  //   const fetchAreas = async () => {
  //     try {
  //       const res = await axios.get("https://6800d7ffb72e9cfaf728eac6.mockapi.io/areapincode");
  //       const areaList = res.data.map((user) => `${user.area} ${user.pincode}`);
  //       setAreas(areaList);
  //     } catch (error) {
  //       console.error("Error fetching areas:", error);
  //     }
  //   };
  //   fetchAreas();
  // }, []);



 useEffect(() => {
     const fetchAreas = async () => {
       try {
         const res = await axios.get(`http://localhost:18001/api/pincode/get-areapincode-by-state`, {
           params: { state: formData?.state }
         });
         console.log("DADAhhh", res?.data)
         const areaList = res.data.map((user) => `${user.area} ${user.pinCode}`);
         setAreas(areaList);
       } catch (error) {
         console.error("Error fetching areas:", error);
       }
     };
     fetchAreas();
   }, [formData.state]);

  const filteredAreas = areas.filter(
    (area) =>
      area.toLowerCase().includes(serviceAreaInput.toLowerCase()) &&
      !formData.businessArea.includes(area)
  );

  const handleSelectArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      businessArea: [...prev.businessArea, area],
    }));
    setServiceAreaInput("");
  };

  const removeAreaItem = (value) => {
    setFormData((prev) => ({
      ...prev,
      businessArea: prev.businessArea.filter((a) => a !== value),
    }));
  };


  console.log("FORMDATA:___---:-", formData);

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Business Name</label>
                  <input type="text" name="businessname" value={formData?.businessname} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Whatsapp No.</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Years In Business</label>
                  <input type="text" name="yib" value={formData.yib} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>{" "}
          </form>
        );

      case "address":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Building/Block No</label>
                  <input type="text" name="Building" value={formData.Building} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Street/Colony Name</label>
                  <input type="text" name="Street" value={formData.Street} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Area</label>
                  <input type="text" name="Area" value={formData.Area} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Landmark</label>
                  <input type="text" name="Landmark" value={formData.Landmark} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-3">
                <div className="edit-profile-field">
                  <label>Pin Code</label>
                  <input type="tel" name="pincode" value={formData.pincode} onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>{" "}
          </form>
        );

      case "url":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Website URL</label>
                  <input type="url" name="websiteURL" value={formData.websiteURL} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Google Map URL</label>
                  <input type="url" name="googlemap" value={formData.googlemap} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Facebook</label>
                  <input type="url" name="facebook" onChange={handleChange} value={formData.facebook} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Instagram</label>
                  <input type="url" name="instagram" onChange={handleChange} value={formData.instagram} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>Twitter</label>
                  <input type="url" name="twitter" onChange={handleChange} value={formData.twitter} />
                </div>
              </div>
              <div className="col-md-4">
                <div className="edit-profile-field">
                  <label>LinkedIn</label>
                  <input type="url" name="linkedin" onChange={handleChange} value={formData.linkedin} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3 mx-3">
              Save Changes
            </button>
            <button className="btn btn-outline-secondary mt-3" onClick={() => setActiveTab("")}            >
              Cancel
            </button>
          </form>
        );

      case "subcategory":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Business Category */}
              <div className="col-md-12 mb-6">
                <label className="form-label">
                  Business Category <sup>*</sup>
                </label>
                <select
                  className="form-control"
                  required
                  value={formData?.businessCategory || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, businessCategory: e.target.value, businessSubCategory: [] })
                  }
                >
                  <option value="">Select Your Category</option>
                  {categoryList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div className="col-md-12 mb-6">
                <label className="form-label">
                  Add More SubCategory <sup>*</sup>
                </label>
                <select
                  className="form-control"
                  // multiple
                  required
                  value={formData.businessSubCategory || []}
                  onChange={handleSubCategoryChange}
                >
                  {subCategoryList.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                {/* Selected badges */}
                <div className="mt-2">
                  {(formData.businessSubCategory || []).map((catId) => {
                    const sub = subCategoryList.find((s) => s._id === catId);
                    return (
                      <span key={catId._id} className="badge bg-primary me-2 mb-2 p-2">
                        {sub?.name || catId?.name}
                        <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeItem(catId)} aria-label="Remove" />
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "services":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-start">
              <div className="edit-profile-field">
                <label>Add Services</label>
                <input
                  type="text"
                  value={serviceInput}
                  className="form-control"
                  onChange={(e) => setServiceInput(e.target.value)}
                  onKeyDown={handleServiceKeyDown}
                  placeholder="Type a service and press Enter"
                />

                {/* Render Services as Badges */}
                <div className="mt-3 d-flex flex-wrap">
                  {formData.services.map((srv, index) => (
                    <span key={index} className="badge bg-dark me-2 mb-2 p-2">
                      {srv}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        onClick={() => removeService(index)}
                        aria-label="Remove"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary m-0"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "servicearea":
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <label className="form-label">Services Area/Pincode <sup>*</sup></label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Area or Pincode"
                value={serviceAreaInput}
                onChange={(e) => setServiceAreaInput(e.target.value)}
              />
              {serviceAreaInput && filteredAreas.length > 0 && (
                <ul className="list-group position-absolute z-3 w-100">
                  {filteredAreas.map((area) => (
                    <li
                      key={area}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSelectArea(area)}
                      style={{ cursor: "pointer" }}
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                {formData.businessArea.map((serArea) => (
                  <span key={serArea} className="badge bg-primary m-1 p-2">
                    {serArea}
                    <button
                      type="button"
                      className="btn-close ms-2 bg-danger"
                      onClick={() => removeAreaItem(serArea)}
                      aria-label="Remove"
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("")}
              >
                Cancel
              </button>
            </div>
          </form>
        );

      case "img":
        return (
          <form onSubmit={handleSubmit}>
            <div className="row align-items-start">
              {/* Main Image */}
              {/* <div className="col-md-6">
                <div className="edit-profile-field mb-4">
                  <label>Main Image</label>
                  <div
                    className="border p-2 rounded bg-light position-relative"
                    style={{ minHeight: "180px" }}
                  >
                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {formData.image && (
                      <div className="mt-3">
                        <img
                          src={
                            typeof formData.image === "string"
                              ? formData.image
                              : formData.image instanceof File
                                ? URL.createObjectURL(formData.image)
                                : ""
                          }
                          alt="Main"
                          className="img-thumbnail"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div> */}

              {/* Multiple Images */}
              <div className="col-md-12">
                <div className="edit-profile-field mb-4">
                  <label>Upload Multiple Images</label>
                  <div
                    className="border p-2 rounded bg-light"
                    style={{ minHeight: "180px" }}
                  >
                    <input
                      type="file"
                      name="images"
                      multiple
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    <div className="d-flex flex-wrap gap-3 mt-3">
                      {formData.images?.map((img, index) => {
                        const imgUrl =
                          typeof img === "string"
                            ? img
                            : img instanceof File
                              ? URL.createObjectURL(img)
                              : "";

                        return (
                          <div
                            key={index}
                            className="position-relative"
                            style={{ width: "110px", height: "110px" }}
                          >
                            {imgUrl && (
                              <img
                                src={imgUrl}
                                alt={`img-${index}`}
                                className="img-thumbnail"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", }} />
                            )}
                            <button type="button" className="btn-close position-absolute top-0 end-0 bg-light text-dark p-1 rounded-circle" onClick={() => handleRemoveImage(index)} style={{ transform: "scale(0.8)" }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-3">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline-secondary m-0" onClick={() => setActiveTab("")}>Cancel </button>
            </div>
          </form>
        );

      case "faq":
        return (
          <form onSubmit={handleSubmit}>
            {formData?.faq?.map((faq, index) => (
              <div className="row align-items-center mb-3" key={index}>
                <div className="col-md-4">
                  <div className="edit-profile-field">
                    <label>Question</label>
                    <input type="text" name="question" value={faq.question} onChange={(e) => handleFAQChange(e, index, "question")} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="edit-profile-field">
                    <label>Answer</label>
                    <input type="text" name="answer" value={faq.answer} onChange={(e) => handleFAQChange(e, index, "answer")} className="form-control" required />
                  </div>
                </div>
                {index !== 0 && (
                  <div className="col-md-3 mt-4">
                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveFAQ(index)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="mb-3">
              <button type="button" className="btn btn-secondary" onClick={handleAddFAQ}>
                Add More
              </button>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                Save Changes
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab("")}>
                Cancel
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2 className="edit-profile-title">Edit Business Profile</h2>
      <hr />
      <div className="row text-center">
        {categories.map((cat) => (
          <div key={cat.id} className="col-md-2 col-sm-3 col-6 mb-2" onClick={() => setActiveTab(cat.id)}          >
            <div className={`edit-icon-card ${activeTab === cat.id ? "active" : ""}`}  >
              <i className={`bi ${cat.icon} fs-4`}></i>
            </div>
            <p className="mt-2">{cat.label}</p>
          </div>
        ))}
      </div>
      <div className="card p-4">{renderTabContent()}</div>
    </div>
  );
}
