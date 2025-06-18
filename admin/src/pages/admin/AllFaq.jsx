// "use client";
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Lock, Trash2, Pencil } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getData, postData } from "@/services/FetchNodeServices";
import Swal from "sweetalert2";

const AllFaq = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [bulkAction, setBulkAction] = useState("Bulk Action");
    const [selectedFaqs, setSelectedFaqs] = useState([]);
    const faqsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => { fetchFaqs(); }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getData("faq/get-all-faqs");
            // console.log("API Response:", response.data);
            if (response?.status === true) {
                const data = response?.data
                // console.log("Fetched Faq:", data);
                setFaqList(data);
                setLoading(false);
            }

        } catch (err) {
            if (err) {
                setError("Failed to load faqs: " + err.message);
            } else {
                setError("Failed to load faqs: An unknown error occurred.");
            }
            setFaqList([]);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFaq = async (faqId) => {
        const confirmed = window.confirm("Are you sure you want to delete this faq?");
        if (!confirmed) return;
            const response = await getData(`faq/delete-faq/${faqId}`);
            if (response?.status) {
              fetchFaqs();
            }
            setFaqList((prev) => prev.filter((u) => u?._id !== faqId));
    };

    const handleUpdateStatus = async (faqId, newStatus) => {
            const response = await postData(`faq/${faqId}/toggle-status`, { status: newStatus });
            if (response.status === true) {
                const updatedFaq = response?.data;
                setFaqList((prevFaqs) => prevFaqs?.map((faq) => faq?._id === updatedFaq?._id ? updatedFaq : faq)
                );
                setEditingStatusId(null);
            }
        
    };

    const handleCheckboxChange = (faqId) => {
        setSelectedFaqs((prevSelected) => {
            if (prevSelected.includes(faqId)) {
                return prevSelected.filter((id) => id !== faqId);
            } else {
                return [...prevSelected, faqId];
            }
        });
    };


    const handleBulkCheckboxChange = () => {
        const currentVisibleIds = currentFaqs.map((faq) => faq?._id);
        const allSelected = currentVisibleIds.every((id) => selectedFaqs?.includes(id));

        if (allSelected) {
            setSelectedFaqs((prev) => prev.filter((id) => !currentVisibleIds.includes(id)));
        } else {
            setSelectedFaqs((prev) => [...prev, ...currentVisibleIds].filter((v, i, a) => a.indexOf(v) === i));
        }
    };

    const filteredFaqs = searchQuery
        ? faqList.filter((faq) => {
            const name = faq?.fullName || "";
            const email = faq?.email || "";
            const phone = faq?.phone || "";

            const matches =
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                phone.includes(searchQuery);

            console.log(`Checking faq: ${name}, match: ${matches}`);
            return matches;
        })
        : faqList;

    const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);
    const indexOfLastFaq = currentPage * faqsPerPage;
    const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
    const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);

    // Pagination handler
    const paginate = (page) => setCurrentPage(page);

    // Page number renderer
    const renderPageNumbers = () => {
        const maxVisible = 10;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 1));
        const end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };




    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800";
            case "Inactive":
                return "bg-yellow-100 text-yellow-800";
            case "Deactivated":
                return "bg-red-100 text-red-800";
            default:
                return "";
        }
    };

    const handleViewFaqDetails = (faqId) => {
        navigate(`/admin/faq/edit/${faqId}`);
    };

    const handleBulkAction = async () => {
        if (selectedFaqs.length === 0) {
            Swal.fire("No faqs selected", "Please select faqs to perform the action.", "info");
            return;
        }

        try {
            if (bulkAction === "Delete") {
                const confirm = await Swal.fire({
                    title: "Are you sure?",
                    text: "Do you really want to delete the selected faqs?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete them!",
                });

                if (confirm.isConfirmed) {
                    const responses = await Promise.all(selectedFaqs.map((faqId) => getData(`faq/delete-faq/${faqId}`)));
                    const allSuccessful = responses.every((res) => res?.status === true);

                    if (allSuccessful) {
                        await fetchFaqs();
                        setSelectedFaqs([]);
                        Swal.fire("Deleted!", "Selected faqs have been deleted.", "success");
                    } else {
                        Swal.fire("Error", "Some faqs could not be deleted.", "error");
                    }
                }
            } else if (bulkAction === "Active" || bulkAction === "Inactive") {
                const responses = await Promise.all(selectedFaqs?.map((faqId) => postData(`faq/${faqId}/toggle-status`, { status: bulkAction==="Active" ? true : false })));
                const allSuccessful = responses.every((res) => res?.status === true);
                if (allSuccessful) {
                    await fetchFaqs();
                    setSelectedFaqs([]);
                    Swal.fire("Updated", `Faqs have been marked as ${bulkAction}.`, "success");
                } else {
                    throw new Error(response?.message || "Failed to update faq statuses.");
                }
            }
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
            console.error("Bulk action error:", errorMsg);
            setError("Bulk action failed: " + errorMsg);
            Swal.fire("Error", errorMsg, "error");
        }
        setBulkAction("Bulk Action");
    };

    const isAllCurrentFaqsSelected = currentFaqs.every((faq) => selectedFaqs.includes(faq._id));


    return (
        <AdminLayout title="All Faqs">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">All Faqs</h1>
            </div>

            <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                    <select className="px-4 py-2 border rounded-md" value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                        <option value="Bulk Action">Bulk Action</option>
                        <option value="Delete">Delete</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        {/* <option value="pending">pending</option> */}
                    </select>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleBulkAction} disabled={selectedFaqs.length === 0 && bulkAction !== "Bulk Action"}>
                        Apply
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />

                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/admin/faq/add")}>
                        Add Faq
                    </Button>
                </div>
            </div>

            {error && <div className="p-4 mb-4 text-red-500 bg-red-100 border border-red-400 rounded-md">{error}</div>}

            <div className="bg-white rounded-md border shadow-sm">
                {loading ? (
                    <div className="p-4 text-center">Loading faqs...</div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">
                                        <input type="checkbox" className="h-4 w-4" checked={isAllCurrentFaqsSelected} onChange={handleBulkCheckboxChange} />
                                    </TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Quation</TableHead>
                                    <TableHead>Ansuare</TableHead>
                                    <TableHead>Account Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentFaqs.map((faq) => (
                                    <TableRow key={faq._id}>
                                        <TableCell>
                                            <input type="checkbox" className="h-4 w-4" checked={selectedFaqs.includes(faq?._id)} onChange={() => handleCheckboxChange(faq._id)} />
                                        </TableCell>
                                        <TableCell>{faq._id}</TableCell>
                                        <TableCell>{faq?.question}</TableCell>
                                        <TableCell>{faq?.answer}</TableCell>
                                        <TableCell>
                                            <div className="relative inline-block">
                                                {editingStatusId === faq?._id ? (
                                                    <div className="absolute z-10 bg-white border rounded shadow-md">
                                                        {["Active", "Inactive"].map((statusLabel) => (
                                                            <div
                                                                key={statusLabel}
                                                                className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                                                                onClick={() =>
                                                                    handleUpdateStatus(faq?._id, statusLabel === "Active")
                                                                }
                                                            >
                                                                {statusLabel}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => setEditingStatusId(faq?._id)}
                                                        className={`px-3 py-1 text-sm rounded-full cursor-pointer inline-flex items-center gap-1 ${getStatusColor(faq?.status ? "Active" : "Inactive")
                                                            }`}
                                                    >
                                                        {faq.status ? "Active" : "Inactive"}
                                                        <Pencil className="w-3 h-3 opacity-60" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => handleViewFaqDetails(faq?._id)}>
                                                    Edit <Pencil className="h-4 w-4 mr-1" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteFaq(faq?._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {currentFaqs.length === 0 && !loading && !error && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-4">
                                            No faqs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="py-4 flex justify-end">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        {currentPage > 1 && (
                                            <PaginationPrevious href="#" onClick={() => paginate(Math.max(1, currentPage - 1))} />
                                        )}
                                    </PaginationItem>
                                    {renderPageNumbers().map((num) => (
                                        <PaginationItem key={num} className={num === currentPage ? "active" : ""}>
                                            <PaginationLink href="#" onClick={() => paginate(num)}>
                                                {num}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        {currentPage < totalPages && (
                                            <PaginationNext href="#" onClick={() => paginate(Math.min(totalPages, currentPage + 1))} />
                                        )}
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default AllFaq;