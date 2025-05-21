"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const citySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true, default: "INDIA" },
    cityImage: { type: String, required: true },
    badge: { type: String },
    color: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    topCity: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model("City", citySchema);
