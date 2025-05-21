import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import PopularCity from "../../models/populerCitysModels";
import { Request, Response } from "express";

export const addPopularCity = async (req: Request, res: Response): Promise<void> => {
    try {
        const { city, category, color, abouteCity, isActive } = req.body;
        console.log("XXXXXXXXXX", req.file);
        const bannerFile = req.file;

        if (!bannerFile) {
            res.status(400).json({ status: false, message: "Banner is required" });
            return;
        }

        // Upload image to Cloudinary
        const uploadedBanner = await uploadImage(bannerFile.path);
        // Remove temp file
        deleteLocalFile(bannerFile.path);

        // Create new city document
        const newCity = new PopularCity({
            city, category, color, abouteCity,
            isActive: isActive === "true" || isActive === true,
            banner: uploadedBanner
        });

        await newCity.save();

        res.status(201).json({ status: true, message: "Popular City added successfully", data: newCity });

    } catch (err) {
        console.error("Add Popular City Error:", err);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

export const getAllPopularCities = async (req: Request, res: Response) => {
    try {
        const data = await PopularCity.find()
            .populate("city")
            .populate("category")
            .sort({ createdAt: -1 });

        res.json({ status: true, data });
    } catch (err) {
        res.status(500).json({ status: false, message: "Failed to fetch" });
    }
};

export const deletePopularCity = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const city = await PopularCity.findByIdAndDelete(id);

        if (!city) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        // If banner is a local path (optional), delete it
        if (city?.banner) {
            deleteImage(city.banner)
        }

        res.json({ status: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: false, message: "Delete failed" });
    }
};
// // Get One
export const getSinglePopularCity = async (req: Request, res: Response) => {
    try {
        const city = await PopularCity.findById(req.params.id)
            .populate("city")
            .populate("category");

        if (!city) {
            return res.status(404).json({ status: false, message: "Not found" });
        }

        res.json({ status: true, data: city });
    } catch (err) {
        res.status(500).json({ status: false, message: "Error fetching city" });
    }
};


export const updatePopularCity = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { city, category, color, abouteCity, isActive } = req.body;

        const existingCity = await PopularCity.findById(id);
        if (!existingCity) {
            return res.status(404).json({ status: false, message: "Popular city not found." });
        }

        // Prepare update object
        const updatedData: any = {
            city: city || existingCity.city,
            category: category || existingCity.category,
            color: color || existingCity.color,
            abouteCity: abouteCity || existingCity.abouteCity,
            isActive: typeof isActive !== "undefined" ? isActive : existingCity.isActive,
        };

        // Handle banner update if new file is uploaded
        if (req.file) {
            try {
                if (existingCity.banner) {
                    await deleteImage(existingCity.banner);
                }
                const uploadedBanner = await uploadImage(req.file.path);
                await deleteLocalFile(req.file.path);
                updatedData.banner = uploadedBanner;
            } catch (fileErr) {
                return res.status(500).json({ status: false, message: "Image upload failed", error: fileErr });
            }
        }

        const updatedCity = await PopularCity.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedCity) {
            return res.status(500).json({ status: false, message: "Failed to update popular city." });
        }

        res.status(200).json({ status: true, message: "Popular city updated successfully.", data: updatedCity });

    } catch (error) {
        res.status(500).json({ status: false, message: "Server error during update.", error });
    }
};


