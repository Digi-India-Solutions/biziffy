"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocalFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Deletes a file from the local filesystem
 * @param filePath - Relative path from the `src` folder
 */
const deleteLocalFile = (filePath) => {
    console.log("SSSSSSSDDDDDSS:-", filePath);
    try {
        const fileToDelete = path_1.default.join(__dirname, "../../", filePath);
        console.log("SSSSSSSDDDDDSS22222:-", fileToDelete);
        if (fs_1.default.existsSync(fileToDelete)) {
            fs_1.default.unlinkSync(fileToDelete);
            console.log(`Deleted local file: ${fileToDelete}`);
        }
        else {
            console.warn(`File not found: ${fileToDelete}`);
        }
    }
    catch (error) {
        const err = error;
        console.error("Failed to delete local file:", err.message);
    }
};
exports.deleteLocalFile = deleteLocalFile;
