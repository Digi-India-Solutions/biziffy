"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ViewButton,
  DeleteButton,
  EditButton,
} from "@/components/ui/table-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { getData, postData } from "../../services/FetchNodeServices";

interface SupportTicket {
  _id: string;
  userId: string;
  supportType: string;
  email: string;
  issue: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const SupportTickets = () => {
  const { toast } = useToast();
  const [supportTicketsData, setSupportTicketsData] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkAction, setBulkAction] = useState("");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const ticketsPerPage = 5;

  const fetchSupportTickets = async () => {
    setLoading(true);
    try {
      const res = await getData("admin/get-all-support-tickets");
      setSupportTicketsData(res?.data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load tickets" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportTickets();
  }, []);

  const filteredTickets = supportTicketsData.filter((ticket) =>
    `${ticket._id} ${ticket.email} ${ticket.issue} ${ticket.supportType} ${ticket.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleExportToCSV = () => {
    const csvContent = [
      ["ID", "Support Type", "Email", "Issue", "Created At", "Status"],
      ...filteredTickets.map((ticket) => [
        ticket._id,
        ticket.supportType,
        ticket.email,
        `"${ticket.issue.replace(/"/g, '""')}"`,
        new Date(ticket.createdAt).toLocaleString(),
        ticket.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "support_tickets.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const confirmDelete = async () => {
    if (!selectedTicket) return;
    try {
      const res = await getData(`admin/support-tickets-delete/${selectedTicket._id}`);
      if (res?.status) {
        toast({ title: "Deleted", description: "Ticket deleted successfully." });
        fetchSupportTickets();
        setDeleteModal(false);
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete ticket." });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      const res = await postData(`admin/support-tickets-change-status/${selectedTicket._id}`, { status: newStatus });
      if (res?.status) {
        toast({ title: "Updated", description: `Status changed to ${newStatus}` });
        fetchSupportTickets();
        setEditModal(false);
      }
    } catch {
      toast({ title: "Error", description: "Failed to update status." });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTickets.length === 0) {
      toast({ title: "No tickets selected" });
      return;
    }

    try {
      if (action === "delete") {
        await Promise.all(selectedTickets.map((id) => getData(`admin/support-tickets-delete/${id}`)));
        toast({ title: "Deleted", description: "Selected tickets deleted." });
      } else {
        await Promise.all(selectedTickets.map((id) =>
          postData(`admin/support-tickets-change-status/${id}`, { status: action })
        ));
        toast({ title: "Status Updated", description: `Tickets marked as ${action}` });
      }
      fetchSupportTickets();
      setSelectedTickets([]);
      setSelectAll(false);
    } catch {
      toast({ title: "Error", description: "Bulk action failed." });
    }
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      setSelectedTickets(currentTickets.map((ticket) => ticket._id));
    } else {
      setSelectedTickets([]);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectTicket = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout title="Support Tickets">
      {/* Top Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <select
            className="border rounded-md px-3 py-2 bg-white"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk Action</option>
            <option value="open">Mark as Open</option>
            <option value="pending">Mark as Pending</option>
            <option value="completed">Mark as Completed</option>
            <option value="delete">Delete Selected</option>
          </select>
          <Button disabled={!bulkAction} onClick={() => handleBulkAction(bulkAction)}>
            Apply
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* <Button className="bg-blue-500">Add Ticket</Button> */}
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search by email, status, issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button onClick={handleExportToCSV} className="bg-green-500">
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              </th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Support Type</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Issue</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket._id)}
                      onChange={() => toggleSelectTicket(ticket._id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-mono">{ticket._id.slice(-6)}</td>
                  <td className="px-6 py-4">{ticket.supportType}</td>
                  <td className="px-6 py-4">{ticket.email}</td>
                  <td className="px-6 py-4">{ticket.issue}</td>
                  <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded font-semibold ${getStatusStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <ViewButton onClick={() => { setSelectedTicket(ticket); setViewModal(true); }} />
                    <EditButton onClick={() => { setSelectedTicket(ticket); setEditModal(true); }} />
                    <DeleteButton onClick={() => { setSelectedTicket(ticket); setDeleteModal(true); }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* View Modal */}
      {selectedTicket && (
        <Dialog open={viewModal} onOpenChange={setViewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedTicket._id}</p>
              <p><strong>Support Type:</strong> {selectedTicket.supportType}</p>
              <p><strong>Email:</strong> {selectedTicket.email}</p>
              <p><strong>Issue:</strong> {selectedTicket.issue}</p>
              <p><strong>Status:</strong> {selectedTicket.status}</p>
              <p><strong>Created At:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Modal */}
      {selectedTicket && (
        <Dialog open={editModal} onOpenChange={setEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Ticket Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {["open", "pending", "completed"].map((status) => (
                <Button
                  key={status}
                  className={`w-full ${getStatusStyle(status)}`}
                  onClick={() => handleStatusChange(status)}
                >
                  Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Modal */}
      {selectedTicket && (
        <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this ticket?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Button>
              <Button className="bg-red-600 text-white" onClick={confirmDelete}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default SupportTickets;
