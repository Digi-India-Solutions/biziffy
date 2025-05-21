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
exports.updateStatus = exports.createContact = exports.getAllContacts = void 0;
const Contact_1 = __importDefault(require("../../models/Contact"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all contacts
const getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield Contact_1.default.find({}).sort({ createdAt: -1 });
        res.json({ status: true, message: " fetch contacts successfully ", data: contacts });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch contacts", error });
        return;
    }
});
exports.getAllContacts = getAllContacts;
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, city, inquiryType, state } = req.body;
        // Basic field validation
        if (!name || !email || !phone || !inquiryType || !state) {
            res.status(400).json({ status: false, message: "Missing required fields: name, email, phone, or inquiryType", });
            return;
        }
        // Create and save contact
        const newContact = new Contact_1.default({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), city: (city === null || city === void 0 ? void 0 : city.trim()) || "", inquiryType, state: state.trim() });
        const savedContact = yield newContact.save();
        res.status(201).json({ status: true, message: "Contact created successfully", data: savedContact, });
    }
    catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ status: false, message: "Failed to create contact", error: (error === null || error === void 0 ? void 0 : error.message) || "Unknown server error", });
        return;
    }
});
exports.createContact = createContact;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid ID format" });
            return;
        }
        const updated = yield Contact_1.default.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updated) {
            res.status(404).json({ success: false, message: "Contact not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Status updated successfully", data: updated });
    }
    catch (err) {
        console.error("Error updating status:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.updateStatus = updateStatus;
