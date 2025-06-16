"use client";
import React, { useState, useEffect } from "react";
import "../../pages/freelistingform/freelistingform.css";
import { getData, postData } from "../../services/FetchNodeServices";

const BusinessCategory = ({ setKey, formData, setFormData }) => {
  const [category, setCategory] = useState(formData?.businessCategory?.category || "");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subCategory, setSubCategory] = useState(
    formData?.businessCategory?.subCategory || []
  );
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);


  const [businessImages, setBusinessImages] = useState(formData?.businessCategory?.businessImages || []);
  const [about, setAbout] = useState(formData?.businessCategory?.about || "");
  const [keywords, setKeywords] = useState(formData?.businessCategory?.keywords || []);
  const [input, setInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [serviceArea, setServiceArea] = useState(formData?.businessCategory?.serviceArea || []);
  const [serviceAreainput, setServiceAreaInput] = useState("");
  const [bImage, setBImage] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  console.log("DADADADADADADADADA:= ", formData?.businessDetails?.state)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await postData(`pincode/get-areapincode-by-state`, { state: formData?.businessDetails?.state });
        console.log("DADAhhh", res)

        const areaList = res?.map((user) => `${user?.area} ${user?.pinCode}`);
        setAreas(areaList);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, [formData?.businessDetails?.state]);

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
    if (category) {
      const fetchSubCategory = async () => {
        try {
          const response = await getData(`admin/get-Subcategories-by-category/${category}`);
          setSubCategoryList(response);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategory();
    }
  }, [category]);

  const handleSubCategorySelect = (selectedId) => {
    if (!subCategory.includes(selectedId)) {
      const updated = [...subCategory, selectedId];
      setSubCategory(updated);
      setFormData((prev) => ({
        ...prev,
        businessCategory: {
          ...prev.businessCategory,
          subCategory: updated,
        },
      }));
    }
    setSubcategorySearch("");
    setShowSuggestions(false);
  };


  const handleImageChange = (e) => {
    const imageUrls = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setBusinessImages((prev) => [...prev, ...imageUrls]);

    const files = Array.from(e.target.files);
    setBImage({ ...bImage, bImage: files });
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!keywords.includes(input.trim())) {
        setKeywords([...keywords, input.trim()]);
      }
      setInput("");
    }
  };
  console.log("BusinessCategory", {
    category,
    subCategory,
    businessImages: bImage,
    about,
    keywords,
    businessService: input,
    serviceArea
  })
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !subCategory) {
      alert("Please select a subCategory.");
      return;
    }
    const updatedBusinessCategory = {
      category,
      subCategory,
      businessImages: bImage,
      about,
      keywords,
      // businessService: input,
      serviceArea,
      categoryName,
      subCategoryName
    };

    setFormData((prev) => ({
      ...prev,
      businessCategory: updatedBusinessCategory,
    }));

    setKey("timing");
  };

  const removeItem = (list, setList, item) =>
    setList(list.filter((el) => el !== item));

  const removeByIndex = (list, setList, index) =>
    setList(list.filter((_, i) => i !== index));

  const handleSelectArea = (area) => {
    if (!serviceArea.includes(area)) {
      setServiceArea([...serviceArea, area]);
    }
    setServiceAreaInput("");
  };

  const filteredAreas = areas?.filter(
    (area) =>
      area?.toLowerCase().includes(serviceAreainput.toLowerCase()) &&
      !serviceArea.includes(area)
  );

  useEffect(() => {
    const Cname = categoryList.filter((cl) => cl?._id === category)
    setCategoryName(Cname[0]?.name)

    const SCN = subCategory.map((item) => subCategoryList.filter((cl) => cl?._id === item))
    setSubCategoryName(SCN.map((item) => item[0]?.name))
    // console.log("SCN", SCN)

  }, [category, subCategory])

  // console.log("XXXXXXXXXX:--categoryName", subCategoryName)

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <h5 className="section-title">Business Category<sup>*</sup></h5>
      </div>

      <div className="mb-3">
        <label className="form-label">Business Category <sup>*</sup></label>
        <div className="relative">
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Select Your Category"
              value={
                categoryList.find((cat) => cat._id === category)?.name || category
              }
              onChange={(e) => {
                const value = e.target.value;
                setCategory(value);

                const matches = categoryList.filter((cat) =>
                  cat.name.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredCategories(matches);
              }}
              onFocus={() => setFilteredCategories(categoryList)}
              autoComplete="off"
              required
            />

            {filteredCategories.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
              >
                {filteredCategories.map((cat) => (
                  <li
                    key={cat._id}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setCategory(cat._id);
                      setFilteredCategories([]); // hide suggestions
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      <div className="mb-3">
        <label className="form-label">
          Business SubCategory <sup>*</sup>
        </label>

        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search and select subcategory"
            value={subcategorySearch}
            onChange={(e) => setSubcategorySearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // prevent flicker
          />
          {showSuggestions && (
            <ul className="list-group position-absolute w-100"
              style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
              {subCategoryList
                .filter((cat) =>
                  cat.name.toLowerCase().includes(subcategorySearch.toLowerCase())
                )
                .map((cat) => (
                  <li
                    key={cat._id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSubCategorySelect(cat._id)}
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          )}
        </div>




        {/* Display selected subcategories as badges */}
        <div className="mt-2 d-flex flex-wrap">
          {subCategory.map((cat) => (
            <span key={cat} className="badge bg-primary m-1 d-flex align-items-center">
              {subCategoryList.find((item) => item?._id === cat)?.name || cat}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                onClick={() => removeItem(subCategory, setSubCategory, cat)}
                aria-label="Remove"
                style={{ filter: 'invert(1)' }} // Ensures visibility on colored badge
              />
            </span>
          ))}
        </div>
      </div>


      <div className="mb-3">
        <label className="form-label">Add Your Business Keywords (press Enter to add)<sup>*</sup></label>
        <input
          type="text"
          value={input}
          className="form-control"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Business Services"
        />
        <div className="mt-2">
          {keywords.map((keyword, index) => (
            <span style={{ textTransform: "capitalize" }} key={index} className="badge bg-primary m-1 p-2">
              {keyword}
              <button
                type="button"
                className="btn-close ms-2 bg-danger"
                onClick={() => removeByIndex(keywords, setKeywords, index)}
                aria-label="Remove"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3 position-relative">
        <label className="form-label">Services Area/Pincode<sup>*</sup></label>
        <input
          type="number"
          className="form-control"
          placeholder="Services Area/Pincode"
          value={serviceAreainput}
          onChange={(e) => setServiceAreaInput(e.target.value)}
        />
        {serviceAreainput && filteredAreas?.length > 0 && (
          <ul className="list-group position-absolute z-3 w-100">
            {filteredAreas?.map((area) => (
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
          {serviceArea?.map((serarea) => (
            <span key={serarea} style={{ textTransform: "capitalize" }} className="badge bg-primary m-1 p-2">
              {serarea}
              <button
                type="button"
                className="btn-close ms-2 bg-danger"
                onClick={() => removeItem(serviceArea, setServiceArea, serarea)}
                aria-label="Remove"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">About Your Business <sup>*</sup></label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Write about your business..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Business Photos <span className="text-danger">(Optional)</span></label>
        <input
          type="file"
          className="form-control"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="image-preview-container mt-2">
          {businessImages.map((img, index) => (
            <div key={index} className="image-preview d-inline-block position-relative me-2">
              <img src={img} alt={`Preview ${index}`} className="img-thumbnail" />
              <button
                type="button"
                className="btn-close position-absolute top-0 start-100 translate-middle bg-danger"
                onClick={() => removeByIndex(businessImages, setBusinessImages, index)}
                aria-label="Remove"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Button Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
        <button
          type="button"
          style={{ backgroundColor: "#343a40", color: "#fff", border: "none", padding: "0.5rem 1.2rem", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", flex: 1, transition: "background 0.3s ease" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#212529")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#343a40")}
          onClick={() => setKey?.("business")}
        >
          ← Back
        </button>

        <button
          type="submit"
          className="btn btn-success fw-bold"
          style={{ flex: 1 }}
        >
          Submit
        </button>
      </div>

    </form>
  );
};

export default BusinessCategory;
