import { useEffect, useState } from "react";
import axios from "axios";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Eye, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { toast } from "@/components/ui/use-toast";
import { formatDate } from "@/constant";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

interface FullListing {
    _id: string;
    businessDetails?: {
        _id: string;
        businessName?: string;
        pinCode?: string;
        building?: string;
        street?: string;
        area?: string;
        landmark?: string;
        city?: string;
        state?: string;
        direction?: string;
        website?: string;
        createdAt?: string;
        updatedAt?: string;
        __v?: number;
        category?: string;
        userId?: string;
        publishedDate?: string;
        status?: string;
        businessStatus?: string;
        trustStatus?: string;
        phon?: string;
    };
    timings: {
        open: string;
        close: string;
        days: string[];
    };
    contact: {
        phone: string;
        email: string;
        firstName?: string; // Add firstName
        lastName?: string; // Add lastName
    };
    upgrade: {
        plan: string;
        expiryDate: string;
    };
}

export const AllWebsiteListing = () => {
    const [fullListings, setFullListings] = useState<FullListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAction, setSelectedAction] = useState("Bulk Action");
    const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);

    // Editing status state
    const [editingPublishStatusId, setEditingPublishStatusId] = useState<
        string | null
    >(null);
    const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
    const [publishStatusOptions] = useState(["Pending", "Published", "Unpublished",]);
    const [statusOptions] = useState(["Pending", "Approved", "Rejected"]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFullListings();
    }, [currentPage]);

    const fetchFullListings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:18001/api/admin/get-all-website-listings`);
            // console.log("SSSSSSSSSSSSyyy-------", res.data)
            setFullListings(res?.data.data || []);
            setTotalPages(
                Math.ceil((res.data.length || 0) / listingsPerPage) || 1
            );
        } catch (err: unknown) {
            console.error("Failed to fetch full listings", err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to fetch listings");
            }
            setFullListings([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };
    // console.log("setFullListings", fullListings.data)

    const filteredListings = fullListings.filter((listing) => {
        const query = searchQuery.toLowerCase();

        // Safely extract fields from listing
        const companyName = listing?.companyName?.toLowerCase() || "";
        const website = listing?.website?.toLowerCase() || "";
        const area = listing?.area?.toLowerCase() || "";
        const serviceArea = listing?.serviceArea?.toLowerCase() || "";
        const shortDescription = listing?.shortDescription?.toLowerCase() || "";
        const aboutBusiness = listing?.aboutBusiness?.toLowerCase() || "";

        const serviceList = Array.isArray(listing?.service)
            ? listing?.service.join(" ").toLowerCase()
            : "";

        const createdAt = formatDate(listing?.createdAt)?.toLowerCase() || "";

        return (
            companyName.includes(query) ||
            website.includes(query) ||
            area.includes(query) ||
            serviceArea.includes(query) ||
            shortDescription.includes(query) ||
            aboutBusiness.includes(query) ||
            serviceList.includes(query) ||
            createdAt.includes(query)
        );
    });


    const currentListings = filteredListings.slice(
        (currentPage - 1) * listingsPerPage,
        currentPage * listingsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleBulkAction = async () => {
        if (selectedAction === "Bulk Action" || selectedListingIds.length === 0)
            return;

        try {
            const data = await axios.post(`http://localhost:18001/api/admin//website-listing-bulk-action`, {
                ids: selectedListingIds,
                action: selectedAction,
            });
            // console.log("data:-/website-listing-bulk-action", data)
            toast({
                title: "Bulk Action Successful",
                description: `Successfully performed '${selectedAction}' on ${selectedListingIds.length} listings.`,
            });
            fetchFullListings();
            setSelectedListingIds([]);
            setSelectedAction("Bulk Action");
        } catch (error: any) {
            console.error(`Failed to ${selectedAction} listings`, error);
            toast({
                variant: "destructive",
                title: "Bulk Action Failed",
                description:
                    error.response?.data?.message ||
                    `Failed to perform '${selectedAction}' on selected listings.`,
            });
        }
    };

    const handleCheckboxChange = (id: string) => {
        if (selectedListingIds.includes(id)) {
            setSelectedListingIds(selectedListingIds.filter((item) => item !== id));
        } else {
            setSelectedListingIds([...selectedListingIds, id]);
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedListingIds(
                currentListings.map((listing) => listing._id)
            );
        } else {
            setSelectedListingIds([]);
        }
    };

    const getStatusBadge = (status: string) => {
        const normalized =
            status?.toLowerCase() === "unpublish" ? "pending" : status?.toLowerCase();
        const displayStatus = normalized === "unpublish" ? "pending" : normalized;
        switch (displayStatus) {
            case "approved":
                return (
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                        Approved
                    </span>
                );
            case "pending":
                return (
                    <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                        Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                        {status}
                    </span>
                );
        }
    };

    const getBusinessTrustStatus = (status: string) => {
        const normalized = status.toLowerCase();
        const color = normalized === "approved" ? "bg-blue-600" : "bg-red-600";
        return (
            <span className={`px-2 py-1 text-xs ${color} text-white rounded-md`}>
                {status} Business Status
            </span>
        );
    };

    const getTrustStatus = (status: string) => {
        const normalized = status.toLowerCase();
        const color = normalized === "approved" ? "bg-green-600" : "bg-yellow-600";
        return (
            <span className={`px-2 py-1 text-xs ${color} text-white rounded-md`}>
                {status} Trust Status
            </span>
        );
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        // console.log("XXXXXXXXXXXXXXXXXXXXXXXX----", newStatus)
        try {
            await axios.post(`http://localhost:18001/api/admin/update-website-listing-status/${id}`, { status: newStatus });
            setFullListings(
                fullListings.map((listing) => {
                    if (listing._id === id && listing) {
                        return {
                            ...listing,
                            status: newStatus,
                            businessStatus:
                                newStatus === "Approved" ? "Approved" : "Not Approved",
                            trustStatus:
                                newStatus === "Approved" || newStatus === "Pending"
                                    ? "Approved"
                                    : "Not Approved",
                        };
                    }
                    return listing;
                })
            );
            setEditingStatusId(null);
            toast({
                title: "Status Updated",
                description: `Listing ${id} status updated to ${newStatus}.`,
            });
        } catch (error: any) {
            console.error("Failed to update status", error);
            toast({
                variant: "destructive",
                title: "Error Updating Status",
                description:
                    error.response?.data?.message || "Failed to update status.",
            });
        }
    };

    const handleDeleteListing = async (id: string) => {
        if (!id) {
            console.error("No ID provided for deletion");
            toast({ variant: "destructive", title: "Invalid ID", description: "Listing ID is missing. Please try again.", });
            return;
        }
        try {
            const response = await axios.get(`http://localhost:18001/api/admin/delete-website-listing/${id}`);
            // console.log("Delete Response: ", response);
            fetchFullListings();
        } catch (error) {
            console.error("Delete failed: ", error.response ? error.response.data : error.message);
        }
    };

    // console.log("XXXXXXXXXXXXXXXXXVXXXXXX", currentListings);

    const csvData = filteredListings.map((listing) => ({
        ID: listing?._id, // Use MongoDB _id for CSV ID
        Title: listing.businessName,
        Category: listing?.category?.name,
        User: listing?.userId,
        CreatedDate: listing?.createdAt,
        Status: listing?.status,
        BusinessStatus: listing?.businessStatus,
        TrustStatus: listing.trustStatus,
    }));

    if (loading) {
        return (
            <AdminLayout title=""><div>Loading listings...</div></AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout title=""><div className="text-red-500">Error loading listings: {error}</div></AdminLayout>
        );
    }
    console.log("currentListings", currentListings)
    return (
        <AdminLayout title="">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">All User Listings</h1>
            </div>

            {/* Bulk Actions + Search/Export */}
            <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
                <div className="flex items-center gap-2">
                    <select
                        className="px-4 py-2 border rounded-md"
                        value={selectedAction}
                        onChange={(e) => setSelectedAction(e.target.value)}
                    >
                        <option value="Bulk Action">Bulk Action</option>
                        <option value="Delete">Delete</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleBulkAction} disabled={selectedListingIds.length === 0}>
                        Apply
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search"
                        className="w-40 md:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <CSVLink
                        data={csvData}
                        filename="listings.csv"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm text-center w-28 sm:w-auto"
                    >
                        Export to CSV
                    </CSVLink>
                </div>
            </div>

            <div className="bg-white rounded-md border shadow-sm mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    onChange={handleSelectAll}
                                    checked={currentListings.length > 0 && selectedListingIds.length === currentListings.length} />
                            </TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>User Name</TableHead>
                            <TableHead>Created Date</TableHead>
                            {/* <TableHead>Published</TableHead> */}
                            <TableHead>Website Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentListings?.map((listing) => (
                            <TableRow key={listing._id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={selectedListingIds.includes(listing._id)}
                                        onChange={() => handleCheckboxChange(listing._id)}
                                    />
                                </TableCell>
                                <TableCell>{listing._id}</TableCell>
                                <TableCell>{listing?.companyName}</TableCell>
                                <TableCell>{listing?.category?.name}</TableCell>
                                <TableCell>{listing?.userId?.fullName}</TableCell>
                                <TableCell>{formatDate(listing?.createdAt)}</TableCell>
                                <TableCell>
                                    {editingStatusId === listing._id ? (
                                        <select
                                            className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            value={listing?.status || ''} onChange={(e) => handleUpdateStatus(listing._id, e.target.value)} onBlur={() => setEditingStatusId(null)} autoFocus                    >

                                            {statusOptions?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(listing?.status || "Pending")}
                                            <button
                                                onClick={() => setEditingStatusId(listing._id)}
                                                className="p-1 bg-orange-200 rounded-md hover:bg-orange-300 transition-colors w-6 h-6 flex items-center justify-center"
                                                title="Edit Status"
                                            >
                                                <Pencil className="w-3 h-3 text-orange-600" />
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => navigate(`/admin/Website/listings/details/${listing?._id}`, { state: { listing: listing } })}
                                                size="sm" variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>

                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteListing(listing?._id)}>
                                                <Trash className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {getBusinessTrustStatus(listing.status || "Not Approved")}
                                            {getTrustStatus(listing.publishedDate || "Not Approved")}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6 space-x-2">
                    <Button size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>

                    {[...Array(totalPages)].map((_, i) => (
                        <Button key={i} size="sm" variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                        </Button>
                    ))}
                    <Button size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AllWebsiteListing;
