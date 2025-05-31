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
exports.updatePopularCity = exports.getSinglePopularCity = exports.deletePopularCity = exports.getAllPopularCities = exports.addPopularCity = void 0;
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const populerCitysModels_1 = __importDefault(require("../../models/populerCitysModels"));
const addPopularCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { city, category, color, abouteCity, isActive } = req.body;
        console.log("XXXXXXXXXX", req.file);
        const bannerFile = req.file;
        if (!bannerFile) {
            res.status(400).json({ status: false, message: "Banner is required" });
            return;
        }
        // Upload image to Cloudinary
        const uploadedBanner = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
        // Remove temp file
        (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
        // Create new city document
        const newCity = new populerCitysModels_1.default({
            city, category, color, abouteCity,
            isActive: isActive === "true" || isActive === true,
            banner: uploadedBanner
        });
        yield newCity.save();
        res.status(201).json({ status: true, message: "Popular City added successfully", data: newCity });
    }
    catch (err) {
        console.error("Add Popular City Error:", err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
});
exports.addPopularCity = addPopularCity;
const getAllPopularCities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield populerCitysModels_1.default.find()
            .populate("city")
            .populate("category")
            .sort({ createdAt: -1 });
        res.json({ status: true, data });
    }
    catch (err) {
        res.status(500).json({ status: false, message: "Failed to fetch" });
    }
});
exports.getAllPopularCities = getAllPopularCities;
const deletePopularCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const city = yield populerCitysModels_1.default.findByIdAndDelete(id);
        if (!city) {
            return res.status(404).json({ status: false, message: "Not found" });
        }
        // If banner is a local path (optional), delete it
        if (city === null || city === void 0 ? void 0 : city.banner) {
            (0, cloudinary_1.deleteImage)(city.banner);
        }
        res.json({ status: true, message: "Deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ status: false, message: "Delete failed" });
    }
});
exports.deletePopularCity = deletePopularCity;
// // Get One
const getSinglePopularCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const city = yield populerCitysModels_1.default.findById(req.params.id)
            .populate("city")
            .populate("category");
        if (!city) {
            return res.status(404).json({ status: false, message: "Not found" });
        }
        res.json({ status: true, data: city });
    }
    catch (err) {
        res.status(500).json({ status: false, message: "Error fetching city" });
    }
});
exports.getSinglePopularCity = getSinglePopularCity;
const updatePopularCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { city, category, color, abouteCity, isActive } = req.body;
        const existingCity = yield populerCitysModels_1.default.findById(id);
        if (!existingCity) {
            return res.status(404).json({ status: false, message: "Popular city not found." });
        }
        // Prepare update object
        const updatedData = {
            city: city || existingCity.city,
            category: category || existingCity.category,
            color: color || existingCity.color,
            abouteCity: abouteCity || existingCity.abouteCity,
            isActive: typeof isActive !== "undefined" ? isActive : existingCity.isActive,
        };
        // Handle banner update if new file is uploaded
        if (req.file) {
            try {
                if (existingCity.banner) {
                    yield (0, cloudinary_1.deleteImage)(existingCity.banner);
                }
                const uploadedBanner = yield (0, cloudinary_1.uploadImage)(req.file.path);
                yield (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
                updatedData.banner = uploadedBanner;
            }
            catch (fileErr) {
                return res.status(500).json({ status: false, message: "Image upload failed", error: fileErr });
            }
        }
        const updatedCity = yield populerCitysModels_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedCity) {
            return res.status(500).json({ status: false, message: "Failed to update popular city." });
        }
        res.status(200).json({ status: true, message: "Popular city updated successfully.", data: updatedCity });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Server error during update.", error });
    }
});
exports.updatePopularCity = updatePopularCity;
