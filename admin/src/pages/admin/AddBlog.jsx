import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { postData } from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    heading: "",
    shortDisc: "",
    disc: "",
    image: null,
    banner: null,
    status:true
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value) => {
    setFormData((prev) => ({ ...prev, disc: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = new FormData();
      blogData.append("heading", formData?.heading);
      blogData.append("shortDisc", formData?.shortDisc);
      blogData.append("disc", formData?.disc);
      blogData.append("status", formData?.status);
      if (formData?.image) blogData.append("image", formData?.image);
      if (formData?.banner) blogData.append("banner", formData?.banner);

      const res = await postData("blog/create-blog", blogData); // multipart: true
      if (res?.status) {
        toast({ title: "Success", description: "Blog added successfully!" });
        navigate("/admin/blog");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add blog. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New Blog">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/blog")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Blog</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heading">Heading *</Label>
                  <Input
                    id="heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="Enter blog heading"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDisc">Short Description *</Label>
                  <Input
                    id="shortDisc"
                    name="shortDisc"
                    value={formData.shortDisc}
                    onChange={handleChange}
                    placeholder="Enter short description"
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="disc">Full Description *</Label>
                  <JoditEditor
                    ref={editorRef}
                    value={formData.disc}
                    onChange={handleEditorChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image *</Label>
                  <Input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner">Banner *</Label>
                  <Input
                    type="file"
                    id="banner"
                    name="banner"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={formData?.status}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="status">Status</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Blog"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddBlog;
