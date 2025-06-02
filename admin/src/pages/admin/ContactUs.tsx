// import { useEffect, useState } from "react";
// import { AdminLayout } from "@/components/Layout/AdminLayout";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Pencil, Search } from "lucide-react";
// import axios from "axios";
// import { TableCell } from "@/components/ui/table";

// interface ContactData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   message: string;
//   state?: string;
//   city?: string;
//   services?: string;
//   createdAt: string;
// }

// const ContactUs = () => {
//   const { toast } = useToast();
//   const [contactData, setContactData] = useState<ContactData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusOptions] = useState(["Pending", "Recived", "Rejected"]);
//   const [editingPublishStatusId, setEditingPublishStatusId] = useState<string | null>(null);
//   const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
//   const contactsPerPage = 4;

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await axios.get("https://api.biziffy.comapi/contactus/get-all-contact");
//         console.log("GGGGGG", res)
//         if (res?.data?.status === true) {
//           setContactData(res?.data?.data);
//           setLoading(false);
//         }

//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load contacts from server.",
//           variant: "destructive",
//         });
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, []);

//   const filteredContacts = contactData.filter((contact) =>
//     Object.values(contact).some((value) =>
//       String(value).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const indexOfLastContact = currentPage * contactsPerPage;
//   const indexOfFirstContact = indexOfLastContact - contactsPerPage;
//   const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
//   const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

//   const handleExportToCSV = () => {
//     if (filteredContacts.length === 0) return;

//     const csvHeader = Object.keys(filteredContacts[0]).join(",") + "\n";
//     const csvRows = filteredContacts
//       .map((contact) =>
//         Object.values(contact)
//           .map((val) => `"${String(val).replace(/"/g, '""')}"`)
//           .join(",")
//       )
//       .join("\n");

//     const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "contacts.csv";
//     a.click();

//     toast({ title: "Exported", description: "Contacts exported to CSV successfully!" });
//   };


//   const handleUpdateStatus = async (id: string, newStatus: string) => {
//     // console.log("XXXXXXXXXXXXXXXXXXXXXXXX----", newStatus)
//     try {
//       await axios.post(`https://api.biziffy.comapi/update-business-listing-status/${id}`, { status: newStatus });
//       setFullListings(
//         fullListings.map((listing) => {
//           if (listing._id === id && listing.businessDetails) {
//             return {
//               ...listing,
//               businessDetails: {
//                 ...listing.businessDetails,
//                 status: newStatus,
//                 businessStatus:
//                   newStatus === "Approved" ? "Approved" : "Not Approved",
//                 trustStatus:
//                   newStatus === "Approved" || newStatus === "Pending"
//                     ? "Approved"
//                     : "Not Approved",
//               },
//             };
//           }
//           return listing;
//         })
//       );
//       setEditingStatusId(null);
//       toast({
//         title: "Status Updated",
//         description: `Listing ${id} status updated to ${newStatus}.`,
//       });
//     } catch (error: any) {
//       console.error("Failed to update status", error);
//       toast({
//         variant: "destructive",
//         title: "Error Updating Status",
//         description:
//           error.response?.data?.message || "Failed to update status.",
//       });
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const normalized =
//       status?.toLowerCase() === "unpublish" ? "pending" : status?.toLowerCase();
//     const displayStatus = normalized === "unpublish" ? "pending" : normalized;
//     switch (displayStatus) {
//       case "approved":
//         return (
//           <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
//             Approved
//           </span>
//         );
//       case "pending":
//         return (
//           <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
//             Pending
//           </span>
//         );
//       case "rejected":
//         return (
//           <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">
//             Rejected
//           </span>
//         );
//       default:
//         return (
//           <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
//             {status}
//           </span>
//         );
//     }
//   };

//   return (
//     <AdminLayout title="Contact Us">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
//         <div className="relative w-full sm:w-72">
//           <Input
//             type="text"
//             placeholder="Search contact..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//         </div>

//         <div className="flex gap-2">
//           <Button className="bg-blue-500 hover:bg-blue-600">All Contact Us</Button>
//           <Button onClick={handleExportToCSV} className="bg-green-500 hover:bg-green-600">
//             Export to CSV
//           </Button>
//         </div>
//       </div>

