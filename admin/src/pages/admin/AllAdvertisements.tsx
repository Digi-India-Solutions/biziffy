// import { useEffect, useState } from "react";
// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Pencil, Trash } from "lucide-react";
// import axios from "@/api/axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import { getData } from "@/services/FetchNodeServices";

// interface Advertisement {
//   _id: string;
//   category: string;
//   title: string;
//   type: string;
//   status: "Active" | "Inactive" | string;
//   image: string;
//   categoryName: string;
// }

// const AllAdvertisements = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
//   const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [bulkAction, setBulkAction] = useState("");
//   const itemsPerPage = 4;

//   useEffect(() => {
//     fetchAdvertisements();
//     fetchCategories();
//   }, []);

//   const fetchAdvertisements = async () => {
//     try {
//       const response = await getData("advertisements/get-all-advertisements");
//       setAdvertisements(response || []);
//     } catch (error) {
//       console.error("Failed to fetch advertisements", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories", error);
//     }
//   };

//   const filteredAdvertisements = advertisements.filter((ad) => {
//     const searchMatch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const categoryMatch = filterCategory === "All" || ad.category === filterCategory;
//     return searchMatch && categoryMatch;
//   });

//   const totalPages = Math.ceil(filteredAdvertisements.length / itemsPerPage);
//   const paginatedAds = filteredAdvertisements.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const getStatusBadge = (status: string) => {
//     const base = "px-3 py-1 text-sm rounded-full";
//     if (status === "Active") return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
//     if (status === "Inactive") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Inactive</span>;
//     return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
//   };

//   // const handleCheckboxChange = (id: string) => {
//   //   setSelectedIds((prev) =>
//   //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//   //   );
//   // };

//   // const handleSelectAll = () => {
//   //   const ids = paginatedAds.map((ad) => ad._id);
//   //   const allSelected = ids.every((id) => selectedIds.includes(id));
//   //   setSelectedIds(allSelected ? selectedIds.filter((id) => !ids.includes(id)) : [...new Set([...selectedIds, ...ids])]);
//   // };

//   // const handleBulkAction = async () => {
//   //   if (!bulkAction || selectedIds.length === 0) return toast.warning("Select action and at least one item");
//   //   try {
//   //     if (bulkAction === "Delete") {
//   //       await Promise.all(selectedIds.map((id) => axios.delete(`/advertisements/${id}`)));
//   //       setAdvertisements((prev) => prev.filter((ad) => !selectedIds.includes(ad._id)));
//   //       toast.success("Selected advertisements deleted");
//   //     } else {
//   //       const status = bulkAction === "Activate" ? "Active" : "Inactive";
//   //       await Promise.all(selectedIds.map((id) => axios.put(`/advertisements/${id}`, { status })));
//   //       setAdvertisements((prev) =>
//   //         prev.map((ad) => (selectedIds.includes(ad._id) ? { ...ad, status } : ad))
//   //       );
//   //       toast.success(`Selected advertisements ${status.toLowerCase()}d`);
//   //     }
//   //     setSelectedIds([]);
//   //   } catch (err) {
//   //     toast.error("Bulk action failed");
//   //   }
//   // };

//   const handleDelete = async () => {
//     if (!selectedAd) return;
//     try {
//       await getData(`advertisements/delete-advertisements/${selectedAd?._id}`);
//       setAdvertisements((prev) => prev.filter((ad) => ad?._id !== selectedAd?._id));
//       toast.success("Advertisement deleted successfully");
//       setShowDeleteDialog(false);
//       setSelectedAd(null);
//     } catch {
//       toast.error("Failed to delete advertisement");
//     }
//   };

