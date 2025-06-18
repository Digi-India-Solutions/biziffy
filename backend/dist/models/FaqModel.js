"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faqSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: Boolean, default: true },
}, { timestamps: true });
const Faq = mongoose_1.default.model("Faq", faqSchema);
exports.default = Faq;
