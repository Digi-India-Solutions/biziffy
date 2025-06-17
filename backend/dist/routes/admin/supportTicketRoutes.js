"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supportTicketController_1 = require("../../controllers/admin/supportTicketController");
const router = express_1.default.Router();
router.get("/get-all-support-tickets", supportTicketController_1.getSupportTickets);
router.post("/support-tickets", supportTicketController_1.createSupportTicket);
router.get("/get-support-tickets-by-user/:id", supportTicketController_1.getSupportTicketById);
// PUT update status of a ticket (open/closed)
router.post("/support-tickets-change-status/:id", supportTicketController_1.updateSupportTicketStatus); // 👈 update route
// DELETE a support ticket
router.get("/support-tickets-delete/:id", supportTicketController_1.deleteSupportTicket);
exports.default = router;
