import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  icon: z.any().refine((file) => file?.length > 0, { message: "Icon is required" }),
  banner: z.any().refine((file) => file?.length > 0, { message: "Banner is required" }),
  status: z.enum(["active", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

const AddNewCategory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      icon: null,
      banner: null,
      status: "active",
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setField: (value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setField(e.target.files);
    } else {
      setPreview(null);
      setField(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("status", data.status);
    if (data.icon?.[0]) formData.append("icon", data.icon[0]);
    if (data.banner?.[0]) formData.append("banner", data.banner[0]);

    try {
      const res = await fetch("https://api.biziffy.com/api/create-categories", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create category.");
      }

      const result = await res.json();

      toast({
        title: "Category Created",
        description: `Category "${result.category?.name || data.name}" has been created successfully.`,
      });

      form.reset();
      setIconPreview(null);
      setBannerPreview(null);
      navigate("/admin/categories");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Add New Category">
      <div className="bg-white p-6 rounded-lg shadow-sm  mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormDescription>This name will be displayed to users.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Upload */}
            <Controller
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Icon</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setIconPreview, field.onChange)}
                      className="max-w-xs"
                    />
                  </FormControl>
                  {iconPreview && (
                    <div className="mt-2 h-16 w-16 relative">
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <FormDescription>Upload an icon (recommended size: 64x64px).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Banner Upload */}
            <Controller
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Banner</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setBannerPreview, field.onChange)}
                      className="max-w-xs"
                    />
                  </FormControl>
                  {bannerPreview && (
                    <div className="mt-2 h-16 w-16 relative">
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <FormDescription>Upload a banner (recommended size: 64x64px).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Set this category's visibility status.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/categories">Cancel</Link>
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Create Category
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AddNewCategory;
