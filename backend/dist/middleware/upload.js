"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // console.log("file file file file file file", file);
        const uploadPath = path_1.default.join(__dirname, "../upload");
        if (!fs_1.default.existsSync(uploadPath))
            fs_1.default.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // console.log("file file file file file file", file);
        const unique = `${Date.now()}-${file.originalname}`;
        cb(null, unique);
    },
});
exports.upload = (0, multer_1.default)({ storage });
