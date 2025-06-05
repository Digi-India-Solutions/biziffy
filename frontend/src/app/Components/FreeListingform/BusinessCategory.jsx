"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../pages/freelistingform/freelistingform.css";

const BusinessCategory = ({ setKey, formData, setFormData }) => {
  const [category, setCategory] = useState(formData?.businessCategory?.category || "");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [subCategory, setSubCategory] = useState(formData?.businessCategory?.subCategory || []);
  const [businessImages, setBusinessImages] = useState(formData?.businessCategory?.businessImages || []);
  const [about, setAbout] = useState(formData?.businessCategory?.about || "");
  const [keywords, setKeywords] = useState(formData?.businessCategory?.keywords || []);
  const [input, setInput] = useState("");
  const [areas, setAreas] = useState([]);
  const [serviceArea, setServiceArea] = useState(formData?.businessCategory?.serviceArea || []);
  const [serviceAreainput, setServiceAreaInput] = useState("");
  const [bImage, setBImage] = useState([]);

  console.log("DADADADADADADADADA:= ", formData.businessDetails?.state)

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get(`http://localhost:18001/api/pincode/get-areapincode-by-state`, {
          params: { state: formData?.businessDetails?.state }
        });
        console.log("DADAhhh", res?.data)

        const areaList = res.data.map((user) => `${user.area} ${user.pinCode}`);
        setAreas(areaList);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, [formData.businessDetails?.state]);

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
    if (category) {
      const fetchSubCategory = async () => {
        try {
          const response = await axios.get(`http://localhost:18001/api/admin/get-Subcategories-by-category/${category}`);
          setSubCategoryList(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategory();
    }
  }, [category]);

  const handleSubCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setSubCategory((prev) => [...new Set([...prev, ...values])]);
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

  const filteredAreas = areas.filter(
    (area) =>
      area.toLowerCase().includes(serviceAreainput.toLowerCase()) &&
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
      <h5 className="section-title">Select Business Category<sup>*</sup></h5>

      <div className="mb-3">
        <label className="form-label">Select Business Category <sup>*</sup></label>
        <div className="relative">
          <select
            className="form-control"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Your Category</option>
            {categoryList.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

      </div>

      <div className="mb-3">
        <label className="form-label">
          Select Business SubCategory <sup>*</sup>
        </label>

        {/* Wrapper to prevent select overlap */}
        <div className="position-relative">
          <select
            className="form-control"
            // required
            onChange={handleSubCategoryChange}
            value={subCategory}
          // style={{ height: 'auto', minHeight: '30px' }} 
          >
            <option value="">Select Your SubCategory</option>
            {subCategoryList.map((cat) => (
              <option key={cat._id} value={cat._id} >
                {cat.name}
              </option>
            ))}
          </select>

          <i
            className="bi bi-chevron-down"
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#6c757d'
            }}
          ></i>
        </div>

        {/* Display selected subcategories as badges */}
        <div className="mt-2 d-flex flex-wrap">
          {subCategory.map((cat) => (
            <span key={cat} className="badge bg-primary m-1 d-flex align-items-center">
              {subCategoryList.find((item) => item._id === cat)?.name || cat}
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
        <label className="form-label">Business Services (press Enter to add)<sup>*</sup></label>
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
            <span key={index} className="badge bg-primary m-1 p-2">
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
          type="text"
          className="form-control"
          placeholder="Services Area/Pincode"
          value={serviceAreainput}
          onChange={(e) => setServiceAreaInput(e.target.value)}
        />
        {serviceAreainput && filteredAreas.length > 0 && (
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
          {serviceArea.map((serarea) => (
            <span key={serarea} className="badge bg-primary m-1 p-2">
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

      <button type="submit" className="btn btn-primary w-100 py-3">Next</button>
    </form>
  );
};

export default BusinessCategory;
