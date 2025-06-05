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
exports.getCategoryById = exports.deleteCategoryById = exports.updateCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../../models/Category"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
// Create new category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, status = "active" } = req.body;
        const files = req.files;
        // Initialize file paths
        const iconFile = (_a = files === null || files === void 0 ? void 0 : files['icon']) === null || _a === void 0 ? void 0 : _a[0];
        const bannerFile = (_b = files === null || files === void 0 ? void 0 : files['banner']) === null || _b === void 0 ? void 0 : _b[0];
        // Upload to cloud (or process)
        let iconUrl = null;
        let bannerUrl = null;
        if (iconFile) {
            iconUrl = yield (0, cloudinary_1.uploadImage)(iconFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(iconFile.path);
        }
        if (bannerFile) {
            bannerUrl = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
        }
        const newCategory = new Category_1.default({
            name,
            icon: iconUrl,
            banner: bannerUrl,
            status,
        });
        yield newCategory.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory,
        });
    }
    catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
});
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Failed to get categories" });
    }
});
exports.getAllCategories = getAllCategories;
// Update category by ID
const updateCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const icon = req.file ? req.file.filename : undefined;
        const existingCategory = yield Category_1.default.findById(id);
        let updatedImageUrl = null;
        if (req.file) {
            if (existingCategory === null || existingCategory === void 0 ? void 0 : existingCategory.icon) {
                yield (0, cloudinary_1.deleteImage)(existingCategory.icon);
            }
            updatedImageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        const updateData = { name };
        if (updatedImageUrl)
            updateData.icon = updatedImageUrl;
        const updatedCategory = yield Category_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Failed to update category" });
    }
});
exports.updateCategoryById = updateCategoryById;
const deleteCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCategory = yield Category_1.default.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (deletedCategory === null || deletedCategory === void 0 ? void 0 : deletedCategory.icon) {
            (0, cloudinary_1.deleteImage)(deletedCategory.icon);
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Failed to delete category" });
    }
});
exports.deleteCategoryById = deleteCategoryById;
// Get category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findById(id).populate("subcategories");
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        console.error("Error fetching category by ID:", error);
        res.status(500).json({ message: "Failed to get category" });
    }
});
exports.getCategoryById = getCategoryById;
