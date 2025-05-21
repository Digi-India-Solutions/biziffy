"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    inquiryType: {
        type: String,
        required: true,
        enum: ["general", "partnership", "advertising", "support"],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "Received", "Rejected"],
        default: "Pending",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.models.Contact || mongoose_1.default.model("Contact", contactSchema);
