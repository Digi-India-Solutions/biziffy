"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "./module.css"; // Make sure your CSS file is correctly named
import axios from "axios";

const BusinessListingPage = () => {
  const [step, setStep] = useState(1);
  const [validated, setValidated] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [formData, setFormData] = useState({ service: [] });
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("");
  const formRef1 = useRef(null);
  const formRef2 = useRef(null);


  useEffect(() => {
    const data = localStorage.getItem("biziffyUser");
    const data2 = JSON.parse(data);
    setFormData(prev => ({
      ...prev,
      userId: data2?._id || ""
    }));
    // console.log("formData:-data", data2?._id);
  }, []); 
  
  const handleNext = async (e) => {
    e.preventDefault();
    setLoading(true)
    // if (formRef1.current.checkValidity()) {
    const form = new FormData();
    // alert("hhkj")
    form.append("userId", formData?.userId);
    form.append("companyName", formData?.companyName);
    form.append("website", formData?.website);
    form.append("shortDescription", formData?.shortDescription);
    // form.append("aboutBusiness", formData?.aboutBusiness);
    // form.append("area", formData?.area);
    formData?.service?.forEach(service => {
      form?.append("service[]", service);
    });

    if (formData?.logo) {
      const logoFile = formData?.logo;
      form.append("logo", logoFile);
    }

    const res = await axios.post('https://api.biziffy.com/api/admin/createListing', form);
    // console.log("res:-", res.data.data);
    if (res?.data.status === true) {
      setLoading(false)
      setValidated(false);
      setFormData({ ...formData, listingId: res?.data?.data?._id });
      setStep(2);
    }
    // } else {
    //   setValidated(true);
    // }
    setLoading(false)
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    // if (formRef2.current.checkValidity()) {
    setLoading(true)
    const form = new FormData();
    // Basic fields
    form.append("listingId", formData.listingId);
    form.append("category", formData.category);
    form.append("subCategory", formData.subCategory);
    form.append("serviceArea", formData.serviceArea);

    // Handle multiple businessPhotos
    if (formData.businessPhotos && Object.keys(formData.businessPhotos).length > 0) {
      Object.values(formData.businessPhotos).forEach((file) => {
        form.append("businessPhotos[]", file);
      });
    }
    const res = await axios.post('https://api.biziffy.com/api/admin/createAdditionalInformation', form);
    // console.log("res:-", res.data);
    if (res?.data?.status === true) {
      setLoading(false)
      setValidated(false);
      alert("Listing Submitted Successfully!");
      // console.log("Final Form Data:", formData);
      setStep(1);
      setFormData({});
    }

    setLoading(false)

    // } else {
    //   setValidated(true);
    // }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();

      const newService = input.trim();
      if (!formData.service.includes(newService)) {
        setFormData((prev) => ({
          ...prev,
          service: [...prev.service, newService],
        }));
      }
      setInput("");
    }
  };

  const removeByIndex = (index) => {
    const updated = formData.service.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, service: updated }));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.biziffy.com/api/categories");
        setCategoryList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (formData?.category) {
      const fetchSubCategory = async () => {
        try {
          const response = await axios.get(`https://api.biziffy.com/api/admin/get-Subcategories-by-category/${formData?.category}`);
          setSubCategoryList(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategory();
    }
  }, [formData?.category]);


  // console.log("FormData:", formData);
  return (
    <>
      <Head>
        <title>List Your Business | Business Directory</title>
      </Head>

      <div className={`container py-3 ${styles.businessPage}`}>
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="container py-5">
              {/* Step Indicators */}
              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <span className={`nav-link ${step === 1 ? "active" : ""}`}>
                    <i className="bi bi-pencil-square me-2"></i> Business Info
                  </span>
                </li>
                <li className="nav-item">
                  <span className={`nav-link ${step === 2 ? "active" : ""}`}>
                    <i className="bi bi-check2-circle me-2"></i> Additional Information
                  </span>
                </li>
              </ul>

              {/* Step 1 Form */}
              <div className="tab-content bg-white p-4 shadow rounded">
                {step === 1 && (
                  <form
                    ref={formRef1}
                    noValidate
                    className={validated ? "was-validated" : ""}
                  >
                    <h4 className="text-primary mb-4">Step 1: Business Information</h4>

                    {/* Company Name */}
                    <div className="mb-3">
                      <label className="form-label">Company Name</label>
                      <input type="text" className="form-control" required minLength={2} placeholder="Enter your company / business name..." onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                      <div className="invalid-feedback">
                        Company name is required (min 2 characters).
                      </div>
                    </div>

                    {/* Website */}
                    <div className="mb-3">
                      <label className="form-label">Website URL</label>
                      <input type="url" className="form-control" pattern="https?://.+" placeholder="Enter your website URL" onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                      <div className="invalid-feedback">
                        Enter a valid URL (starting with http:// or https://).
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="mb-3">
                      <label className="form-label">Short Description</label>
                      <input type="text" className="form-control" required minLength={10} placeholder="e.g. We are a leading manufacturer..." onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} />
                      <div className="invalid-feedback">
                        At least 10 characters required.
                      </div>
                    </div>

                    {/* About Business */}
                    {/* <div className="mb-3">
                      <label className="form-label">About Your Business</label>
                      <textarea className="form-control" rows="4" required minLength={30} placeholder="Describe your business..." onChange={(e) => setFormData({ ...formData, aboutBusiness: e.target.value })}></textarea>
                      <div className="invalid-feedback">
                        Please write at least 30 characters.
                      </div>
                    </div> */}

                    {/* Services */}
                    <div className="mb-3">
                      <label className="form-label">Business Services (press Enter to add)</label>
                      <input type="text" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Sofa Sales, Repairs" />
                      <div className="mt-2">
                        {formData?.service?.map((service, index) => (
                          <span key={index} className="badge bg-primary m-1 p-2">
                            {service}
                            <button type="button" className="btn-close ms-2 bg-danger" onClick={() => removeByIndex(index)} aria-label="Remove" />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Area */}
                    {/* <div className="mb-3">
                      <label className="form-label">Area / Location</label>
                      <input type="text" className="form-control" required minLength={3} placeholder="e.g. Andheri East, Mumbai" onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                      <div className="invalid-feedback">Area or pincode is required.</div>
                    </div> */}

                    {/* Logo */}
                    <div className="mb-4">
                      <label className="form-label">Business Logo</label>
                      <input type="file" className="form-control" accept=".png,.jpg,.jpeg" required onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })} />
                      <div className="invalid-feedback">Please upload a logo.</div>
                    </div>

                    <button onClick={handleNext} className="btn btn-primary">
                      {loading ? "Please Wait..." : "Continue to Next Step"}
                    </button>
                  </form>
                )}

                {/* Step 2 Form */}
                {step === 2 && (
                  <form ref={formRef2} noValidate className={validated ? "was-validated" : ""} onSubmit={handleFinalSubmit}>
                    <h4 className="text-success mb-4">Step 2: Additional Information</h4>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Business Category</label>
                      <select
                        className="form-select"
                        required
                        value={formData.category || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="">Select a category</option>
                        {categoryList.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="invalid-feedback">
                        Please select a business category.
                      </div>
                    </div>

                    {/* Sub Category */}
                    <div className="mb-3">
                      <label className="form-label">Sub Category</label>
                      <select
                        className="form-select"
                        required
                        value={formData.subCategory || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, subCategory: e.target.value })
                        }
                      >
                        <option value="">Select a subcategory</option>
                        {subCategoryList.map((cat) => (
                          <option key={cat._id} value={cat._id} >
                            {cat?.name}
                          </option>
                        ))}
                      </select>
                      <div className="invalid-feedback">
                        Please select a subcategory.
                      </div>
                    </div>

                    {/* Service Area */}
                    <div className="mb-3">
                      <label className="form-label">Service Area / Pincode</label>
                      <input type="text" className="form-control" required placeholder="e.g. 400059" value={formData?.serviceArea || ""} onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })} />
                      <div className="invalid-feedback">
                        Service area or pincode is required.
                      </div>
                    </div>

                    {/* Photos */}
                    {/* <div className="mb-4">
                      <label className="form-label">Upload Business Photos</label>
                      <input type="file" className="form-control" multiple accept=".jpg,.jpeg,.png" onChange={(e) => setFormData({ ...formData, businessPhotos: e.target.files })} />
                      <small className="form-text text-muted">
                        You can upload multiple photos of your business.
                      </small>
                    </div> */}

                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setStep(1)}
                      >
                        ← Back
                      </button>
                      <button type="submit" className="btn btn-success">
                        {loading ? "please wait..." : "Submit Listing"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right Info Section */}
          <div className="col-lg-6">
            <div className={`${styles.infoSection}`}>
              <h2 className="mb-4 text-success">Why List on Our Platform?</h2>
              <div className={`mb-4 p-3 shadow-sm rounded bg-white ${styles.infoCard}`}>
                <h5><i className="bi bi-megaphone-fill me-2 text-primary"></i> Boost Your Visibility</h5>
                <p>Expose your business to a wide audience actively searching for services like yours through our categorized directory.</p>
              </div>
              <div className={`mb-4 p-3 shadow-sm rounded bg-white ${styles.infoCard}`}>
                <h5><i className="bi bi-bar-chart-line-fill me-2 text-success"></i> SEO Optimized Listings</h5>
                <p>Each listing is built for search engines, improving your business ranking on Google and other platforms.</p>
              </div>
              <div className={`mb-4 p-3 shadow-sm rounded bg-white ${styles.infoCard}`}>
                <h5><i className="bi bi-gear-fill me-2 text-warning"></i> Easy Management</h5>
                <p>Quickly update your business information, services, and media through a simple dashboard.</p>
              </div>
              <div className={`mb-4 p-3 shadow-sm rounded bg-white ${styles.infoCard}`}>
                <h5><i className="bi bi-shield-check me-2 text-info"></i> Build Trust</h5>
                <p>Verified listings with a logo, contact info, and service description help gain customer trust instantly.</p>
              </div>
              <div className={`mb-4 p-3 shadow-sm rounded bg-white ${styles.infoCard}`}>
                <h5><i className="bi bi-geo-alt-fill me-2 text-danger"></i> Reach Local Customers</h5>
                <p>Your listing is shown based on area, making it easy for local users to discover and contact you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessListingPage;
