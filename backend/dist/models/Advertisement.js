"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdvertisementSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategory: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subcategory",
        default: null,
    },
    categoryName: {
        type: String,
        default: null,
        trim: true,
    },
    subCategoryName: {
        type: String,
        default: null,
        trim: true,
    },
    redirectUrl: {
        type: String,
        trim: true,
        default: "",
    },
    image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        required: true,
        default: "Active",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Advertisement", AdvertisementSchema);
