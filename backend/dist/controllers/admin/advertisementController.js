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
exports.changestatus = exports.deleteAdvertisement = exports.updateAdvertisement = exports.getAdvertisementById = exports.getAllAdvertisements = exports.createAdvertisement = void 0;
const Advertisement_1 = __importDefault(require("../../models/Advertisement"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
// Create Advertisement
const createAdvertisement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, type, category, subCategory, redirectUrl, status, categoryName, subCategoryName, } = req.body;
        // Validate required fields
        if (!title || !type || !category || !categoryName || !status) {
            return res.status(400).json({ status: false, error: "Missing required fields" });
        }
        // Handle image upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
            if (!imageUrl) {
                return res.status(500).json({ status: false, error: "Image upload failed" });
            }
        }
        else {
            return res.status(400).json({ status: false, error: "Image is required" });
        }
        // Create new advertisement
        const newAd = new Advertisement_1.default({
            title, type, category,
            subCategory: subCategory || null,
            redirectUrl: redirectUrl || "",
            status, image: imageUrl, categoryName,
            subCategoryName: subCategoryName || null,
        });
        const savedAd = yield newAd.save();
        return res.status(201).json({ status: true, message: "Advertisement created", data: savedAd });
    }
    catch (err) {
        console.error("❌ Error creating advertisement:", err);
        return res.status(500).json({
            status: false,
            error: "Failed to create advertisement",
            details: err.message,
        });
    }
});
exports.createAdvertisement = createAdvertisement;
// Get All Advertisements
const getAllAdvertisements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ads = yield Advertisement_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(ads);
    }
    catch (err) {
        console.error("Error fetching advertisements:", err);
        res.status(500).json({ error: "Failed to fetch advertisements", details: err.message || err });
    }
});
exports.getAllAdvertisements = getAllAdvertisements;
// Get Advertisement by ID
const getAdvertisementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params.id", req.params.id);
        const ad = yield Advertisement_1.default.findById(req.params.id);
        if (!ad)
            return res.status(404).json({ error: "Advertisement not found" });
        res.status(200).json(ad);
    }
    catch (err) {
        console.error("Error fetching advertisement by ID:", err);
        res.status(500).json({ error: "Failed to fetch advertisement", details: err.message || err });
    }
});
exports.getAdvertisementById = getAdvertisementById;
// Update Advertisement
const updateAdvertisement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, type, category, subCategory, redirectUrl, status, categoryName, subCategoryName, } = req.body;
        const { id } = req.params;
        const existingAd = yield Advertisement_1.default.findById(id);
        if (!existingAd) {
            return res.status(404).json({ status: false, error: "Advertisement not found" });
        }
        // Handle new image upload
        if (req.file) {
            if (existingAd.image) {
                (0, cloudinary_1.deleteImage)(existingAd.image);
            }
            const uploadedUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
            if (!uploadedUrl) {
                return res.status(500).json({ status: false, error: "Image upload failed" });
            }
            existingAd.image = uploadedUrl; // ✅ Fixed assignment
        }
        // Update fields conditionally
        if (title)
            existingAd.title = title;
        if (type)
            existingAd.type = type;
        if (category)
            existingAd.category = category;
        if (subCategory !== undefined)
            existingAd.subCategory = subCategory;
        if (redirectUrl !== undefined)
            existingAd.redirectUrl = redirectUrl;
        if (status)
            existingAd.status = status;
        if (categoryName)
            existingAd.categoryName = categoryName;
        if (subCategoryName !== undefined)
            existingAd.subCategoryName = subCategoryName;
        const updatedAd = yield existingAd.save();
        return res.status(200).json({ status: true, message: "Advertisement updated successfully", data: updatedAd, });
    }
    catch (err) {
        console.error("❌ Error updating advertisement:", err);
        return res.status(500).json({
            status: false,
            error: "Failed to update advertisement",
            details: err.message,
        });
    }
});
exports.updateAdvertisement = updateAdvertisement;
// Delete Advertisement
const deleteAdvertisement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params.id:-", req.params.id);
        const ad = yield Advertisement_1.default.findById(req.params.id);
        if (!ad)
            return res.status(404).json({ error: "Advertisement not found" });
        // Delete image file
        if (ad.image) {
            (0, cloudinary_1.deleteImage)(ad === null || ad === void 0 ? void 0 : ad.image);
        }
        yield Advertisement_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Advertisement deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting advertisement:", err);
        res.status(500).json({ error: "Failed to delete advertisement", details: err.message || err });
    }
});
exports.deleteAdvertisement = deleteAdvertisement;
const changestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Advertisement ID is required" });
        }
        // Find the current status only (lean to avoid hydration)
        const ad = yield Advertisement_1.default.findById(id).lean();
        if (!ad) {
            return res.status(404).json({ error: "Advertisement not found" });
        }
        // Toggle status
        const newStatus = ad.status === "Active" ? "Inactive" : "Active";
        // Update only status without triggering full validation
        const updatedAd = yield Advertisement_1.default.findByIdAndUpdate(id, { status: newStatus }, { new: true, runValidators: false });
        res.status(200).json({ message: `Status updated to ${newStatus}`, advertisement: updatedAd, });
    }
    catch (err) {
        console.error("Error changing status:", err);
        res.status(500).json({ error: "Failed to change status", details: err.message || err, });
    }
});
exports.changestatus = changestatus;
