import { Request, Response } from "express";
import Subcategory from "../../models/Subcategory";
import Category from "../../models/Category"; // ✅ 1. Import the Category model
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";


export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, status, category, } = req.body;

    // const mainSubCategories = [];

    // if (req.body["mainSubCategories[0][name]"]) {
    //   for (let i = 0; ; i++) {
    //     const subName = req.body[`mainSubCategories[${i}][name]`];
    //     if (!subName) break;

    //     const subBanner = (req.files as { [key: string]: Express.Multer.File[] })?.[`mainSubCategories[${i}][banner]`];

    //     // const imageUrls: String || null = null;
    //     // for (let file of req.files) {
    //     //   const imageUrl = await uploadImage(file.path);
    //     //   imageUrls.push(imageUrl);
    //     //   deleteLocalFile(file.path);
    //     // }

    //     mainSubCategories.push({ name: subName, banner: subBanner?.[0]?.filename || null, });
    //   }
    // }

    const imageFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.["image"]?.[0];
    const bannerFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.["banner"]?.[0];

    let imageUrl: string | null = null;
    let bannerUrl: string | null = null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile.path);
      deleteLocalFile(imageFile.path);
    }

    if (bannerFile) {
      bannerUrl = await uploadImage(bannerFile.path);
      deleteLocalFile(bannerFile.path);
    }


    const subcategory = new Subcategory({
      name, status, category, image: imageUrl, banner: bannerUrl,
      // mainSubCategories,
    });
    await subcategory.save();

    // ✅ 2. Push subcategory into the corresponding category’s subcategories array
    await Category.findByIdAndUpdate(category, {
      $push: { subcategories: subcategory._id },
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create subcategory" });
  }
};


export const getAllSubcategories = async (req: Request, res: Response) => {
  try {
    const subcategories = await Subcategory.find().populate("category");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};


export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json({ status: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
}

export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate("category");
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subcategory" });
  }
};

export const updateSubcategories = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status, category } = req.body;

    const existingSubcategory = await Subcategory.findById(id);
    if (!existingSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const imageFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.["image"]?.[0];
    const bannerFile = (req.files as { [fieldname: string]: Express.Multer.File[] })?.["banner"]?.[0];

    let imageUrl: string | null = null;
    let bannerUrl: string | null = null;

    if (imageFile) {
      if (existingSubcategory.image) {
        await deleteImage(existingSubcategory.image);
      }
      imageUrl = await uploadImage(imageFile.path);
      deleteLocalFile(imageFile.path);
    }
    if (bannerFile) {
      if (existingSubcategory.banner) {
        await deleteImage(existingSubcategory.banner);
      }
      bannerUrl = await uploadImage(bannerFile.path);
      deleteLocalFile(bannerFile.path);
    }
    // Fetch the existing subcategory

    const prevCategoryId = existingSubcategory.category.toString();

    // Update subcategory fields
    existingSubcategory.name = name;
    existingSubcategory.status = status;
    existingSubcategory.category = category;

    if (imageUrl) existingSubcategory.image = imageUrl;
    if (bannerUrl) existingSubcategory.banner = bannerUrl;

    const updatedSubcategory = await existingSubcategory.save();

    // If category was changed, update the category-subcategory references
    if (prevCategoryId !== category) {
      await Category.findByIdAndUpdate(prevCategoryId, {
        $pull: { subcategories: id },
      });

      await Category.findByIdAndUpdate(category, {
        $addToSet: { subcategories: id },
      });
    }

    res.status(200).json(updatedSubcategory);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Failed to update subcategory" });
  }
};

export const getSubcategoriesByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.id;
    console.log("FFFFFFFFFFFFFFFF:--", category)
    const subcategories = await Subcategory.find({ category }).populate("category");
    if (!subcategories) {
      return res.status(404).json({ message: "Subcategories not found" });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
}