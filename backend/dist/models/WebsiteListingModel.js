"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const websiteListingSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth", },
    companyName: { type: String, required: true, },
    website: String,
    shortDescription: String,
    // aboutBusiness: String,
    // area: String,
    service: [String],
    logo: String,
    category: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category", },
    subCategory: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Subcategory", },
    serviceArea: String,
    // businessPhotos: [String],
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    cliCkCount: {
        type: Map,
        of: new mongoose_1.default.Schema({
            count: { type: Number, default: 0 },
            user: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth" }],
        }),
        default: {},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("WebsiteListing", websiteListingSchema);
