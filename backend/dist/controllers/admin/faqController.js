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
exports.deleteFaq = exports.updateFaq = exports.getFaqById = exports.toggleFaqStatus = exports.getAllFaqs = exports.createFaq = void 0;
const FaqModel_1 = __importDefault(require("../../models/FaqModel"));
// Create FAQ
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("BODY", req.body);
        const { question, answer, status } = req.body;
        const faq = new FaqModel_1.default({ question, answer, status });
        yield faq.save();
        res.status(201).json({ status: true, message: "FAQ created successfully", faq });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to create FAQ", error: error.message });
    }
});
exports.createFaq = createFaq;
// Get All FAQs
const getAllFaqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield FaqModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, message: "FAQs fetched successfully", data: faqs });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch FAQs", error: error.message });
    }
});
exports.getAllFaqs = getAllFaqs;
const toggleFaqStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqId = req.params.id;
        const { status } = req.body;
        const updatedFaq = yield FaqModel_1.default.findByIdAndUpdate(faqId, { status }, { new: true });
        if (!updatedFaq) {
            return res.status(404).json({ status: false, message: "FAQ not found" });
        }
        res.status(200).json({ status: true, data: updatedFaq });
    }
    catch (error) {
        console.error("Error toggling FAQ status:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
});
exports.toggleFaqStatus = toggleFaqStatus;
// Get Single FAQ
const getFaqById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield FaqModel_1.default.findById(req.params.id);
        if (!faq)
            return res.status(204).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ fetched successfully", data: faq });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to fetch FAQ", error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.getFaqById = getFaqById;
// Update FAQ
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, answer, status } = req.body;
        const updatedFaq = yield FaqModel_1.default.findByIdAndUpdate(req.params.id, { question, answer, status }, { new: true });
        if (!updatedFaq)
            return res.status(204).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ updated successfully", faq: updatedFaq });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to update FAQ", error: error.message });
    }
});
exports.updateFaq = updateFaq;
// Delete FAQ
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedFaq = yield FaqModel_1.default.findByIdAndDelete(req.params.id);
        if (!deletedFaq)
            return res.status(404).json({ status: false, message: "FAQ not found" });
        res.status(200).json({ status: true, message: "FAQ deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to delete FAQ", error: error.message });
    }
});
exports.deleteFaq = deleteFaq;
