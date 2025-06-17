import express from "express";
import {
  getSupportTickets,
  createSupportTicket,
  getSupportTicketById,
  updateSupportTicketStatus,
  deleteSupportTicket,
} from "../../controllers/admin/supportTicketController";

const router = express.Router();

router.get("/get-all-support-tickets", getSupportTickets);

router.post("/support-tickets", createSupportTicket);

router.get("/get-support-tickets-by-user/:id", getSupportTicketById);

// PUT update status of a ticket (open/closed)
router.post("/support-tickets-change-status/:id", updateSupportTicketStatus); // 👈 update route

// DELETE a support ticket
router.get("/support-tickets-delete/:id", deleteSupportTicket);

export default router;
