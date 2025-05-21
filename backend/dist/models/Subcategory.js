"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MainSubCategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    mailbanner: { type: String },
});
const SubcategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    image: { type: String },
    banner: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    category: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category", required: true },
    // mainSubCategories: [MainSubCategorySchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model("Subcategory", SubcategorySchema);
