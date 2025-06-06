import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getData, postData } from "@/services/FetchNodeServices";

interface Category {
  _id: string;
  name: string;
}

interface AdvertisementData {
  title: string;
  type: string;
  businessCategory: string;
  subCategory: string;
  redirectUrl: string;
  status: "Active" | "Inactive";
  image: File | null | string;
  categoryName?: string;
  subCategoryName?: string;
}

const EditAdvertisements: React.FC = () => {
  const { id } = useParams(); // assuming you're passing id via URL params
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdvertisementData>({
    title: "",
    type: "",
    businessCategory: "",
    subCategory: "",
    redirectUrl: "",
    status: "Inactive",
    image: null,
    categoryName: "",
    subCategoryName: ""
  });

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://api.biziffy.com/api/categories");
        setCategoryList(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Load existing advertisement
  useEffect(() => {
    const fetchAdvertisement = async () => {
      if (!id) return;
      try {
        const res = await getData(`advertisements/get-advertisements-by-id/${id}`);
        if (res) {
          setFormData({
            ...res,
            businessCategory: res?.category,
            image: res?.image,
            categoryName: res?.categoryName || "",
            subCategoryName: res?.subCategoryName || "",
          });
          setImagePreview(res?.image);
        }
      } catch (err) {
        console.error("Failed to fetch advertisement", err);
      }
    };
    fetchAdvertisement();
  }, [id]);

  // Load subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!formData.businessCategory) return;
      try {
        const response = await getData(`admin/get-Subcategories-by-category/${formData.businessCategory}`);
        setSubCategoryList(response || []);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      }
    };
    fetchSubcategories();
  }, [formData.businessCategory]);

  // Update category and subcategory name in form
  useEffect(() => {
    const selectedCategory = categoryList.find(c => c._id === formData.businessCategory);
    const selectedSubCategory = subCategoryList.find(s => s._id === formData.subCategory);
    setFormData(prev => ({
      ...prev,
      categoryName: selectedCategory?.name || "",
      subCategoryName: selectedSubCategory?.name || ""
    }));
  }, [formData.businessCategory, formData.subCategory, categoryList, subCategoryList]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("type", formData.type);
      formPayload.append("category", formData.businessCategory);
      formPayload.append("subCategory", formData.subCategory || "");
      formPayload.append("categoryName", formData.categoryName || "");
      formPayload.append("subCategoryName", formData.subCategoryName || "");
      formPayload.append("redirectUrl", formData.redirectUrl);
      formPayload.append("status", formData.status);
      if (formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      await postData(`advertisements/update-advertisements/${id}`, formPayload);
      navigate("/admin/advertisements");
    } catch (error) {
      console.error("Error updating advertisement:", error);
      alert("Error updating advertisement");
    }
  };

  return (
    <AdminLayout title="Edit Advertisement">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Advertisement</h1>
        <Link to="/admin/advertisements">
          <Button className="bg-blue-500 hover:bg-blue-600">
            All Advertisements
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter advertisement title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Type</option>
                <option value="Listing detail center">Listing detail center</option>
                <option value="Listing detail Right">Listing detail Right</option>
                <option value="Listing Bottom">Listing Bottom</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category</Label>
              <select
                id="businessCategory"
                name="businessCategory"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.businessCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categoryList.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <Label htmlFor="subCategory">Sub Category</Label>
              <select
                id="subCategory"
                name="subCategory"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.subCategory}
                onChange={handleInputChange}
              >
                <option value="">Select Sub Category</option>
                {subCategoryList.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Redirect URL */}
            <div className="space-y-2">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                placeholder="https://example.com"
                value={formData.redirectUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Advertisement Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <input
                    type="file"
                    id="imageUpload"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                  >
                    Upload Image
                  </Button>
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto mt-4 w-48 h-32 object-contain border"
                  />
                )}
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          </div>

          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 px-6">
            Update Advertisement
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditAdvertisements;
