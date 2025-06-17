"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupportTicket = exports.updateSupportTicketStatus = exports.getSupportTicketById = exports.createSupportTicket = exports.getSupportTickets = void 0;
const SupportTicket_1 = __importDefault(require("../../models/SupportTicket"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all support tickets
const getSupportTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield SupportTicket_1.default.find().populate("userId").sort({ createdAt: -1 });
        console.log("tickets:==>", tickets);
        res.status(200).json({ status: true, data: tickets });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Error fetching support tickets", error });
    }
});
exports.getSupportTickets = getSupportTickets;
const createSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, supportType, email, issue } = req.body;
        console.log("req.body:==>", req.body);
        if (!userId || !supportType || !email || !issue) {
            return res.status(400).json({ status: false, message: "All fields (userId, supportType, email, issue) are required.", });
        }
        const newTicket = new SupportTicket_1.default({ userId, supportType, email, issue, });
        yield newTicket.save();
        return res.status(201).json({ status: true, message: "Support ticket created successfully", data: newTicket, });
    }
    catch (error) {
        console.error("Error creating support ticket:", error);
        return res.status(500).json({ status: false, message: "Internal server error", error: error instanceof Error ? error.message : error, });
    }
});
exports.createSupportTicket = createSupportTicket;
const getSupportTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("ticket:==>w", req.params.id);
        const userId = new mongoose_1.default.Types.ObjectId(req.params.id); // optional, if `userId` is stored as ObjectId
        const ticket = yield SupportTicket_1.default.find({ userId });
        if (!ticket) {
            return res.status(404).json({ status: false, message: "Support ticket not found" });
        }
        res.status(200).json({ status: true, data: ticket });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Error fetching support ticket", error });
    }
});
exports.getSupportTicketById = getSupportTicketById;
// Update support ticket status
const updateSupportTicketStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const updatedTicket = yield SupportTicket_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!updatedTicket) {
            return res.status(404).json({ status: false, message: "Support ticket not found" });
        }
        res.status(200).json({ status: true, data: updatedTicket });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Error updating support ticket status", error });
    }
});
exports.updateSupportTicketStatus = updateSupportTicketStatus;
// Delete a support ticket
const deleteSupportTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedTicket = yield SupportTicket_1.default.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            return res.status(404).json({ status: false, message: "Support ticket not found" });
        }
        res.status(200).json({ status: true, message: "Support ticket deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Error deleting support ticket", error });
    }
});
exports.deleteSupportTicket = deleteSupportTicket;
// Bulk update support tickets
// export const bulkUpdateSupportTicketsStatus = async (req: Request, res: Response) => {
//   try {
//     const { ids, status } = req.body;
//     if (!Array.isArray(ids) || !status) {
//       return res.status(400).json({ status: false, message: "Invalid input" });
//     }
//     await SupportTicket.updateMany({ _id: { $in: ids } }, { $set: { status } });
//     return res.status(200).json({ status: true, message: "Status updated for selected tickets" });
//   } catch (error) {
//     res.status(500).json({ status: false, message: "Bulk update failed", error });
//   }
// };
// // Bulk delete support tickets
// export const bulkDeleteSupportTickets = async (req: Request, res: Response) => {
//   try {
//     const { ids } = req.body;
//     if (!Array.isArray(ids)) {
//       return res.status(400).json({ status: false, message: "Invalid input" });
//     }
//     await SupportTicket.deleteMany({ _id: { $in: ids } });
//     return res.status(200).json({ status: true, message: "Deleted selected tickets" });
//   } catch (error) {
//     res.status(500).json({ status: false, message: "Bulk delete failed", error });
//   }
// };
