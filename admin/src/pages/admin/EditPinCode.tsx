import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

// Types
interface State {
    _id: string;
    name: string;
}

const EditPinCode = () => {
    const { id } = useParams();
    const [stateList, setStateList] = useState<State[]>([]);
    const [formData, setFormData] = useState({ stateName: "", area: "", pinCode: "", isActive: true, });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.get("http://localhost:18001/api/state/get-all-states");
                // console.log("res", res?.data);
                if (res?.data?.status) {
                    setStateList(res?.data?.data);
                }
            } catch (error) {
                console.error("Failed to fetch states:", error);
            }
        };
        fetchStates();
    }, []);

    const fetchPinCodes = async () => {
        try {
            const response = await axios.get(`http://localhost:18001/api/pincode/get-all-pin-codes-by-id/${id}`);
            // console.log('responsesss', response.data.pinCodes);
            if (response.data?.status) {
                setFormData(response?.data?.pinCodes);
            }
        }
        catch (error) {
            console.error("Failed to fetch pinCodes:", error);
        }
    };

    useEffect(() => {
        fetchPinCodes()
    }, [id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`http://localhost:18001/api/pincode/update-pincode/${id}`, formData);
            if (res.data.status) {
                toast({ title: "Success", description: "PinCode Updated successfully!", });
                navigate("/admin/pincode");
            } else {
                throw new Error("Failed to add pincode");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast({
                variant: "destructive",
                title: "Failed",
                description: "Could not add pinCode. Try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="Add New Pincode">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/admin/pincode")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Add New PinCode</h1>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <select id="state" name="stateName" value={formData.stateName} onChange={handleInputChange} className="border px-3 py-2 rounded w-full" required>
                                        <option value="">Select a state</option>
                                        {stateList.map((state) => (
                                            <option key={state._id} value={state.name}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area">Area *</Label>
                                    <Input type="text" id="area" name="area" value={formData.area} onChange={handleInputChange} required />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="pinCode">PinCode *</Label>
                                    <Input id="pinCode" name="pinCode" value={formData.pinCode} onChange={handleInputChange} required />
                                </div>

                                <div className="flex items-center gap-2 mt-6 md:col-span-2">
                                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleCheckboxChange} />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => navigate("/admin/pincode")}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update PinCode"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default EditPinCode;