//   const handleEditStatus = async () => {
//     if (!selectedAd) return;
//     const updatedStatus = selectedAd.status === "Active" ? "Inactive" : "Active";
//     try {
//       await axios.put(`/advertisements/${selectedAd._id}`, { ...selectedAd, status: updatedStatus });
//       setAdvertisements((prev) =>
//         prev.map((ad) => (ad._id === selectedAd._id ? { ...ad, status: updatedStatus } : ad))
//       );
//       toast.success(`Status changed to ${updatedStatus}`);
//       setSelectedAd(null);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleExportToCSV = () => {
//     const rows = [["ID", "Category", "Title", "Type", "Status"], ...filteredAdvertisements.map(ad => [ad._id, ad.category, ad.title, ad.type, ad.status])];
//     const csv = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "advertisements.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <AdminLayout title="All Advertisements">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">All Advertisements</h1>
//       </div>

//       <div className="bg-white border rounded-lg p-4 shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex items-center gap-2">
//           {/* <select className="px-3 py-2 border rounded-md text-sm" value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
//             <option value="">Bulk Action</option>
//             <option value="Delete">Delete</option>
//             <option value="Activate">Activate</option>
//             <option value="Deactivate">Deactivate</option>
//           </select>
//           <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm" onClick={handleBulkAction}>Apply</Button> */}
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <Input type="text" placeholder="Search advertisements..." className="w-64 text-sm" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
//           <select className="px-3 py-2 border rounded-md text-sm w-48" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
//             <option value="All">All Categories</option>
//             {categories.map((c) => (<option key={c._id} value={c.name}>{c.name}</option>))}
//           </select>
//           <Button className="bg-green-500 hover:bg-green-600 text-white text-sm" onClick={handleExportToCSV}>Export to CSV</Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-md border shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {/* <TableHead><input type="checkbox" className="h-4 w-4" checked={paginatedAds.every(ad => selectedIds.includes(ad._id))} onChange={handleSelectAll} /></TableHead> */}
//               <TableHead>ID</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Image</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedAds.map((ad) => (
//               <TableRow key={ad._id}>
//                 {/* <TableCell><input type="checkbox" className="h-4 w-4" checked={selectedIds.includes(ad._id)} onChange={() => handleCheckboxChange(ad._id)} /></TableCell> */}
//                 <TableCell>{ad._id}</TableCell>
//                 <TableCell>{ad.categoryName}</TableCell>
//                 <TableCell>{ad.title}</TableCell>
//                 <TableCell>{ad.type}</TableCell>
//                 <TableCell><img src={ad?.image} alt={`Ad ${ad?._id}`} className="h-12 w-12 object-cover rounded-md" /></TableCell>
//                 <TableCell>{getStatusBadge(ad?.status)}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate(`/admin/advertisements/edit/${ad._id}`)}>
//                       <Pencil className="h-4 w-4 mr-1" /> Edit
//                     </Button>
//                     <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//                       <DialogTrigger asChild>
//                         <Button size="sm" variant="destructive" onClick={() => { setSelectedAd(ad); setShowDeleteDialog(true); }}>
//                           <Trash className="h-4 w-4 mr-1" /> Delete
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent>
//                         <DialogTitle>Are you sure?</DialogTitle>
//                         <p>This action cannot be undone. Do you want to delete this advertisement?</p>
//                         <DialogFooter>
//                           <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
//                           <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
//                         </DialogFooter>
//                       </DialogContent>
//                     </Dialog>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex justify-center mt-6 space-x-2">
//         <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
//         {Array.from({ length: totalPages }, (_, i) => (
//           <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
//         ))}
//         <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
//       </div>
//     </AdminLayout>
//   );
// };

// export default AllAdvertisements;




// import { useEffect, useState } from "react";
// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Pencil, Trash } from "lucide-react";
// import axios from "@/api/axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";
// import { getData, postData } from "@/services/FetchNodeServices";

// interface Advertisement {
//   _id: string;
//   category: string;
//   title: string;
//   type: string;
//   status: "Active" | "Inactive" | string;
//   image: string;
//   categoryName: string;
//   subCategoryName: string;
// }

// const AllAdvertisements = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
//   const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedAd, setSelectedAd] = useState<string>("");
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchAdvertisements();
//     fetchCategories();
//   }, []);

