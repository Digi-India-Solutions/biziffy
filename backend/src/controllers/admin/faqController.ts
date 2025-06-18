import { Request, Response } from "express";
import Faq from "../../models/FaqModel";

// Create FAQ
export const createFaq = async (req: Request, res: Response) => {
    try {
        // console.log("BODY", req.body);
        const { question, answer, status } = req.body;
        const faq = new Faq({ question, answer, status });
        await faq.save();
        res.status(201).json({ status: true, message: "FAQ created successfully", faq });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Failed to create FAQ", error: error.message });
    }
};

// Get All FAQs
export const getAllFaqs = async (req: Request, res: Response) => {
    try {
        const faqs = await Faq.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, message: "FAQs fetched successfully", data: faqs });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Failed to fetch FAQs", error: error.message });
    }
};

export const toggleFaqStatus = async (req: Request, res: Response) => {
    try {
        const faqId = req.params.id;
        const { status } = req.body;

        const updatedFaq = await Faq.findByIdAndUpdate(faqId, { status }, { new: true });

        if (!updatedFaq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }

        res.status(200).json({ status: true, data: updatedFaq });
    } catch (error: any) {
        console.error("Error toggling FAQ status:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
};

// Get Single FAQ
export const getFaqById = async (req: Request, res: Response) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (!faq) return res.status(204).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ fetched successfully", data: faq });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Failed to fetch FAQ", error: error?.message });
    }
};

// Update FAQ
export const updateFaq = async (req: Request, res: Response) => {
    try {
        const { question, answer, status } = req.body;
        const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, { question, answer, status }, { new: true });
        if (!updatedFaq) return res.status(204).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ updated successfully", faq: updatedFaq });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Failed to update FAQ", error: error.message });
    }
};

// Delete FAQ
export const deleteFaq = async (req: Request, res: Response) => {
    try {
        const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
        if (!deletedFaq) return res.status(404).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ status: false, message: "Failed to delete FAQ", error: error.message });
    }
};
