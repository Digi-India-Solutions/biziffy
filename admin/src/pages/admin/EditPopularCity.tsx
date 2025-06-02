import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

interface City {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

const EditPopularCity = () => {
  const { id } = useParams<{ id: string }>();
  const [cityList, setCityList] = useState<City[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    banner: null as File | null,
    bannerUrl: "", // For showing old image
    city: "",
    category: [] as string[],
    color: "#6E59A5",
    abouteCity: "",
    isActive: true,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch city details
  useEffect(() => {
    const fetchCityDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res = await axios.get(`https://api.biziffy.comapi/populerCity/get-popular-city-by-id/${id}`);
        const data = res.data?.data;
        // console.log("res:====", res?.data.data);
        if (res.data?.status) {
          setFormData({
            city: data?.city?._id || "",
            category: data.category.map((cat: any) => cat?._id) || [],
            color: data.color || "#6E59A5",
            abouteCity: data.abouteCity || "",
            isActive: data.isActive || false,
            banner: null,
            bannerUrl: data.banner || "",
          });
        }

      } catch (error) {
        console.error("Error fetching city details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load city details.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCityDetails();
  }, [id, toast]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cityRes, catRes] = await Promise.all([
          axios.get("https://api.biziffy.comapi/city/get-all-city"),
          axios.get("https://api.biziffy.comapi/categories"),
        ]);

        if (cityRes?.data?.status) setCityList(cityRes.data.data);
        if (catRes?.status) setCategoryList(catRes.data);
      } catch (error) {
        console.error("Initial fetch failed:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, banner: file }));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData?.category?.includes(value)) {
      setFormData((prev) => ({ ...prev, category: [...prev?.category, value] }));
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
      form.append("city", formData?.city);
      form.append("color", formData?.color);
      form.append("abouteCity", formData?.abouteCity);
      form.append("isActive", String(formData?.isActive));
      formData.category.forEach((cat) => form.append("category", cat));

      const res = await axios.post(`https://api.biziffy.comapi/populerCity/update-popular-city/${id}`, form);
      if (res?.data?.status) {
        toast({ title: "Success", description: "City updated successfully!" });
        navigate("/admin/popular-cities");
      }

    } catch (error) {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not update city. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit City">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse text-xl">Loading city details...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Popular City">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/popular-cities")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Popular City</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner */}
                <div className="space-y-2">
                  <Label htmlFor="banner">Banner</Label>
                  <Input id="banner" type="file" name="banner" onChange={handleFileChange} />
                  {formData?.bannerUrl && (
                    <img
                      src={formData?.bannerUrl}
                      alt="Old Banner"
                      className="mt-2 w-48 h-24 object-cover rounded border"
                    />
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <select id="city" name="city" value={formData?.city} onChange={handleInputChange} required className="border px-3 py-2 rounded w-full"                  >
                    <option value="">Select a City</option>
                    {cityList?.map((city) => (
                      <option key={city?._id} value={city?._id}>
                        {city?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categories */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category">Categories *</Label>
                  <select id="category" onChange={handleCategorySelect} className="border px-3 py-2 rounded w-full"                  >
                    <option value="">Select Category</option>
                    {categoryList?.map((cat) => (
                      <option key={cat?._id} value={cat?._id}>
                        {cat?.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData?.category?.map((catId, index) => {
                      const cat = categoryList?.find((c) => c?._id === catId);
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

                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" id="color" name="color" value={formData?.color} onChange={handleInputChange} className="h-10 w-10 border rounded" />
                    <Input name="color" value={formData?.color} onChange={handleInputChange} />
                  </div>
                </div>

                {/* About City */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="abouteCity">About City</Label>
                  <Input id="abouteCity" name="abouteCity" value={formData?.abouteCity} onChange={handleInputChange} />
                </div>

                {/* Active */}
                <div className="flex items-center gap-2 mt-6 md:col-span-2">
                  <input type="checkbox" id="isActive" name="isActive" checked={formData?.isActive} onChange={handleCheckboxChange} />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/popular-cities")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update City"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditPopularCity;
