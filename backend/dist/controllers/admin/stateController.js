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
exports.updateState = exports.getAllStateById = exports.deleteState = exports.getAllState = exports.createState = void 0;
const StateModel_1 = __importDefault(require("../../models/StateModel"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const createState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(200).json({ status: false, error: "Name  are required" });
        }
        const existingState = yield StateModel_1.default.findOne({ name });
        if (existingState) {
            return res.status(201).json({ status: false, error: "State with this name already exists" });
        }
        const uniqueNumId = new short_unique_id_1.default({ length: 6, dictionary: "number" });
        const currentUniqueId = uniqueNumId.rnd();
        let uniqueProductId = `State-${currentUniqueId}`;
        let imageUrl = null;
        if (req.file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        const state = new StateModel_1.default({ name, stateImage: imageUrl, uniqueStateId: uniqueProductId });
        yield state.save();
        res.status(201).json({ status: true, message: "State created successfully", state });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create State" });
    }
});
exports.createState = createState;
const getAllState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const state = yield StateModel_1.default.find().sort({ createdAt: -1 });
        console.log("state-", state);
        res.status(200).json({ status: true, message: "State fetched successfully", data: state });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cities" });
    }
});
exports.getAllState = getAllState;
const deleteState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const state = yield StateModel_1.default.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({ error: "State not found" });
        }
        res.status(200).json({ status: true, message: "State deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete State" });
    }
});
exports.deleteState = deleteState;
const getAllStateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const state = yield StateModel_1.default.findById(id).sort({ createdAt: -1 });
        if (!state) {
            return res.status(404).json({ error: "State not found" });
        }
        res.status(200).json({ status: true, message: "State fetched successfully", data: state });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cities" });
    }
});
exports.getAllStateById = getAllStateById;
const updateState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, isActive } = req.body;
        const existingState = yield StateModel_1.default.findById(id);
        if (!existingState) {
            return res.status(404).json({ status: false, error: "State not found" });
        }
        // Check if new name already exists for a different ID
        const duplicateState = yield StateModel_1.default.findOne({ name, _id: { $ne: id } });
        if (duplicateState) {
            return res.status(409).json({ status: false, error: "State name already exists" });
        }
        let imageUrl = null;
        // let imageUrl = existingState.stateImage || [];
        if (req.file) {
            // Delete old image if exists
            if (existingState.stateImage) {
                yield (0, cloudinary_1.deleteImage)(existingState.stateImage);
            }
            // Upload new image and remove local file
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            yield (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        const updatedState = yield StateModel_1.default.findByIdAndUpdate(id, {
            name,
            stateImage: imageUrl,
            isActive: isActive !== undefined ? isActive : existingState.isActive
        }, { new: true });
        res.status(200).json({ status: true, message: "State updated successfully", data: updatedState, });
    }
    catch (error) {
        console.error("Update state error:", error);
        res.status(500).json({ status: false, error: "Failed to update state" });
    }
});
exports.updateState = updateState;
// export const addMultipleCities = async (req: Request, res: Response) => {
//   try {
//     const cities = req.body; // expecting an array of city objects
//     if (!Array.isArray(cities) || cities.length === 0) {
//       return res.status(400).json({ message: "No cities provided" });
//     }
//     const insertedCities = await AdvertiseCity.insertMany(cities);
//     res.status(201).json({
//       success: true,
//       message: "Cities added successfully",
//       data: insertedCities,
//     });
//   } catch (error) {
//     console.error("Error adding cities:", error);
//     res.status(500).json({ message: "Failed to add cities" });
//   }
// };
