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
exports.toggleBlogStatus = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../../models/Blog"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
// Create Blog
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { heading, shortDisc, disc, status } = req.body;
        const files = req.files;
        const imageFile = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
        const bannerFile = (_b = files === null || files === void 0 ? void 0 : files.banner) === null || _b === void 0 ? void 0 : _b[0];
        if (!imageFile || !bannerFile) {
            return res.status(400).json({ status: false, message: "Image and banner are required." });
        }
        const imageUrl = yield (0, cloudinary_1.uploadImage)(imageFile.path);
        const bannerUrl = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
        (0, deleteImageFromLocalFolder_1.deleteLocalFile)(imageFile.path);
        (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
        const newBlog = new Blog_1.default({
            heading,
            shortDisc,
            disc,
            status,
            image: imageUrl,
            banner: bannerUrl,
        });
        yield newBlog.save();
        res.status(201).json({ status: true, data: newBlog });
    }
    catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
});
exports.createBlog = createBlog;
// Get All Blogs
const getAllBlogs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield Blog_1.default.find().sort({ createdAt: -1 });
        res.json({ status: true, data: blogs });
    }
    catch (error) {
        console.error("Fetch All Blogs Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch blogs" });
    }
});
exports.getAllBlogs = getAllBlogs;
// Get Single Blog by ID
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog)
            return res.status(404).json({ status: false, message: "Blog not found" });
        res.json({ status: true, data: blog });
    }
    catch (error) {
        console.error("Fetch Blog By ID Error:", error);
        res.status(500).json({ status: false, message: "Error fetching blog" });
    }
});
exports.getBlogById = getBlogById;
// Update Blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { heading, shortDisc, disc, status } = req.body;
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog)
            return res.status(404).json({ status: false, message: "Blog not found" });
        const files = req.files;
        const imageFile = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
        const bannerFile = (_b = files === null || files === void 0 ? void 0 : files.banner) === null || _b === void 0 ? void 0 : _b[0];
        if (imageFile) {
            if (blog.image)
                (0, cloudinary_1.deleteImage)(blog === null || blog === void 0 ? void 0 : blog.image);
            const imageUrl = yield (0, cloudinary_1.uploadImage)(imageFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(imageFile.path);
            blog.image = imageUrl !== null && imageUrl !== void 0 ? imageUrl : undefined;
        }
        if (bannerFile) {
            if (blog.banner)
                (0, cloudinary_1.deleteImage)(blog === null || blog === void 0 ? void 0 : blog.banner);
            const bannerUrl = yield (0, cloudinary_1.uploadImage)(bannerFile.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(bannerFile.path);
            blog.banner = bannerUrl !== null && bannerUrl !== void 0 ? bannerUrl : undefined;
            ;
        }
        blog.heading = heading;
        blog.shortDisc = shortDisc;
        blog.disc = disc;
        blog.status = status;
        yield blog.save();
        res.json({ status: true, data: blog });
    }
    catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ status: false, message: "Update failed" });
    }
});
exports.updateBlog = updateBlog;
// Delete Blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield Blog_1.default.findById(req.params.id);
        if (!blog) {
            return res.status(204).json({ status: false, message: "Blog not found" });
        }
        if (blog.image)
            yield (0, cloudinary_1.deleteImage)(blog === null || blog === void 0 ? void 0 : blog.image);
        if (blog.banner)
            yield (0, cloudinary_1.deleteImage)(blog === null || blog === void 0 ? void 0 : blog.banner);
        yield Blog_1.default.findByIdAndDelete(req.params.id);
        return res.json({ status: true, message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error("Delete Blog Error:", error);
        return res.status(500).json({ status: false, message: "Delete failed" });
    }
});
exports.deleteBlog = deleteBlog;
// Toggle Blog Status
const toggleBlogStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.id;
        const { status } = req.body;
        const updatedBlog = yield Blog_1.default.findByIdAndUpdate(blogId, { status }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }
        res.status(200).json({ status: true, data: updatedBlog });
    }
    catch (error) {
        console.error("Error toggling blog status:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
});
exports.toggleBlogStatus = toggleBlogStatus;