//   const fetchAdvertisements = async () => {
//     try {
//       const response = await getData("advertisements/get-all-advertisements");
//       setAdvertisements(response || []);
//     } catch (error) {
//       console.error("Failed to fetch advertisements", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Failed to fetch categories", error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedAd) return;
//     try {
//       await getData(`advertisements/delete-advertisements/${selectedAd}`);
//       setAdvertisements((prev) => prev.filter((ad) => ad?._id !== selectedAd));
//       toast.success("Advertisement deleted successfully");
//     } catch {
//       toast.error("Failed to delete advertisement");
//     } finally {
//       setShowDeleteDialog(false);
//       setSelectedAd(null);
//     }
//   };

//   const toggleStatus = async (ad: Advertisement) => {
//     const updatedStatus = ad.status === "Active" ? "Inactive" : "Active";
//     try {
//       await postData(`advertisements/change-status/${ad?._id}`, { status: updatedStatus });
//       setAdvertisements((prev) =>
//         prev.map((item) => (item._id === ad?._id ? { ...item, status: updatedStatus } : item))
//       );
//       toast.success(`Status changed to ${updatedStatus}`);
//     } catch {
//       toast.error("Failed to update status");
//     }
//   };

//   const handleExportToCSV = () => {
//     const rows = [
//       ["ID", "Category", "Sub Category Name", "Title", "Type", "Status"],
//       ...filteredAdvertisements.map((ad) => [
//         ad._id, ad.categoryName, ad.subCategoryName, ad.title, ad.type, ad.status,
//       ]),
//     ];
//     const csv = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
//     const link = document.createElement("a");
//     link.href = encodeURI(csv);
//     link.download = "advertisements.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredAdvertisements = advertisements.filter((ad) => {
//     const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSearch2 = ad.type.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesSearch3 = ad.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = filterCategory === "All" || ad.categoryName === filterCategory;
//     return matchesSearch || matchesSearch2 || matchesSearch3 && matchesCategory;
//   });

//   const totalPages = Math.ceil(filteredAdvertisements.length / itemsPerPage);
//   const paginatedAds = filteredAdvertisements.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const getStatusBadge = (status: string) => {
//     const base = "px-3 py-1 text-sm rounded-full";
//     if (status === "Active") return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
//     if (status === "Inactive") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Inactive</span>;
//     return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
//   };

//   return (
//     <AdminLayout title="All Advertisements">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">All Advertisements</h1>
//       </div>

//       <div className="bg-white border rounded-lg p-4 shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex items-center gap-2" />
//         <div className="flex flex-wrap items-center gap-2">
//           <Input
//             type="text"
//             placeholder="Search advertisements..."
//             className="w-64 text-sm"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//           <select
//             className="px-3 py-2 border rounded-md text-sm w-48"
//             value={filterCategory}
//             onChange={(e) => {
//               setFilterCategory(e.target.value);
//               setCurrentPage(1);
//             }}
//           >
//             <option value="All">All Categories</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c.name}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//           <Button className="bg-green-500 hover:bg-green-600 text-white text-sm" onClick={handleExportToCSV}>
//             Export to CSV
//           </Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-md border shadow-sm">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Title</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Image</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedAds.map((ad) => (
//               <TableRow key={ad._id}>
//                 <TableCell>{ad._id}</TableCell>
//                 <TableCell>{ad.categoryName}</TableCell>
//                 <TableCell>{ad.title}</TableCell>
//                 <TableCell>{ad.type}</TableCell>
//                 <TableCell>
//                   <img src={ad.image} alt="ad" className="h-12 w-12 object-cover rounded-md" />
//                 </TableCell>
//                 <TableCell onClick={() => toggleStatus(ad)} className="cursor-pointer">
//                   {getStatusBadge(ad.status)}
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate(`/admin/advertisements/edit/${ad._id}`)}>
//                       <Pencil className="h-4 w-4 mr-1" /> Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => {
//                         setSelectedAd(ad?._id);
//                         setShowDeleteDialog(true);
//                       }}
//                     >
//                       <Trash className="h-4 w-4 mr-1" /> Delete
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex justify-center mt-6 space-x-2">
//         <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
//         {Array.from({ length: totalPages }, (_, i) => (
//           <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
//         ))}
//         <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
//       </div>

