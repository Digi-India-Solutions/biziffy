import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { getData, postData } from "../../services/FetchNodeServices";


const EditFaq = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ question: "", answer: "", isActive: true });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFaq = async () => {
            const res = await getData(`faq/get-faq-by-id/${id}`)
            if (res?.status) {
                setFormData(res?.data)
            }
        }
        if (id) {
            fetchFaq();
        }
    }, [id])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await postData(`faq/update-faq/${id}`, formData);
            if (res?.status) {
                toast({ title: "Success", description: "FAQ added successfully!" });
                navigate("/admin/faq");
            }
        } catch (error) {
            console.error("Error adding FAQ:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add FAQ. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="Edit New FAQ">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/admin/faq")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">Edit New FAQ</h1>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question *</Label>
                                    <Input id="question" name="question" value={formData?.question} onChange={handleChange} placeholder="Enter the question" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer *</Label>
                                    <Textarea id="answer" name="answer" value={formData?.answer} onChange={handleChange} placeholder="Enter the answer" required />
                                </div>

                                <div className="flex items-center space-x-2 mt-2">
                                    <input type="checkbox" id="status" name="status" checked={formData?.status} onChange={handleCheckboxChange} className="h-4 w-4" />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => navigate("/admin/faq")}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Adding..." : "Edit FAQ"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default EditFaq;
