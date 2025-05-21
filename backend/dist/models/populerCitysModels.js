"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/PopularCity.js
const mongoose_1 = __importDefault(require("mongoose"));
const popularCitySchema = new mongoose_1.default.Schema({
    banner: { type: String, required: true }, // Store file path or Cloudinary URL
    city: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "City", required: true },
    category: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category", required: true }],
    color: { type: String, default: "#6E59A5" },
    abouteCity: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("PopularCity", popularCitySchema);
