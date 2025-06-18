import express from 'express';
import { createBlog, getAllBlogs, toggleBlogStatus, getBlogById, updateBlog ,deleteBlog} from "../../controllers/admin/blogController";
import { upload } from "../../middleware/upload";

const router = express.Router();

router.post("/create-blog", upload.fields([{ name: "image" }, { name: "banner" }]), createBlog);

router.get("/get-all-blogs", getAllBlogs);

router.post("/:id/toggle-status", toggleBlogStatus);

router.get("/get-all-blog/:id", getBlogById);

router.post("/update-blog/:id", upload.fields([{ name: "image" }, { name: "banner" }]), updateBlog);

router.get("/delete-blog/:id", deleteBlog);


export default router;
