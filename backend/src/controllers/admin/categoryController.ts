import { Request, Response } from "express";
import Category from "../../models/Category";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, status = "active" } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Initialize file paths
    const iconFile = files?.['icon']?.[0];
    const bannerFile = files?.['banner']?.[0];

    // Upload to cloud (or process)
    let iconUrl: string | null = null;
    let bannerUrl: string | null = null;

    if (iconFile) {
      iconUrl = await uploadImage(iconFile.path);
      deleteLocalFile(iconFile.path);
    }

    if (bannerFile) {
      bannerUrl = await uploadImage(bannerFile.path);
      deleteLocalFile(bannerFile.path);
    }

    const newCategory = new Category({
      name,
      icon: iconUrl,
      banner: bannerUrl,
      status,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: (error as Error).message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to get categories" });
  }
};

// Update category by ID
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
console.log("req.files",req.files)
    const iconFile = files?.["icon"]?.[0];
    const bannerFile = files?.["banner"]?.[0];

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    let iconUrl = existingCategory.icon;
    let bannerUrl = existingCategory?.banner;

    if (iconFile) {
      if (existingCategory.icon) await deleteImage(existingCategory.icon);
      iconUrl = await uploadImage(iconFile.path);
      deleteLocalFile(iconFile.path);
    }

    if (bannerFile) {
      if (existingCategory?.banner) await deleteImage(existingCategory.banner);
      bannerUrl = await uploadImage(bannerFile.path);
      deleteLocalFile(bannerFile.path);
    }

    const updateData = {
      name: name || existingCategory.name,
      status: status || existingCategory.status,
      icon: iconUrl,
      banner: bannerUrl,
    };

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, message: "Category updated successfully", category: updatedCategory, });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Failed to update category", error: (error as Error).message, });
  }
};


export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (deletedCategory?.icon) {
      deleteImage(deletedCategory.icon)
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate("subcategories");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ message: "Failed to get category" });
  }
};
