"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// utils/multer.ts
const multer_1 = __importDefault(require("multer"));
// Set up storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // where to store images
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
// File filter (optional)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'), false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter });
exports.default = upload;
