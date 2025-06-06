import { Request, Response } from "express";
import Advertisement from "../../models/Advertisement";
import path from "path";
import fs from "fs";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";

// Create Advertisement
export const createAdvertisement = async (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      category,
      subCategory,
      redirectUrl,
      status,
      categoryName,
      subCategoryName,
    } = req.body;

    // Validate required fields
    if (!title || !type || !category || !categoryName || !status) {
      return res.status(400).json({ status: false, error: "Missing required fields" });
    }

    // Handle image upload
    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);

      if (!imageUrl) {
        return res.status(500).json({ status: false, error: "Image upload failed" });
      }
    } else {
      return res.status(400).json({ status: false, error: "Image is required" });
    }

    // Create new advertisement
    const newAd = new Advertisement({
      title, type, category,
      subCategory: subCategory || null,
      redirectUrl: redirectUrl || "",
      status, image: imageUrl, categoryName,
      subCategoryName: subCategoryName || null,
    });

    const savedAd = await newAd.save();

    return res.status(201).json({ status: true, message: "Advertisement created", data: savedAd });

  } catch (err: any) {
    console.error("❌ Error creating advertisement:", err);
    return res.status(500).json({
      status: false,
      error: "Failed to create advertisement",
      details: err.message,
    });
  }
};
// Get All Advertisements
export const getAllAdvertisements = async (req: Request, res: Response) => {
  try {
    const ads = await Advertisement.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (err: any) {
    console.error("Error fetching advertisements:", err);
    res.status(500).json({ error: "Failed to fetch advertisements", details: err.message || err });
  }
};

// Get Advertisement by ID
export const getAdvertisementById = async (req: Request, res: Response) => {
  try {
    console.log("req.params.id", req.params.id)
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Advertisement not found" });
    res.status(200).json(ad);
  } catch (err: any) {
    console.error("Error fetching advertisement by ID:", err);
    res.status(500).json({ error: "Failed to fetch advertisement", details: err.message || err });
  }
};

// Update Advertisement
export const updateAdvertisement = async (req: Request, res: Response) => {
  try {
    const {
      title, type, category, subCategory, redirectUrl, status, categoryName, subCategoryName,
    } = req.body;

    const { id } = req.params;
    const existingAd = await Advertisement.findById(id);

    if (!existingAd) {
      return res.status(404).json({ status: false, error: "Advertisement not found" });
    }

    // Handle new image upload
    if (req.file) {
      if (existingAd.image) {
        deleteImage(existingAd.image);
      }

      const uploadedUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);

      if (!uploadedUrl) {
        return res.status(500).json({ status: false, error: "Image upload failed" });
      }

      existingAd.image = uploadedUrl; // ✅ Fixed assignment
    }

    // Update fields conditionally
    if (title) existingAd.title = title;
    if (type) existingAd.type = type;
    if (category) existingAd.category = category;
    if (subCategory !== undefined) existingAd.subCategory = subCategory;
    if (redirectUrl !== undefined) existingAd.redirectUrl = redirectUrl;
    if (status) existingAd.status = status;
    if (categoryName) existingAd.categoryName = categoryName;
    if (subCategoryName !== undefined) existingAd.subCategoryName = subCategoryName;

    const updatedAd = await existingAd.save();

    return res.status(200).json({ status: true, message: "Advertisement updated successfully", data: updatedAd, });

  } catch (err: any) {
    console.error("❌ Error updating advertisement:", err);
    return res.status(500).json({
      status: false,
      error: "Failed to update advertisement",
      details: err.message,
    });
  }
};

// Delete Advertisement
export const deleteAdvertisement = async (req: Request, res: Response) => {
  try {
    console.log("req.params.id:-", req.params.id)
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Advertisement not found" });

    // Delete image file
    if (ad.image) {
      deleteImage(ad?.image)
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting advertisement:", err);
    res.status(500).json({ error: "Failed to delete advertisement", details: err.message || err });
  }
};

export const changestatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Advertisement ID is required" });
    }

    // Find the current status only (lean to avoid hydration)
    const ad = await Advertisement.findById(id).lean();

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Toggle status
    const newStatus = ad.status === "Active" ? "Inactive" : "Active";

    // Update only status without triggering full validation
    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: false } 
    );

    res.status(200).json({ message: `Status updated to ${newStatus}`, advertisement: updatedAd, });
  } catch (err: any) {
    console.error("Error changing status:", err);
    res.status(500).json({ error: "Failed to change status", details: err.message || err, });
  }
};