"use client";
import React, { useState, useEffect } from "react";
import "./EditWebsiteProfile.css";
import { getData, postData } from "../../../services/FetchNodeServices";

const categories = [
    { id: "basic", label: "Basic Info", icon: "bi-person" },
    { id: "subcategory", label: "Category", icon: "bi-grid" },
    { id: "services", label: "Services", icon: "bi-briefcase" },
    { id: "servicearea", label: "Service Area", icon: "bi-map" },
    { id: "img", label: "Website Logo", icon: "bi-card-image" },
];

export default function EditWebsiteProfile({ listingId }) {
    // ====== Api Data ========
    const [serviceInput, setServiceInput] = useState("");
    const [oldImage, setOldImage] = useState([]);
    const [serviceAreaInput, setServiceAreaInput] = useState("");
    const [areas, setAreas] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState({
        companyName: "", category: "", subCategory: [], website: "", userId: '', logo: '', service: [], serviceArea: [], shortDescription: ''
    });
    useEffect(() => {
        if (listingId) {
            setFormData({
                companyName: listingId.companyName || "",
                website: listingId?.website || "",
                shortDescription: listingId?.shortDescription || "",
                category: listingId?.category?._id || "",
                subCategory: listingId?.subCategory?._id || listingId?.subCategory?.map((item) => item._id),
                logo: listingId?.logo || '',
                service: listingId?.service || [],
                serviceArea: listingId?.serviceArea || [],
            });
        }
        setOldImage(listingId?.logo || '',)

    }, [listingId]);

    console.log("listingId:=>", listingId)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
        }
    };

    // Remove logo
    const handleRemoveImage = () => {
        setFormData({ ...formData, logo: "" });
    };

    // ===========================

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    console.log("XXXXXXXXXXXXXlistingId:-", formData);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        // Contact Person / Basic Fields
        form.append("userId", listingId?.userId);
        form.append("companyName", formData?.companyName);
        form.append("website", formData?.website);
        form.append("shortDescription", formData?.shortDescription);
        form.append("category", formData?.category);
        form.append("subCategory", formData?.subCategory);
        form.append("serviceArea", formData?.serviceArea);
        // Services
        (formData?.service || []).forEach((service, index) => {
            form.append(`service[${index}]`, service);
        });
        // Logo (string or File)
        if (formData?.logo) {
            if (typeof formData.logo === "string") {
                form.append("logo", formData.logo);
            } else if (formData.logo instanceof File) {
                form.append("logo", formData.logo);
            }
        }

        try {
            const response = await postData(`admin/update-website-listings-by-id/${listingId?._id}`, form);
            console.log("response:", response);
            if (response) alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getData("categories");
                setCategoryList(response);
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
                    console.log("CCCCCCCCCCCCC", formData?.category)
                    const response = await getData(`admin/get-Subcategories-by-category/${formData?.category}`);
                    setSubCategoryList(response);
                } catch (error) {
                    console.error("Error fetching subcategories:", error);
                }
            };
            fetchSubCategory();
        } else {
            setSubCategoryList([]);
        }
    }, [formData?.category]);

    // const handleSubCategoryChange = (e) => {
    //     const values = Array.from(e.target.selectedOptions, (o) => o.value);
    //     setFormData((prev) => ({ ...prev, subCategory: values }));
    // };

    const handleSubCategoryChange = (e) => {
        setFormData((prev) => ({ ...prev, subCategory: e.target.value }));
    };

    // const removeItem = (itemToRemove) => {
    //     setFormData((prev) => ({ ...prev, subCategory: prev.subCategory.filter((item) => item !== itemToRemove), }));
    // };

    const handleServiceKeyDown = (e) => {
        if (e.key === "Enter" && serviceInput.trim()) {
            e.preventDefault();
            const trimmed = serviceInput.trim();
            if (!formData.service.includes(trimmed)) {
                setFormData({
                    ...formData,
                    service: [...formData.service, trimmed],
                });
            }
            setServiceInput("");
        }
    };

    const removeService = (indexToRemove) => {
        setFormData({
            ...formData,
            service: formData.service.filter((_, i) => i !== indexToRemove),
        });
    };


    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await getData(`pincode/get-areapincode-by-state`, {
                    params: { state: formData?.state }
                });
                console.log("DADAhhh", res)
                const areaList = res?.map((user) => `${user?.area} ${user?.pinCode}`);
                setAreas(areaList);
            } catch (error) {
                console.error("Error fetching areas:", error);
            }
        };
        fetchAreas();
    }, [formData?.state]);

    const filteredAreas = areas?.filter(
        (area) =>
            area.toLowerCase()?.includes(serviceAreaInput.toLowerCase()) &&
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
                                    <label>Company Name</label>
                                    <input type="text" name="companyName" value={formData?.companyName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="edit-profile-field">
                                    <label>Web Site</label>
                                    <input type="text" name="website" value={formData?.website} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="edit-profile-field">
                                    <label>short Description</label>
                                    <input type="text" name="shortDescription" value={formData?.shortDescription} onChange={handleChange} />
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
                                    Company Category <sup>*</sup>
                                </label>
                                <select
                                    className="form-control"
                                    required
                                    value={formData?.category || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value, subCategory: [] })
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
                            {/* <div className="col-md-12 mb-6">
                                <label className="form-label">
                                    Add More SubCategory <sup>*</sup>
                                </label>
                                <select
                                    className="form-control"
                                    // multiple
                                    required
                                    value={formData.subCategory || []}
                                    onChange={handleSubCategoryChange}
                                >
                                    {subCategoryList.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>

                                <div className="mt-2">
                                    {(formData.subCategory || []).map((catId) => {
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
                        </div> */}
                            <div className="col-md-12 mb-6">
                                <label className="form-label">
                                    Add More SubCategory <sup>*</sup>
                                </label>
                                <select
                                    className="form-control"
                                    required
                                    value={formData.subCategory || ""}
                                    onChange={handleSubCategoryChange}
                                >
                                    <option value="" disabled>Select SubCategory</option>
                                    {subCategoryList.map((sub) => (
                                        <option key={sub._id} value={sub._id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Show selected subcategory name with remove option */}
                                {/* {formData.subCategory && (
                                    <div className="mt-2">
                                        {(() => {
                                            const sub = subCategoryList.find((s) => s._id === formData?.subCategory);
                                            return sub ? (
                                                <span className="badge bg-primary me-2 mb-2 p-2">
                                                    {sub.name}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white ms-2"
                                                        style={{ fontSize: "0.6rem" }}
                                                        onClick={() => removeItem(sub._id)}
                                                        aria-label="Remove"
                                                    />
                                                </span>
                                            ) : null;
                                        })()}
                                    </div>
                                )} */}
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
                                    {formData?.service?.map((srv, index) => (
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
                            <label className="form-label">
                                Services Area/Pincode <sup>*</sup>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Area or Pincode"
                                value={formData?.serviceArea}
                                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })} //setFormData(e.target.value)}
                            />
                        </div>

                        <div className="d-flex gap-3 mt-3">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setActiveTab("")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                );

            case "img":
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row align-items-start">
                            {/* Single Logo Upload */}
                            <div className="col-md-12">
                                <div className="edit-profile-field mb-4">
                                    <label>Upload Logo</label>
                                    <div className="border p-2 rounded bg-light" style={{ minHeight: "180px" }}>
                                        <input
                                            type="file"
                                            name="logo"
                                            accept="image/*"
                                            className="form-control"
                                            onChange={handleFileChange}
                                        />

                                        {formData?.logo && (
                                            <div className="position-relative mt-3" style={{ width: "120px", height: "120px" }}>
                                                <img
                                                    src={
                                                        typeof formData.logo === "string"
                                                            ? formData.logo
                                                            : URL.createObjectURL(formData.logo)
                                                    }
                                                    alt="Uploaded Logo"
                                                    className="img-thumbnail"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-close position-absolute top-0 end-0 bg-light text-dark p-1 rounded-circle"
                                                    onClick={handleRemoveImage}
                                                    style={{ transform: "scale(0.8)" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-3">
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                            <button type="button" className="btn btn-outline-secondary m-0" onClick={() => setActiveTab("")}>
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
