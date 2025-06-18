import { Request, Response } from "express";
import Blog from "../../models/Blog";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";

// Create Blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        const { heading, shortDisc, disc, status } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFile = files?.image?.[0];
        const bannerFile = files?.banner?.[0];

        if (!imageFile || !bannerFile) {
            return res.status(400).json({ status: false, message: "Image and banner are required." });
        }

        const imageUrl = await uploadImage(imageFile.path);
        const bannerUrl = await uploadImage(bannerFile.path);

        deleteLocalFile(imageFile.path);
        deleteLocalFile(bannerFile.path);

        const newBlog = new Blog({
            heading,
            shortDisc,
            disc,
            status,
            image: imageUrl,
            banner: bannerUrl,
        });

        await newBlog.save();

        res.status(201).json({ status: true, data: newBlog });
    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// Get All Blogs
export const getAllBlogs = async (_req: Request, res: Response) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json({ status: true, data: blogs });
    } catch (error) {
        console.error("Fetch All Blogs Error:", error);
        res.status(500).json({ status: false, message: "Failed to fetch blogs" });
    }
};

// Get Single Blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ status: false, message: "Blog not found" });
        res.json({ status: true, data: blog });
    } catch (error) {
        console.error("Fetch Blog By ID Error:", error);
        res.status(500).json({ status: false, message: "Error fetching blog" });
    }
};

// Update Blog
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { heading, shortDisc, disc, status } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ status: false, message: "Blog not found" });



        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFile = files?.image?.[0];
        const bannerFile = files?.banner?.[0];

        if (imageFile) {
            if (blog.image) deleteImage(blog?.image);
            const imageUrl = await uploadImage(imageFile.path);
            deleteLocalFile(imageFile.path);
            blog.image = imageUrl ?? undefined;
        }

        if (bannerFile) {
            if (blog.banner) deleteImage(blog?.banner);
            const bannerUrl = await uploadImage(bannerFile.path);
            deleteLocalFile(bannerFile.path);
            blog.banner = bannerUrl ?? undefined;;
        }

        blog.heading = heading;
        blog.shortDisc = shortDisc;
        blog.disc = disc;
        blog.status = status;

        await blog.save();
        res.json({ status: true, data: blog });
    } catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ status: false, message: "Update failed" });
    }
};

// Delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) { return res.status(204).json({ status: false, message: "Blog not found" }); }

        if (blog.image) await deleteImage(blog?.image);
        if (blog.banner) await deleteImage(blog?.banner);

        await Blog.findByIdAndDelete(req.params.id);

        return res.json({ status: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Delete Blog Error:", error);
        return res.status(500).json({ status: false, message: "Delete failed" });
    }
};

// Toggle Blog Status
export const toggleBlogStatus = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.id;
        const { status } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(blogId, { status }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ status: false, message: "Blog not found" });
        }

        res.status(200).json({ status: true, data: updatedBlog });
    } catch (error: any) {
        console.error("Error toggling blog status:", error);
        res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
};
