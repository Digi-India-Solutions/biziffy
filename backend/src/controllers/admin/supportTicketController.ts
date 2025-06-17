import { Request, Response } from "express";
import SupportTicket from "../../models/SupportTicket";
import mongoose from "mongoose";

// Get all support tickets
export const getSupportTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await SupportTicket.find().populate("userId").sort({ createdAt: -1 });
    console.log("tickets:==>", tickets)
    res.status(200).json({ status: true, data: tickets });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching support tickets", error });
  }
};

export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const { userId, supportType, email, issue } = req.body;
    console.log("req.body:==>", req.body)
    if (!userId || !supportType || !email || !issue) {
      return res.status(400).json({ status: false, message: "All fields (userId, supportType, email, issue) are required.", });
    }

    const newTicket = new SupportTicket({ userId, supportType, email, issue, });

    await newTicket.save();

    return res.status(201).json({ status: true, message: "Support ticket created successfully", data: newTicket, });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return res.status(500).json({ status: false, message: "Internal server error", error: error instanceof Error ? error.message : error, });
  }
};

export const getSupportTicketById = async (req: Request, res: Response) => {
  try {
    // console.log("ticket:==>w", req.params.id);
    const userId = new mongoose.Types.ObjectId(req.params.id); // optional, if `userId` is stored as ObjectId
    const ticket = await SupportTicket.find({ userId });
    if (!ticket) {
      return res.status(404).json({ status: false, message: "Support ticket not found" });
    }
    res.status(200).json({ status: true, data: ticket });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching support ticket", error });
  }
};

// Update support ticket status
export const updateSupportTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ status: false, message: "Support ticket not found" });
    }
    res.status(200).json({ status: true, data: updatedTicket });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error updating support ticket status", error });
  }
};

// Delete a support ticket
export const deleteSupportTicket = async (req: Request, res: Response) => {
  try {
    const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) {
      return res.status(404).json({ status: false, message: "Support ticket not found" });
    }
    res.status(200).json({ status: true, message: "Support ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error deleting support ticket", error });
  }
};


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