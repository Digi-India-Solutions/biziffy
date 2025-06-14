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
exports.getAreapincodeByState = exports.deletePincode = exports.updatePincode = exports.getAllPinCodesById = exports.createPincode = exports.getAllPinCodes = exports.createPincodeByExcel = void 0;
const PinCodeModel_1 = __importDefault(require("../../models/PinCodeModel")); // Adjust path as needed
const StateModel_1 = __importDefault(require("../../models/StateModel"));
// export const createPincodeByExcel = async (req: Request, res: Response) => {
//     try {
//         const data = req.body;
//         if (!Array.isArray(data) || data.length === 0) {
//             return res.status(400).json({ status: false, message: "Input data must be a non-empty array.", });
//         }
//         const created = [];
//         const duplicates = [];
//         const invalid = [];
//         for (let item of data) {
//             const state = item["State"];
//             const area = item["Area Name"];
//             const pinCode = String(item["pinCode"]);
//             // Validation
//             if (!state || !area || !pinCode) {
//                 invalid.push({ ...item, reason: "Missing required fields" });
//                 continue;
//             }
//             const existStates = await State.find({ name: state })
//             if (!existStates.length <= 1) {
//                 return res.status(400).json({ status: true, message: "State is not Exist", });
//             }
//             // const exists = await PinCode.findOne({ stateName: new RegExp(`^${state}$`, "i"), area: new RegExp(`^${area}$`, "i"), pinCode, });
//             if (exists) {
//                 duplicates.push({ ...item, reason: "Already exists" });
//                 continue;
//             }
//             Create
//             const newPin = await PinCode.create({ stateName: state.trim(), area: area.trim(), pinCode: pinCode.trim(), });
//             created.push(newPin);
//         }
//         return res.status(200).json({ status: true, message: "Pin codes processed", createdCount: created.length, duplicateCount: duplicates.length, invalidCount: invalid.length, created, duplicates, invalid, });
//     } catch (err) {
//         console.error("Error uploading pin codes:", err);
//         return res.status(500).json({ status: false, message: "Server error while uploading pin codes", });
//     }
// };
const createPincodeByExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Input data must be a non-empty array.",
            });
        }
        const created = [];
        const duplicates = [];
        const invalid = [];
        for (const item of data) {
            const state = item["State"];
            const area = item["Area Name"];
            const pinCode = String(item["pinCode"]).trim();
            // Validate required fields
            if (!state || !area || !pinCode) {
                invalid.push(Object.assign(Object.assign({}, item), { reason: "Missing required fields", status: false }));
                continue;
            }
            // Check if the state exists
            const existingStates = yield StateModel_1.default.findOne({ name: new RegExp(`^${state.trim()}$`, "i") });
            if (!existingStates) {
                invalid.push(Object.assign(Object.assign({}, item), { reason: "State does not exist", status: false }));
                continue;
            }
            // Check for existing pincode
            const exists = yield PinCodeModel_1.default.findOne({
                stateName: new RegExp(`^${state.trim()}$`, "i"),
                area: new RegExp(`^${area.trim()}$`, "i"),
                pinCode,
            });
            if (exists) {
                duplicates.push(Object.assign(Object.assign({}, item), { reason: "Already exists" }));
                continue;
            }
            // Create new pincode
            const newPin = yield PinCodeModel_1.default.create({
                stateName: state.trim(),
                area: area.trim(),
                pinCode,
            });
            created.push(newPin);
        }
        return res.status(200).json({
            status: true,
            message: "Pin codes processed",
            createdCount: created.length,
            duplicateCount: duplicates.length,
            invalidCount: invalid.length,
            created,
            duplicates,
            invalid,
        });
    }
    catch (err) {
        console.error("Error uploading pin codes:", err);
        return res.status(500).json({
            status: false,
            message: "Server error while uploading pin codes",
        });
    }
});
exports.createPincodeByExcel = createPincodeByExcel;
const getAllPinCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pinCodes = yield PinCodeModel_1.default.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    }
    catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
});
exports.getAllPinCodes = getAllPinCodes;
const createPincode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateName, area, pinCode } = req.body;
        console.log("BODY:- ", req.body);
        const newPin = yield PinCodeModel_1.default.create({ stateName, area, pinCode, });
        return res.status(200).json({ status: true, message: "Pin code created successfully", data: newPin, });
    }
    catch (err) {
        console.error("Error creating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while creating pin code", });
    }
});
exports.createPincode = createPincode;
const getAllPinCodesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pinCodes = yield PinCodeModel_1.default.findById(req.params.id).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    }
    catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
});
exports.getAllPinCodesById = getAllPinCodesById;
const updatePincode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stateName, area, pinCode, isActive } = req.body;
        const updatedPin = yield PinCodeModel_1.default.findByIdAndUpdate(req.params.id, { stateName, area, pinCode, isActive }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code updated successfully", data: updatedPin, });
    }
    catch (err) {
        console.error("Error updating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code", });
    }
});
exports.updatePincode = updatePincode;
const deletePincode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPin = yield PinCodeModel_1.default.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: true, message: "Pin code deleted successfully", data: deletedPin, });
    }
    catch (err) {
        console.error("Error deleting pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while deleting pin code", });
    }
});
exports.deletePincode = deletePincode;
const getAreapincodeByState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state } = req === null || req === void 0 ? void 0 : req.body;
        console.log("state-state-", state);
        if (!state) {
            return res.status(400).json({ message: "State is required" });
        }
        const data = yield PinCodeModel_1.default.find({ stateName: state });
        res.status(200).json(data);
    }
    catch (err) {
        console.error("Error fetching area-pincode:", err);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getAreapincodeByState = getAreapincodeByState;
