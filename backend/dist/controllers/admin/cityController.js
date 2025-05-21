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
exports.updateCity = exports.getCityById = exports.deleteCity = exports.getAllCities = exports.createCity = void 0;
const City_1 = __importDefault(require("../../models/City"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const createCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("req.body", req.body);
        const { name, state, color, topCity, badge, isActive, pinCode } = req.body;
        // Check required fields
        if (!name || !state || !color || !pinCode) {
            return res.status(400).json({ error: "Name, state, and color are required" });
        }
        // Prevent duplicates (case-insensitive)
        const existingCity = yield City_1.default.findOne({
            name: { $regex: new RegExp("^" + name + "$", "i") },
            state: { $regex: new RegExp("^" + state + "$", "i") }
        });
        if (existingCity) {
            return res.status(409).json({ error: "City with this name already exists in the selected state" });
        }
        let imageUrl = null;
        // console.log("imageUrl", imageUrl, "req.file", req.file);
        if (req.file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        else {
            return res.status(400).json({ error: "Image is required" });
        }
        const newCity = new City_1.default({
            name, state, cityImage: imageUrl, badge, color, pinCode, country: "INDIA", status: "active",
            topCity: topCity || false,
            isActive: isActive || true
        });
        yield newCity.save();
        res.status(201).json({
            status: true,
            message: "City created successfully",
            city: newCity
        });
    }
    catch (error) {
        console.error("Create City Error:", error);
        res.status(500).json({ error: "Failed to create city" });
    }
});
exports.createCity = createCity;
const getAllCities = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cities = yield City_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, message: "Cities fetched successfully", data: cities });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cities", error });
    }
});
exports.getAllCities = getAllCities;
const deleteCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingCity = yield City_1.default.findById(id);
        if (!existingCity) {
            return res.status(404).json({ error: "City not found" });
        }
        if (existingCity.cityImage) {
            yield (0, cloudinary_1.deleteImage)(existingCity.cityImage);
        }
        const city = yield City_1.default.findByIdAndDelete(id);
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        res.status(200).json({ status: true, message: "City deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete City" });
    }
});
exports.deleteCity = deleteCity;
const getCityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const city = yield City_1.default.findById(id).sort({ createdAt: -1 });
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        res.status(200).json({ status: true, message: "City fetched successfully", data: city });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cities" });
    }
});
exports.getCityById = getCityById;
const updateCity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, state, color, topCity, badge, isActive, pinCode } = req.body;
        if (!id) {
            return res.status(400).json({ error: "City ID is required" });
        }
        const city = yield City_1.default.findById(id);
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        // Prevent duplicate (case-insensitive, excluding current city)
        if (name && state) {
            const duplicateCity = yield City_1.default.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp("^" + name + "$", "i") },
                state: { $regex: new RegExp("^" + state + "$", "i") }
            });
            if (duplicateCity) {
                return res.status(409).json({ error: "Another city with this name and state already exists" });
            }
        }
        // let imageUrl = city.cityImage || [];
        let imageUrl = null;
        // If a new image is uploaded
        if (req.file) {
            if (city.cityImage) {
                yield (0, cloudinary_1.deleteImage)(city.cityImage);
            }
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        // Update fields
        city.name = name || city.name;
        city.state = state || city.state;
        city.color = color || city.color;
        city.badge = badge !== undefined ? badge : city.badge;
        city.cityImage = imageUrl || city.cityImage;
        city.pinCode = pinCode || city.pinCode;
        city.topCity = topCity !== undefined ? topCity : city.topCity;
        city.isActive = isActive !== undefined ? isActive : city.isActive;
        yield city.save();
        res.status(200).json({ status: true, message: "City updated successfully", city });
    }
    catch (error) {
        console.error("Update City Error:", error);
        res.status(500).json({ error: "Failed to update city" });
    }
});
exports.updateCity = updateCity;
