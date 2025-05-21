// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { postData } from "@/services/FetchNodeServices";

// const CreateStates = () => {
//   const [formData, setFormData] = useState({ name: "", image: null as File | null, isActive: true, });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, type, value, checked, files } = e.target;

//     if (type === "file" && files) {
//       const file = files[0];
//       setFormData((prev) => ({ ...prev, image: file }));
//       setImagePreview(URL.createObjectURL(file));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = new FormData();
//       payload.append("name", formData.name.trim());
//       payload.append("isActive", formData.isActive ? "true" : "false");
//       if (formData.image) {
//         payload.append("image", formData.image);
//       }

//       const res = await postData("state/create/state", payload);

//       console.log("create/state", res)

//       toast({ title: "State Created", description: `${res.data?.name || formData.name} has been successfully created.`, });

//       navigate("/admin/state");
//     } catch (error: any) {
//       console.error("Error creating state:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to create state. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout title="Create State">
//       <div className="flex flex-col gap-5">
//         <h1 className="text-2xl font-bold">Create New State</h1>

//         <Card>
//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">State Name *</Label>
//                   <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter State name" required />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="image">Image</Label>
//                   <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
//                   {imagePreview && (
//                     <img src={imagePreview} alt="Preview" className="mt-2 rounded-md w-32 h-32 object-cover border" />
//                   )}
//                   <p className="text-xs text-gray-500">
//                     Optional: Upload an image for the state.
//                   </p>
//                 </div>

//                 <div className="flex items-center space-x-2 h-full">
//                   <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4" />
//                   <Label htmlFor="isActive">Active</Label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => navigate("/admin/state")}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Creating..." : "Create State"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   );
// };

// export default CreateStates;



import { AdminLayout } from "@/components/Layout/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postData } from "@/services/FetchNodeServices";
import { State, Country } from "country-state-city";

const CreateStates = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allStates, setAllStates] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN"); // Get states of India
    setAllStates(indianStates);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file" && files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleStateSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!formData.name) {
  //     toast({
  //       variant: "destructive",
  //       title: "Validation Error",
  //       description: "Please select a state from the dropdown.",
  //     });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = new FormData();
  //     payload.append("name", formData.name.trim());
  //     payload.append("isActive", formData.isActive ? "true" : "false");
  //     if (formData.image) {
  //       payload.append("image", formData.image);
  //     }

  //     const res = await postData("state/create/state", payload);

  //     toast({
  //       title: "State Created",
  //       description: `${res.data?.name || formData.name} has been successfully created.`,
  //     });

  //     navigate("/admin/state");
  //   } catch (error: any) {
  //     console.error("Error creating state:", error);
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description:
  //         error.response?.data?.message || "Failed to create state. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select or enter a valid state name.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("isActive", formData.isActive ? "true" : "false");
      if (formData.image) {
        payload.append("image", formData.image);
      }
      const res = await postData("state/create/state", payload);
      // console.log("RESPONSE:-", res)
      if (res.status) {
        toast({
          title: "State Created",
          description: `${res.data?.name || formData.name} has been successfully created.`,
        });
        navigate("/admin/state");
      } else {
        toast({
          variant: "destructive",
          title: "Creation Failed",
          description: res.error || "Could not create the state.",
        });
      }
    } catch (error: any) {
      console.error("Error creating state:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to create state. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Create State">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Create New State</h1>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="state">Select State *</Label>
                  <Select onValueChange={handleStateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a State" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem key={state.isoCode} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 rounded-md w-32 h-32 object-cover border"
                    />
                  )}
                  <p className="text-xs text-gray-500">
                    Optional: Upload an image for the state.
                  </p>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center space-x-2 h-full">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/state")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create State"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateStates;
