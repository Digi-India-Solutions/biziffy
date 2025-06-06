import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

// Types
interface City {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

const AddPopularCity = () => {
  const [cityList, setCityList] = useState<City[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    banner: null as File | null,
    city: "",
    category: [] as string[],
    color: "#6E59A5",
    abouteCity: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await axios.get("https://api.biziffy.com/api/city/get-all-city");
        if (res?.data?.status) setCityList(res.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://api.biziffy.com/api/categories");
        if (res?.status) setCategoryList(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCity();
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.category.includes(value)) {
      setFormData((prev) => ({ ...prev, category: [...prev.category, value] }));
    }
  };

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      if (formData.banner) form.append("banner", formData.banner);
      form.append("city", formData.city);
      form.append("color", formData.color);
      form.append("abouteCity", formData.abouteCity);
      form.append("isActive", String(formData.isActive));
      formData.category.forEach((cat) => form.append("category", cat));

      const res = await axios.post("https://api.biziffy.com/api/populerCity/create-add", form);
      // console.log("resKKKK:-= " , res);
      toast({ title: "Success", description: "City added successfully!" });
      navigate("/admin/popular-cities");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not add city. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New City">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/popular-cities")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Popular City</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="banner">Banner</Label>
                  <Input id="banner" type="file" name="banner" onChange={handleFileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border px-3 py-2 rounded w-full"
                    required
                  >
                    <option value="">Select a City</option>
                    {cityList.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category">Categories *</Label>
                  <select
                    id="category"
                    onChange={handleCategorySelect}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.category.map((catId, index) => {
                      const cat = categoryList.find((c) => c._id === catId);
                      return (
                        <span
                          key={index}
                          className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cat?.name || catId}
                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="h-10 w-10 border rounded"
                    />
                    <Input name="color" value={formData.color} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="abouteCity">About City</Label>
                  <Input
                    id="abouteCity"
                    name="abouteCity"
                    value={formData.abouteCity}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-2 mt-6 md:col-span-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/popular-cities")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add City"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddPopularCity;
