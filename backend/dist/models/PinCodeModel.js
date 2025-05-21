"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pinCodeSchema = new mongoose_1.default.Schema({
    stateName: {
        type: String,
        required: true,
        trim: true,
    },
    area: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("PinCode", pinCodeSchema);
