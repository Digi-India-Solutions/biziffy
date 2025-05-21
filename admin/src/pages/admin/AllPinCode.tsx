import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';
import axios from "axios";

const AllPinCode = () => {
    const [pinCodes, setPinCodes] = useState([]);
    const [filteredPinCodes, setFilteredPinCodes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [excelData, setExcelData] = useState([]);
    const [excelLoading, setExcelLoading] = useState(false);


    const navigate = useNavigate();
    const { toast } = useToast();

    const fetchPinCodes = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://api.biziffy.com/api/pincode/get-all-pin-codes");
            // console.log('response', response.data.pinCodes);
            if (response.data?.status) {
                setPinCodes(response?.data?.pinCodes);
                setFilteredPinCodes(response?.data?.pinCodes);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load pinCodes." });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPinCodes();
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            setFilteredPinCodes(
                pinCodes.filter(c =>
                    c.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.pinCode.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredPinCodes(pinCodes);
        }
    }, [searchTerm, pinCodes]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this city?")) return;
        try {
            await axios.get(`https://api.biziffy.com/api/pincode/delete-Pincode/${id}`);
            setPinCodes(prev => prev.filter(c => c._id !== id));
            toast({ title: "Deleted", description: "PinCode deleted successfully." });
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to delete pinCode." });
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/admin/pincode/edit/${id}`);
    };

    //////////////////////////////////////////////////////////

    const downloadCSV = () => {
        const userAgent = window.navigator.userAgent;
        let fileType = '';
        let fileName = '';

        if (userAgent.includes('Mac')) {
            fileType = 'numbers';
            fileName = 'All_PinCode.numbers';
        } else if (userAgent.includes('Windows')) {
            fileType = 'xlsx';
            fileName = 'All_PinCode.xlsx';
        } else {
            fileType = 'xlsx';
            fileName = 'All_PinCode.xlsx';
        }

        const link = document.createElement('a');
        link.href = `https://admin.biziffy.com/images/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                setExcelData(jsonData);
            } catch (error) {
                console.error("Error parsing Excel file", error);
                // Optionally show toast: toast.error("Invalid Excel format");
            }
        };
        reader.readAsArrayBuffer(file);
    };


    // console.log("excelData:---", excelData)

    const handleSubmitExcel = async () => {
        try {
            if (!excelData || excelData.length === 0) {
                toast({
                    variant: "destructive",
                    title: "No data",
                    description: "Please upload a valid Excel file first.",
                });
                return;
            }
    
            setExcelLoading(true);
    
            const response = await axios.post("https://api.biziffy.com/api/pincode/create-pincode-by-excel", excelData);
            const { status, created, duplicates, invalid, createdCount, duplicateCount, invalidCount } = response?.data;
    
            if (status === true) {
                if (createdCount > 0) {
                    toast({
                        title: "Success",
                        description: `${createdCount} PinCodes created successfully.`,
                    });
                }
    
                if (duplicateCount > 0) {
                    toast({
                        variant: "destructive",
                        title: "Duplicates Skipped",
                        description: `${duplicateCount} duplicate records found.`,
                    });
                }
    
                if (invalidCount > 0) {
                    const invalidPreview = invalid.slice(0, 3).map(i => `${i["Area Name"]} (${i.reason})`).join(", ");
                    toast({
                        variant: "destructive",
                        title: "Invalid Records",
                        description: `${invalidCount} invalid entries found. Example: ${invalidPreview}${invalidCount > 3 ? '...' : ''}`,
                    });
                }
    
                // Optional: Reset UI
                setExcelData([]);
                setFileName("");
                fetchPinCodes?.(); // If defined, refresh the list
            } else {
                toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: response?.data?.message || "Something went wrong.",
                });
            }
        } catch (error) {
            console.error("Excel submission failed", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred while uploading the data.",
            });
        } finally {
            setExcelLoading(false);
        }
    };
    

    //////////////////////////////////////////////////////////////////////////////////////

    return (
        <AdminLayout title="All PinCode">
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Manage PinCode</h1>
                    <Button onClick={() => navigate("/admin/pincode/create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New PinCode
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <CardTitle>All pinCode</CardTitle>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {/* Search Input */}
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search pinCode..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>

                                {/* Conditional Upload/Download Buttons */}
                                {excelData.length === 0 && (
                                    <>
                                        {/* Download Button */}
                                        <div className="w-full max-w-sm">
                                            <Button
                                                onClick={downloadCSV}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Download Excel
                                            </Button>
                                        </div>

                                        {/* Upload Button */}
                                        <div className="w-full max-w-sm relative">
                                            <label className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded cursor-pointer">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Upload Excel
                                                <input
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    hidden
                                                    onChange={handleFileUpload}
                                                />
                                            </label>
                                        </div>
                                    </>
                                )}

                                {/* Uploaded File Name */}
                                {fileName && (
                                    <div className="w-full">
                                        <p className="text-sm text-gray-700">📄 Uploaded File: <strong>{fileName}</strong></p>
                                    </div>
                                )}

                                {/* Submit Button when Excel Data is loaded */}
                                {excelData.length > 0 && (
                                    <div className="w-full max-w-sm">
                                        <button
                                            disabled={excelLoading}
                                            onClick={handleSubmitExcel}
                                            className={`w-full inline-flex items-center justify-center py-2 px-4 rounded text-white font-medium ${excelLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                                }`}
                                        >
                                            {excelLoading ? "Uploading..." : "Submit"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-4">Loading pinCode...</div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>State</TableHead>
                                            <TableHead>Aria Name</TableHead>
                                            <TableHead>Pin Code</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPinCodes?.length > 0 ? (
                                            filteredPinCodes?.map((c) => (
                                                <TableRow key={c?._id}>

                                                    <TableCell>{c?.stateName}</TableCell>
                                                    <TableCell>{c?.area}</TableCell>
                                                    <TableCell>{c?.pinCode || "—"}</TableCell>

                                                    <TableCell>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${c?.isActive
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {c?.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => handleEdit(c?._id)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(c?._id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center">
                                                    No pinCodes found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AllPinCode;
