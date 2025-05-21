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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
// Cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECKRET,
});
// Upload image to Cloudinary
const uploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(file);
        // console.log(result);
        return result.secure_url;
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
});
exports.uploadImage = uploadImage;
// Delete image(s) from Cloudinary
const deleteImage = (imageUrls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
        for (const url of urls) {
            if (typeof url === "string") {
                const filename = url.split("/").pop();
                const publicId = filename === null || filename === void 0 ? void 0 : filename.split(".")[0];
                if (publicId) {
                    yield cloudinary_1.v2.uploader.destroy(publicId);
                    // console.log(`Image deleted successfully: ${publicId}`);
                }
                else {
                    console.warn(`Could not extract publicId from URL: ${url}`);
                }
            }
        }
    }
    catch (error) {
        console.error("Failed to delete image(s) from Cloudinary:", error);
    }
});
exports.deleteImage = deleteImage;
