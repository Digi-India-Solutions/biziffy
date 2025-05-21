// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/components/ui/use-toast";
// import { useNavigate, useParams } from "react-router-dom";
// import { getData, postData } from "@/services/FetchNodeServices";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
// import { State, Country } from "country-state-city";

// interface StateData {
//   _id: string;
//   name: string;
//   stateImage: string;
//   isActive: boolean;
//   uniqueStateId?: string;
// }

// const EditStates = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState<StateData>({ _id: "", name: "", stateImage: "", isActive: true, });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>("");
//   const [loading, setLoading] = useState(true);
//   const [allStates, setAllStates] = useState<any[]>([]);


//     useEffect(() => {
//       const indianStates = State.getStatesOfCountry("IN"); // Get states of India
//       setAllStates(indianStates);
//     }, []);

//   useEffect(() => {
//     const fetchState = async () => {
//       try {
//         const response = await getData(`state/get-all-state-by-id/${id}`);
//         if (response.status) {
//           const data = response.data;
//           setFormData({
//             _id: data._id,
//             name: data.name || "",
//             stateImage: data.stateImage || "",
//             isActive: data.isActive ?? true,
//             uniqueStateId: data.uniqueStateId || "",
//           });
//           setImagePreview(data.stateImage);
//         } else {
//           toast({ variant: "destructive", title: "Error", description: "Failed to fetch state details." });
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchState();
//   }, [id, toast]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked, files } = e.target;

//     if (type === "file" && files && files.length > 0) {
//       const file = files[0];
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     } else if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const body = new FormData();
//     body.append("name", formData.name);
//     body.append("isActive", formData.isActive.toString());
//     if (imageFile) {
//       body.append("image", imageFile);
//     }

//     try {
//       const response = await postData(`state/update-state/${formData._id}`, body);
//       if (response.status) {
//         toast({ title: "State Updated", description: "The state was successfully updated." });
//         navigate("/admin/state");
//       } else {
//         toast({ variant: "destructive", title: "Update Failed", description: response.message || "Something went wrong." });
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast({ variant: "destructive", title: "Error", description: "Failed to update state." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStateSelect = (value: string) => {
//     setFormData((prev) => ({ ...prev, name: value }));
//   };


//   if (loading) {
//     return (
//       <AdminLayout title="Edit State">
//         <div className="flex items-center justify-center h-[60vh]">
//           <div className="animate-pulse text-xl">Loading state details...</div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout title="Edit State">
//       <div className="flex flex-col gap-5">
//         <h1 className="text-2xl font-bold">Edit State</h1>

//         <Card>
//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="state">Select State *</Label>
//                   <Select onValueChange={handleStateSelect}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a State" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {allStates.map((state) => (
//                         <SelectItem key={state.isoCode} value={state.name}>
//                           {state.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="image">Image</Label>
//                   <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange} />
//                   {imagePreview && (
//                     <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border" />
//                   )}
//                   <p className="text-xs text-gray-500">Optional: Upload an image for the state.</p>
//                 </div>

//                 <div className="flex items-center space-x-2 h-full">
//                   <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4" />
//                   <Label htmlFor="isActive">Active</Label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <Button type="button" variant="outline" onClick={() => navigate("/admin/state")}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Updating..." : "Update State"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminLayout>
//   );
// };

// export default EditStates;


import { AdminLayout } from "@/components/Layout/AdminLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getData, postData } from "@/services/FetchNodeServices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

interface StateData {
  _id: string;
  name: string;
  stateImage: string;
  isActive: boolean;
  uniqueStateId?: string;
}

const EditStates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<StateData>({
    _id: "",
    name: "",
    stateImage: "",
    isActive: true,
    uniqueStateId: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [allStates, setAllStates] = useState<{ name: string; isoCode: string }[]>([]);

  // Fetch all Indian states
  useEffect(() => {
    const indianStates = State.getStatesOfCountry("IN");
    setAllStates(indianStates);
  }, []);

  // Fetch existing state details
  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await getData(`state/get-all-state-by-id/${id}`);
        if (response.status) {
          const data = response.data;
          setFormData({
            _id: data._id,
            name: data.name || "",
            stateImage: data.stateImage || "",
            isActive: data.isActive ?? true,
            uniqueStateId: data.uniqueStateId || "",
          });
          setImagePreview(data.stateImage);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch state details.",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchState();
  }, [id, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file" && files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStateSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("isActive", formData.isActive.toString());
    if (imageFile) {
      body.append("image", imageFile);
    }

    try {
      const response = await postData(`state/update-state/${formData._id}`, body);
      if (response.status) {
        toast({
          title: "Success",
          description: "State updated successfully.",
        });
        navigate("/admin/state");
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: response.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update state.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit State">
        <div className="flex items-center justify-center h-[60vh]">
          <p className="animate-pulse text-xl">Loading state details...</p>
        </div>
      </AdminLayout>
    );
  }

  // console.log("XXXXXXXXXXXX",formData)
  return (
    <AdminLayout title="Edit State">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold">Edit State</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="state">Select State *</Label>
                  <Select value={formData.name} onValueChange={handleStateSelect}>
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
                  <Label htmlFor="image">State Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="State Preview"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload an image to represent the state.
                  </p>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center space-x-2 h-full">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/state")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update State"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditStates;
