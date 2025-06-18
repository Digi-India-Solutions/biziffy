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

const AllBlog = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [blogList, setBlogList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingStatusId, setEditingStatusId] = useState(null);
    const [bulkAction, setBulkAction] = useState("Bulk Action");
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const blogsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await getData("blog/get-all-blogs");
            // console.log("API Response:", response.data);
            if (response?.status === true) {
                const data = response?.data
                // console.log("Fetched blog:", data);
                setBlogList(data);
                setLoading(false);
            }

        } catch (err) {
            if (err) {
                setError("Failed to load blogs: " + err.message);
            } else {
                setError("Failed to load blogs: An unknown error occurred.");
            }
            setBlogList([]);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        const confirmed = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmed) return;
        const response = await getData(`blog/delete-blog/${blogId}`);
        if (response?.status) {
            fetchBlogs();
            setBlogList((prev) => prev.filter((u) => u?._id !== blogId));
        }
        
    };

    const handleUpdateStatus = async (blogId, newStatus) => {
            const response = await postData(`blog/${blogId}/toggle-status`, { status: newStatus });
            if (response.status === true) {
                const updatedBlog = response?.data;
                setBlogList((prevBlogs) => prevBlogs?.map((blog) => blog?._id === updatedBlog?._id ? updatedBlog : blog)
                );
                setEditingStatusId(null);
            }
    };

    const handleCheckboxChange = (blogId) => {
        setSelectedBlogs((prevSelected) => {
            if (prevSelected.includes(blogId)) {
                return prevSelected.filter((id) => id !== blogId);
            } else {
                return [...prevSelected, blogId];
            }
        });
    };


    const handleBulkCheckboxChange = () => {
        const currentVisibleIds = currentBlogs.map((blog) => blog?._id);
        const allSelected = currentVisibleIds.every((id) => selectedBlogs?.includes(id));

        if (allSelected) {
            setSelectedBlogs((prev) => prev.filter((id) => !currentVisibleIds.includes(id)));
        } else {
            setSelectedBlogs((prev) => [...prev, ...currentVisibleIds].filter((v, i, a) => a.indexOf(v) === i));
        }
    };

    const filteredBlogs = searchQuery
        ? blogList.filter((blog) => {
            const name = blog?.heading || "";
            // const email = blog?.email || "";
            // const phone = blog?.phone || "";

            const matches =
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // phone.includes(searchQuery);

            console.log(`Checking blog: ${name}, match: ${matches}`);
            return matches;
        })
        : blogList;

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

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

    const handleViewBlogDetails = (blogId) => {
        navigate(`/admin/blog/edit/${blogId}`);
    };

    const handleBulkAction = async () => {
        if (selectedBlogs.length === 0) {
            Swal.fire("No blogs selected", "Please select blogs to perform the action.", "info");
            return;
        }

        try {
            if (bulkAction === "Delete") {
                const confirm = await Swal.fire({
                    title: "Are you sure?",
                    text: "Do you really want to delete the selected blogs?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete them!",
                });

                if (confirm.isConfirmed) {
                    const responses = await Promise.all(selectedBlogs.map((blogId) => getData(`blog/delete-blog/${blogId}`)));
                    const allSuccessful = responses.every((res) => res?.status === true);

                    if (allSuccessful) {
                        await fetchBlogs();
                        setSelectedBlogs([]);
                        Swal.fire("Deleted!", "Selected blogs have been deleted.", "success");
                    } else {
                        Swal.fire("Error", "Some blogs could not be deleted.", "error");
                    }
                }
            } else if (bulkAction === "Active" || bulkAction === "Inactive") {
                const responses = await Promise.all(selectedBlogs?.map((blogId) => postData(`blog/${blogId}/toggle-status`, { status: bulkAction === "Active" ? true : false })));
                const allSuccessful = responses.every((res) => res?.status === true);
                if (allSuccessful) {
                    await fetchBlogs();
                    setSelectedBlogs([]);
                    Swal.fire("Updated", `Blogs have been marked as ${bulkAction}.`, "success");
                } else {
                    throw new Error(response?.message || "Failed to update blog statuses.");
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

    const isAllCurrentBlogsSelected = currentBlogs.every((blog) => selectedBlogs.includes(blog._id));


    return (
        <AdminLayout title="All Blogs">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">All Blogs</h1>
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
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleBulkAction} disabled={selectedBlogs?.length === 0 && bulkAction !== "Bulk Action"}>
                        Apply
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />

                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/admin/blog/add")}>
                        Add Blog
                    </Button>
                </div>
            </div>

            {error && <div className="p-4 mb-4 text-red-500 bg-red-100 border border-red-400 rounded-md">{error}</div>}

            <div className="bg-white rounded-md border shadow-sm">
                {loading ? (
                    <div className="p-4 text-center">Loading blogs...</div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4"
                                            checked={isAllCurrentBlogsSelected}
                                            onChange={handleBulkCheckboxChange}
                                            aria-label="Select all blogs"
                                        />
                                    </TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Banner</TableHead>
                                    <TableHead>Heading</TableHead>
                                    <TableHead>Short Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {currentBlogs?.length > 0 &&
                                    currentBlogs.map((blog) => (
                                        <TableRow key={blog._id}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4"
                                                    checked={selectedBlogs.includes(blog._id)}
                                                    onChange={() => handleCheckboxChange(blog._id)}
                                                    aria-label={`Select blog ${blog.heading}`}
                                                />
                                            </TableCell>

                                            <TableCell className="text-xs">{blog._id}</TableCell>

                                            <TableCell>
                                                {blog.image ? (
                                                    <img src={blog?.image} alt="Blog Image" className="h-12 w-12 rounded object-cover" />
                                                ) : (
                                                    <span className="text-muted-foreground text-sm italic">No Image</span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {blog.banner ? (
                                                    <img src={blog?.banner} alt="Blog Banner" className="h-12 w-20 rounded object-cover" />
                                                ) : (
                                                    <span className="text-muted-foreground text-sm italic">No Banner</span>
                                                )}
                                            </TableCell>

                                            <TableCell className="font-medium">{blog.heading}</TableCell>
                                            <TableCell className="text-sm line-clamp-2">{blog.shortDisc}</TableCell>

                                            <TableCell>
                                                <div className="relative inline-block">
                                                    {editingStatusId === blog._id ? (
                                                        <div className="absolute z-10 bg-white border rounded shadow-md">
                                                            {["Active", "Inactive"].map((label) => (
                                                                <div
                                                                    key={label}
                                                                    className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                                                                    onClick={() => handleUpdateStatus(blog?._id, label === "Active")}
                                                                >
                                                                    {label}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => setEditingStatusId(blog._id)}
                                                            className={`px-3 py-1 text-sm rounded-full cursor-pointer inline-flex items-center gap-1 ${getStatusColor(blog.status ? "Active" : "Inactive")}`}
                                                        >
                                                            {blog.status ? "Active" : "Inactive"}
                                                            <Pencil className="w-3 h-3 opacity-60" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-blue-500 hover:bg-blue-600 text-white"
                                                        onClick={() => handleViewBlogDetails(blog._id)}
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteBlog(blog._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {!loading && currentBlogs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                                            No blogs found.
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

export default AllBlog;