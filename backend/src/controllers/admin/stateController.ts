import { Request, Response } from "express";
import State from "../../models/StateModel";
import { deleteImage, uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import ShortUniqueId from "short-unique-id";

export const createState = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(200).json({ status: false, error: "Name  are required" });
    }
    const existingState = await State.findOne({ name });
    if (existingState) {
      return res.status(201).json({ status: false, error: "State with this name already exists" });
    }

    const uniqueNumId = new ShortUniqueId({ length: 6, dictionary: "number" });
    const currentUniqueId = uniqueNumId.rnd();
    let uniqueProductId = `State-${currentUniqueId}`

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);
    }
    const state = new State({ name, stateImage: imageUrl, uniqueStateId: uniqueProductId });
    await state.save();
    res.status(201).json({ status: true, message: "State created successfully", state });
  } catch (error) {
    res.status(500).json({ error: "Failed to create State" });
  }
};

export const getAllState = async (req: Request, res: Response) => {
  try {
    const state = await State.find().sort({ createdAt: -1 });
    console.log("state-", state);
    res.status(200).json({ status: true, message: "State fetched successfully", data: state });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

export const deleteState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const state = await State.findByIdAndDelete(id);
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(200).json({ status: true, message: "State deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete State" });
  }
}

export const getAllStateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const state = await State.findById(id).sort({ createdAt: -1 });
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    res.status(200).json({ status: true, message: "State fetched successfully", data: state });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
}

export const updateState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const existingState = await State.findById(id);
    if (!existingState) {
      return res.status(404).json({ status: false, error: "State not found" });
    }

    // Check if new name already exists for a different ID
    const duplicateState = await State.findOne({ name, _id: { $ne: id } });
    if (duplicateState) {
      return res.status(409).json({ status: false, error: "State name already exists" });
    }
    let imageUrl: string | null = null;

    // let imageUrl = existingState.stateImage || [];

    if (req.file) {
      // Delete old image if exists
      if (existingState.stateImage) {
        await deleteImage(existingState.stateImage);
      }

      // Upload new image and remove local file
      imageUrl = await uploadImage(req.file.path);
      await deleteLocalFile(req.file.path);
    }

    const updatedState = await State.findByIdAndUpdate(
      id,
      {
        name,
        stateImage: imageUrl,
        isActive: isActive !== undefined ? isActive : (existingState as any).isActive
      },
      { new: true }
    );

    res.status(200).json({ status: true, message: "State updated successfully", data: updatedState, });
  } catch (error) {
    console.error("Update state error:", error);
    res.status(500).json({ status: false, error: "Failed to update state" });
  }
};
// export const addMultipleCities = async (req: Request, res: Response) => {
//   try {
//     const cities = req.body; // expecting an array of city objects
//     if (!Array.isArray(cities) || cities.length === 0) {
//       return res.status(400).json({ message: "No cities provided" });
//     }

//     const insertedCities = await AdvertiseCity.insertMany(cities);

//     res.status(201).json({
//       success: true,
//       message: "Cities added successfully",
//       data: insertedCities,
//     });
//   } catch (error) {
//     console.error("Error adding cities:", error);
//     res.status(500).json({ message: "Failed to add cities" });
//   }
// };