//       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <DialogContent>
//           <DialogTitle>Are you sure?</DialogTitle>
//           <p>This action cannot be undone. Do you want to delete this advertisement?</p>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
//             <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </AdminLayout>
//   );
// };

// export default AllAdvertisements;


import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import axios from "@/api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "@/services/FetchNodeServices";

interface Advertisement {
  _id: string;
  category: string;
  title: string;
  type: string;
  status: "Active" | "Inactive" | string;
  image: string;
  categoryName: string;
  subCategoryName: string;
}

const AllAdvertisements = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAd, setSelectedAd] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAdvertisements();
    fetchCategories();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await getData("advertisements/get-all-advertisements");
      setAdvertisements(response || []);
    } catch (error) {
      console.error("Failed to fetch advertisements", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAd) return;
    try {
      await getData(`advertisements/delete-advertisements/${selectedAd}`);
      setAdvertisements((prev) => prev.filter((ad) => ad._id !== selectedAd));
      toast.success("Advertisement deleted successfully");
    } catch {
      toast.error("Failed to delete advertisement");
    } finally {
      setShowDeleteDialog(false);
      setSelectedAd(null);
    }
  };

  const toggleStatus = async (ad: Advertisement) => {
    const updatedStatus = ad.status === "Active" ? "Inactive" : "Active";
    try {
      await postData(`advertisements/change-status/${ad._id}`, { status: updatedStatus });
      setAdvertisements((prev) =>
        prev.map((item) =>
          item._id === ad._id ? { ...item, status: updatedStatus } : item
        )
      );
      toast.success(`Status changed to ${updatedStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleExportToCSV = () => {
    const rows = [
      ["ID", "Category", "Sub Category Name", "Title", "Type", "Status"],
      ...filteredAdvertisements.map((ad) => [
        ad._id,
        ad.categoryName,
        ad.subCategoryName,
        ad.title,
        ad.type,
        ad.status,
      ]),
    ];
    const csv = "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "advertisements.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAdvertisements = advertisements.filter((ad) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm) ||
      ad.type.toLowerCase().includes(searchTerm) ||
      ad.categoryName.toLowerCase().includes(searchTerm);

    const matchesCategory = filterCategory === "All" || ad.categoryName === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredAdvertisements.length / itemsPerPage);
  const paginatedAds = filteredAdvertisements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 text-sm rounded-full";
    if (status === "Active") return <span className={`${base} bg-green-100 text-green-800`}>Active</span>;
    if (status === "Inactive") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Inactive</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  return (
    <AdminLayout title="All Advertisements">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Advertisements</h1>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white text-sm" onClick={handleExportToCSV}>
            Export to CSV
          </Button>
          <Input
            type="text"
            placeholder="Search advertisements..."
            className="w-64 text-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="px-3 py-2 border rounded-md text-sm w-48"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAds.map((ad) => (
              <TableRow key={ad._id}>
                <TableCell>{ad._id}</TableCell>
                <TableCell>{ad.categoryName}</TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>{ad.type}</TableCell>
                <TableCell>
                  <img
                    src={ad.image}
                    alt="ad"
                    className="h-12 w-12 object-cover rounded-md"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/default-image.png";
                    }}
                  />
                </TableCell>
                <TableCell onClick={() => toggleStatus(ad)} className="cursor-pointer">
                  {getStatusBadge(ad.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate(`/admin/advertisements/edit/${ad._id}`)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedAd(ad._id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>
        ))}
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <p>This action cannot be undone. Do you want to delete this advertisement?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AllAdvertisements;
