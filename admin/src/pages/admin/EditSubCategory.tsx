import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface FormValues {
    name: string;
    image: FileList | null;
    banner: FileList | null;
    status: string;
}

const EditSubCategory = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            image: null,
            banner: null,
            status: "active",
        },
    });

    // Fetch subcategory details to edit
    useEffect(() => {
        const fetchSubCategory = async () => {
            try {
                const { data } = await axios.get(`http://localhost:18001/api/admin/get-subcategory-by-id/${id}`);
                // console.log("datadatadata:----", data)
                form.setValue("name", data.name);
                form.setValue("status", data.status);
                // setSelectedCategory(data.category.name);
                setSelectedCategory(data.category._id);
                setImagePreview(data.image);
                setBannerPreview(data.banner);
            } catch (err) {
                console.error("Failed to load subcategory", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:18001/api/categories");
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };

        fetchSubCategory();
        fetchCategories();
    }, [form, id]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "image" | "banner"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "image") {
                setImagePreview(reader.result as string);
                form.setValue("image", e.target.files as FileList);
            } else {
                setBannerPreview(reader.result as string);
                form.setValue("banner", e.target.files as FileList);
            }
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: FormValues) => {
        if (!selectedCategory) {
            toast({ title: "Please select a category." });
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("status", data.status);
        formData.append("category", selectedCategory);

        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        if (data.banner?.[0]) {
            formData.append("banner", data.banner[0]);
        }

        try {
            await axios.post(`http://localhost:18001/api/admin/update-subcategories/${id}`, formData);
            toast({ title: "Subcategory updated successfully." });
            navigate("/admin/subcategories");
        } catch (error) {
            console.error("Error updating subcategory:", error.response?.data || error.message);
            toast({ title: "Failed to update subcategory.", variant: "destructive", });
        }
    };

    return (
        <AdminLayout title="Edit Subcategory">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Category Dropdown */}
                        <FormItem>
                            <FormLabel>Select Category</FormLabel>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border p-2 rounded-md w-full"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <FormDescription>Choose the category for this subcategory.</FormDescription>
                        </FormItem>

                        {/* Subcategory Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subcategory Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter subcategory name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <FormItem>
                            <FormLabel>Subcategory Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "image")} className="max-w-xs" />
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                                )}
                            </div>
                            <FormDescription>Image for subcategory thumbnail.</FormDescription>
                        </FormItem>

                        {/* Banner Upload */}
                        <FormItem>
                            <FormLabel>Subcategory Banner</FormLabel>
                            <div className="flex items-center gap-4">
                                <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "banner")} className="max-w-xs" />
                                {bannerPreview && (
                                    <img src={bannerPreview} alt="Banner Preview" className="h-16 w-16 object-cover rounded-md" />
                                )}
                            </div>
                            <FormDescription>Banner image for subcategory page/header.</FormDescription>
                        </FormItem>

                        {/* Status Field */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <select {...field} className="border p-2 rounded-md w-full">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" asChild>
                                <Link to="/admin/subcategories">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                                Update Subcategory
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
};

export default EditSubCategory;
