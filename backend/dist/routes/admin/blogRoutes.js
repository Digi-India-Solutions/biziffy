"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../../controllers/admin/blogController");
const upload_1 = require("../../middleware/upload");
const router = express_1.default.Router();
router.post("/create-blog", upload_1.upload.fields([{ name: "image" }, { name: "banner" }]), blogController_1.createBlog);
router.get("/get-all-blogs", blogController_1.getAllBlogs);
router.post("/:id/toggle-status", blogController_1.toggleBlogStatus);
router.get("/get-all-blog/:id", blogController_1.getBlogById);
router.post("/update-blog/:id", upload_1.upload.fields([{ name: "image" }, { name: "banner" }]), blogController_1.updateBlog);
router.get("/delete-blog/:id", blogController_1.deleteBlog);
exports.default = router;
