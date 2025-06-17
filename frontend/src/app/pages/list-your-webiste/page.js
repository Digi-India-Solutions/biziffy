"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "./module.css";
import { getData, postData } from "../../services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BusinessListingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const [formData, setFormData] = useState({
    service: [],
  });

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showSubCategorySuggestions, setShowSubCategorySuggestions] = useState(false);

  const formRef1 = useRef(null);
  const formRef2 = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("biziffyUser"));
    if (user?._id) {
      setFormData(prev => ({ ...prev, userId: user?._id }));
    }
  }, []);

  useEffect(() => {
    getData("categories")
      .then(data => {
        setCategoryList(data);
        setFilteredCategories(data);
      })
      .catch(err => console.error("Category Fetch Error:", err));
  }, []);

  useEffect(() => {
    if (formData.category) {
      getData(`admin/get-Subcategories-by-category/${formData.category}`)
        .then(data => {
          setSubCategoryList(data);
          setFilteredSubCategories(data);
        })
        .catch(err => console.error("Subcategory Fetch Error:", err));
    }
  }, [formData.category]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const newService = input.trim();
      if (!formData.service.includes(newService)) {
        setFormData(prev => ({
          ...prev,
          service: [...prev.service, newService],
        }));
      }
      setInput("");
    }
  };

  const removeByIndex = (index) => {
    setFormData(prev => ({
      ...prev,
      service: prev.service.filter((_, i) => i !== index),
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const { companyName, website, shortDescription, service, logo } = formData;

    if (!companyName || companyName.length < 2)
      return toast.error("Company name must be at least 2 characters.");
    if (!website || !/^https?:\/\/.+/.test(website))
      return toast.error("Enter a valid website (http/https).");
    if (!shortDescription || shortDescription.length < 10)
      return toast.error("Short description must be at least 10 characters.");
    if (!logo)
      return toast.error("Please upload a logo.");
    if (!service.length)
      return toast.error("Please add at least one service.");

    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const { website, category, subCategory, serviceArea, companyName, shortDescription, logo, userId, service } = formData;

    if (!website.startsWith("https://")) return toast.error("Website must start with https://");
    if (!category) return toast.error("Please select a category.");
    if (!subCategory) return toast.error("Please select a sub-category.");
    if (!serviceArea) return toast.error("Please enter service area or pincode.");

    try {
      setLoading(true);

      const step1 = new FormData();
      step1.append("userId", userId);
      step1.append("companyName", companyName);
      step1.append("website", website);
      step1.append("shortDescription", shortDescription);
      service.forEach(s => step1.append("service[]", s));
      if (logo) step1.append("logo", logo);

      const res1 = await postData("admin/createListing", step1);

      if (res1?.status === true) {
        const listingId = res1.data._id;
        const step2 = new FormData();
        step2.append("listingId", listingId);
        step2.append("category", category);
        step2.append("subCategory", subCategory);
        step2.append("serviceArea", serviceArea);

        const res2 = await postData("admin/createAdditionalInformation", step2);

        if (res2?.status === true) {
          toast.success("Business listing created successfully!");
          setFormData({ service: [] });
          setStep(1);
        } else {
          toast.error(res2?.message || "Step 2 submission failed");
        }
      } else {
        toast.error(res1?.message || "Step 1 creation failed");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySearch = (text) => {
    const filtered = categoryList.filter(cat =>
      cat.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleSubCategorySearch = (text) => {
    const filtered = subCategoryList.filter(sub =>
      sub.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSubCategories(filtered);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Head>
        <title>List Your Business | Business Directory</title>
      </Head>

      <div className={`container py-3 ${styles.businessPage}`}>
        <div className="row g-5">
          {/* LEFT FORM */}
          <div className="col-lg-6">
            <div className="container py-5">
              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <span className={`nav-link ${step === 1 ? "active" : ""}`}>
                    <i className="bi bi-pencil-square me-2"></i> Business Info
                  </span>
                </li>
                <li className="nav-item">
                  <span className={`nav-link ${step === 2 ? "active" : ""}`}>
                    <i className="bi bi-check2-circle me-2"></i> Additional Info
                  </span>
                </li>
              </ul>

              {step === 1 && (
                <form onSubmit={handleNextStep}>
                  <h4 className="text-primary mb-4">Step 1: Business Information</h4>
                  <div className="mb-3">
                    <label>Company Name</label>
                    <input className="form-control" type="text" value={formData?.companyName || ""} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                  </div>

                  <div className="mb-3">
                    <label>Website</label>
                    <input className="form-control" type="url" value={formData?.website || ""} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                  </div>

                  <div className="mb-3">
                    <label>Short Description</label>
                    <input className="form-control" type="text" value={formData?.shortDescription || ""} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} />
                  </div>

                  <div className="mb-3">
                    <label>Services (Press Enter to add)</label>
                    <input className="form-control" type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {formData.service.map((s, i) => (
                        <span key={i} className="badge bg-primary">
                          {s}
                          <button type="button" className="btn-close btn-close-white ms-2" onClick={() => removeByIndex(i)}></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label>Business Logo</label>
                    <input className="form-control" type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })} />
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Please wait..." : "Continue to Next Step"}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleFinalSubmit}>
                  <h4 className="text-success mb-4">Step 2: Additional Information</h4>

                  <div className="mb-3 position-relative">
                    <label>Category</label>
                    <input
                      className="form-control"
                      type="text"
                      value={
                        (categoryList?.find(cat => cat._id === formData?.category) || {}).name || ""
                      }
                      onFocus={() => setShowCategorySuggestions(true)}
                      onChange={(e) => {
                        handleCategorySearch(e.target.value);
                        setShowCategorySuggestions(true);
                      }}
                    />
                    {showCategorySuggestions && (
                      <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filteredCategories.map((cat) => (
                          <li
                            key={cat._id}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setFormData({ ...formData, category: cat._id });
                              setShowCategorySuggestions(false);
                            }}
                          >
                           <i className="bi bi-search"></i> {cat.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mb-3 position-relative">
                    <label>Subcategory</label>
                    <input
                      className="form-control"
                      type="text"
                      value={
                        (subCategoryList?.find(sub => sub._id === formData?.subCategory) || {}).name || ""
                      }
                      onFocus={() => setShowSubCategorySuggestions(true)}
                      onChange={(e) => {
                        handleSubCategorySearch(e.target.value);
                        setShowSubCategorySuggestions(true);
                      }}
                    />
                    {showSubCategorySuggestions && (
                      <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filteredSubCategories.map((sub) => (
                          <li
                            key={sub._id}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setFormData({ ...formData, subCategory: sub._id });
                              setShowSubCategorySuggestions(false);
                            }}
                          >
                           <i className="bi bi-search"></i> {sub.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>Service Area / Pincode</label>
                    <input
                      className="form-control"
                      type="text"
                      value={formData?.serviceArea || ""}
                      onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-success" type="submit" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Listing"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="col-lg-6">
            <div className={`${styles.infoSection}`}>
              <h2 className="mb-4 text-success">Why List on Our Platform?</h2>
              {[
                { icon: "megaphone-fill", title: "Boost Your Visibility", desc: "Expose your business to a wide audience.", color: "primary" },
                { icon: "bar-chart-line-fill", title: "SEO Optimized", desc: "Improves your business’s online visibility.", color: "success" },
                { icon: "gear-fill", title: "Easy Management", desc: "Update your business details anytime.", color: "warning" },
                { icon: "shield-check", title: "Build Trust", desc: "Verified listings earn customer trust.", color: "info" },
                { icon: "geo-alt-fill", title: "Reach Local Customers", desc: "Location-based discovery.", color: "danger" }
              ].map((item, idx) => (
                <div key={idx} className={`mb-4 p-3 shadow-sm bg-white rounded ${styles.infoCard}`}>
                  <h5><i className={`bi bi-${item.icon} me-2 text-${item.color}`}></i>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListingPage;
