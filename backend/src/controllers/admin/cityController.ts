import { Request, Response } from "express";
import City from "../../models/City";
import ShortUniqueId from "short-unique-id";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";

export const createCity = async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    const { name, state, color, topCity, badge, isActive, pinCode } = req.body;

    // Check required fields
    if (!name || !state || !color || !pinCode) {
      return res.status(400).json({ error: "Name, state, and color are required" });
    }

    // Prevent duplicates (case-insensitive)
    const existingCity = await City.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
      state: { $regex: new RegExp("^" + state + "$", "i") }
    });

    if (existingCity) {
      return res.status(409).json({ error: "City with this name already exists in the selected state" });
    }

    let imageUrl: string | null = null;
    // console.log("imageUrl", imageUrl, "req.file", req.file);
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);
    } else {
      return res.status(400).json({ error: "Image is required" });
    }


    const newCity = new City({
      name, state, cityImage: imageUrl, badge, color, pinCode, country: "INDIA", status: "active",
      topCity: topCity || false,
      isActive: isActive || true
    });

    await newCity.save();

    res.status(201).json({
      status: true,
      message: "City created successfully",
      city: newCity
    });
  } catch (error) {
    console.error("Create City Error:", error);
    res.status(500).json({ error: "Failed to create city" });
  }
};

export const getAllCities = async (_req: Request, res: Response) => {
  try {
    const cities = await City.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, message: "Cities fetched successfully", data: cities });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities", error });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existingCity = await City.findById(id);
    if (!existingCity) {
      return res.status(404).json({ error: "City not found" });
    }
    if (existingCity.cityImage) {
      await deleteImage(existingCity.cityImage);
    }
    const city = await City.findByIdAndDelete(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json({ status: true, message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete City" });
  }
}

export const getCityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id).sort({ createdAt: -1 });
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.status(200).json({ status: true, message: "City fetched successfully", data: city });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}

export const updateCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, state, color, topCity, badge, isActive, pinCode } = req.body;

    if (!id) {
      return res.status(400).json({ error: "City ID is required" });
    }

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    // Prevent duplicate (case-insensitive, excluding current city)
    if (name && state) {
      const duplicateCity = await City.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp("^" + name + "$", "i") },
        state: { $regex: new RegExp("^" + state + "$", "i") }
      });

      if (duplicateCity) {
        return res.status(409).json({ error: "Another city with this name and state already exists" });
      }
    }

    // let imageUrl = city.cityImage || [];
    let imageUrl: string | null = null;

    // If a new image is uploaded
    if (req.file) {
      if (city.cityImage) {
        await deleteImage(city.cityImage);
      }
      imageUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);
    }

    // Update fields
    city.name = name || city.name;
    city.state = state || city.state;
    city.color = color || city.color;
    city.badge = badge !== undefined ? badge : city.badge;
    city.cityImage = imageUrl || city.cityImage;
    city.pinCode = pinCode || city.pinCode;
    city.topCity = topCity !== undefined ? topCity : city.topCity;
    city.isActive = isActive !== undefined ? isActive : city.isActive;

    await city.save();

    res.status(200).json({ status: true, message: "City updated successfully", city });
  } catch (error) {
    console.error("Update City Error:", error);
    res.status(500).json({ error: "Failed to update city" });
  }
};