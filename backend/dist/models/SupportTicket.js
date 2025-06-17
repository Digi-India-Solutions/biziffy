"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supportTicketSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth", required: true }, // Fixed typo: useId → userId
    supportType: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ["pending", "open", "completed"], default: "pending", },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("SupportTicket", supportTicketSchema);
