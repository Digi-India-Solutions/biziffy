import Contact from "../../models/Contact";
import mongoose from "mongoose";
import { Request, Response } from "express";

// Get all contacts
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ status: true, message: " fetch contacts successfully ", data: contacts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error })
    return;
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, city, inquiryType, state } = req.body;

    // Basic field validation
    if (!name || !email || !phone || !inquiryType || !state) {
      res.status(400).json({ status: false, message: "Missing required fields: name, email, phone, or inquiryType", })
      return;
    }

    // Create and save contact
    const newContact = new Contact({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), city: city?.trim() || "", inquiryType, state: state.trim() });

    const savedContact = await newContact.save();

    res.status(201).json({ status: true, message: "Contact created successfully", data: savedContact, });

  } catch (error: any) {
    console.error("Error saving contact:", error);
    res.status(500).json({ status: false, message: "Failed to create contact", error: error?.message || "Unknown server error", })
    return;
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid ID format" });
      return;
    }

    const updated = await Contact.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: "Contact not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Status updated successfully", data: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};