//       {loading ? (
//         <p className="text-center mt-10">Loading contacts...</p>
//       ) : (
//         <>
//           <div className="overflow-x-auto rounded-md border">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {["Name", "Email", "Phone", "Message", "State", "City", "Status", "Created At"].map(
//                     (heading) => (
//                       <th
//                         key={heading}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {heading}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentContacts.map((contact, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm text-gray-900">{contact?.name}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{contact?.email}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{contact?.phone}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{contact?.inquiryType}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{contact?.state}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{contact?.city || "-"}</td>
//                     <TableCell>
//                       {editingStatusId === contact?._id ? (
//                         <select
//                           className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
//                           value={contact?.status || ''} onChange={(e) => handleUpdateStatus(contact?._id, e.target.value)} onBlur={() => setEditingStatusId(null)} autoFocus                    >

//                           {statusOptions?.map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           {getStatusBadge(contact?.status || "Pending")}
//                           <button
//                             onClick={() => setEditingStatusId(contact?._id)}
//                             className="p-1 bg-orange-200 rounded-md hover:bg-orange-300 transition-colors w-6 h-6 flex items-center justify-center"
//                             title="Edit Status"
//                           >
//                             <Pencil className="w-3 h-3 text-orange-600" />
//                           </button>
//                         </div>
//                       )}
//                     </TableCell>
//                     <td className="px-6 py-4 text-sm text-gray-900">{new Date(contact?.createdAt).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center mt-6 flex-wrap gap-2">
//             <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
//               Previous
//             </Button>

//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 variant={page === currentPage ? "default" : "outline"}
//                 onClick={() => setCurrentPage(page)}
//               >
//                 {page}
//               </Button>
//             ))}

//             <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </AdminLayout>
//   );
// };

// export default ContactUs;


import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Search } from "lucide-react";
import axios from "axios";
import { TableCell } from "@/components/ui/table";

interface ContactData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  state?: string;
  city?: string;
  services?: string;
  status?: string;
  createdAt: string;
}

const ContactUs = () => {
  const { toast } = useToast();
  const [contactData, setContactData] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOptions] = useState(["Pending", "Received", "Rejected"]);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const contactsPerPage = 4;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("https://api.biziffy.comapi/contactus/get-all-contact");
        if (res?.data?.status === true) {
          setContactData(res?.data?.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load contacts from server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contactData.filter((contact) =>
    Object.values(contact).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handleExportToCSV = () => {
    if (filteredContacts.length === 0) return;

    const csvHeader = Object.keys(filteredContacts[0]).join(",") + "\n";
    const csvRows = filteredContacts
      .map((contact) =>
        Object.values(contact)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();

    toast({ title: "Exported", description: "Contacts exported to CSV successfully!" });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.post(`https://api.biziffy.comapi/contactus/update-status/${id}`, { status: newStatus, });
      setContactData((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, status: newStatus } : contact
        )
      );
      setEditingStatusId(null);
      toast({
        title: "Status Updated",
        description: `Status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Updating Status",
        description: error.response?.data?.message || "Failed to update status.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Approved</span>;
      case "pending":
        return <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case "rejected":
        return <span className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full">Rejected</span>;
      case "received":
        return <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Received</span>;
      default:
        return <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <AdminLayout title="Contact Us">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="relative w-full sm:w-72">
          <Input
            type="text"
            placeholder="Search contact..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600">All Contact Us</Button>
          <Button onClick={handleExportToCSV} className="bg-green-500 hover:bg-green-600">
            Export to CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading contacts...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Email", "Phone", "Message", "State", "City", "Status", "Created At"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{contact.message}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.state || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contact.city || "-"}</td>
                    <TableCell>
                      {editingStatusId === contact._id ? (
                        <select
                          className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                          value={contact.status || ""}
                          onChange={(e) => handleUpdateStatus(contact?._id, e.target.value)}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                        >
                          {statusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contact.status || "Pending")}
                          <button
                            onClick={() => setEditingStatusId(contact._id)}
                            className="p-1 bg-orange-200 rounded-md hover:bg-orange-300 transition-colors w-6 h-6 flex items-center justify-center"
                            title="Edit Status"
                          >
                            <Pencil className="w-3 h-3 text-orange-600" />
                          </button>
                        </div>
                      )}
                    </TableCell>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(contact.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 flex-wrap gap-2">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default ContactUs;
