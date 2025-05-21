import PinCode from "../../models/PinCodeModel"; // Adjust path as needed
import State from "../../models/StateModel";
import { Request, Response } from "express";

// export const createPincodeByExcel = async (req: Request, res: Response) => {
//     try {
//         const data = req.body;

//         if (!Array.isArray(data) || data.length === 0) {
//             return res.status(400).json({ status: false, message: "Input data must be a non-empty array.", });
//         }

//         const created = [];
//         const duplicates = [];
//         const invalid = [];

//         for (let item of data) {
//             const state = item["State"];
//             const area = item["Area Name"];
//             const pinCode = String(item["pinCode"]);

//             // Validation
//             if (!state || !area || !pinCode) {
//                 invalid.push({ ...item, reason: "Missing required fields" });
//                 continue;
//             }
//             const existStates = await State.find({ name: state })
//             if (!existStates.length <= 1) {
//                 return res.status(400).json({ status: true, message: "State is not Exist", });
//             }
//             // const exists = await PinCode.findOne({ stateName: new RegExp(`^${state}$`, "i"), area: new RegExp(`^${area}$`, "i"), pinCode, });

//             if (exists) {
//                 duplicates.push({ ...item, reason: "Already exists" });
//                 continue;
//             }

//             Create
//             const newPin = await PinCode.create({ stateName: state.trim(), area: area.trim(), pinCode: pinCode.trim(), });

//             created.push(newPin);
//         }

//         return res.status(200).json({ status: true, message: "Pin codes processed", createdCount: created.length, duplicateCount: duplicates.length, invalidCount: invalid.length, created, duplicates, invalid, });
//     } catch (err) {
//         console.error("Error uploading pin codes:", err);
//         return res.status(500).json({ status: false, message: "Server error while uploading pin codes", });
//     }
// };

export const createPincodeByExcel = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Input data must be a non-empty array.",
            });
        }

        const created: any[] = [];
        const duplicates: any[] = [];
        const invalid: any[] = [];

        for (const item of data) {
            const state = item["State"];
            const area = item["Area Name"];
            const pinCode = String(item["pinCode"]).trim();

            // Validate required fields
            if (!state || !area || !pinCode) {
                invalid.push({ ...item, reason: "Missing required fields" ,status: false });
                continue;
            }

            // Check if the state exists
            const existingStates = await State.findOne({ name: new RegExp(`^${state.trim()}$`, "i") });
            if (!existingStates) {
                invalid.push({ ...item, reason: "State does not exist", status: false });
                continue;
            }

            // Check for existing pincode
            const exists = await PinCode.findOne({
                stateName: new RegExp(`^${state.trim()}$`, "i"),
                area: new RegExp(`^${area.trim()}$`, "i"),
                pinCode,
            });

            if (exists) {
                duplicates.push({ ...item, reason: "Already exists" });
                continue;
            }

            // Create new pincode
            const newPin = await PinCode.create({
                stateName: state.trim(),
                area: area.trim(),
                pinCode,
            });

            created.push(newPin);
        }

        return res.status(200).json({
            status: true,
            message: "Pin codes processed",
            createdCount: created.length,
            duplicateCount: duplicates.length,
            invalidCount: invalid.length,
            created,
            duplicates,
            invalid,
        });
    } catch (err) {
        console.error("Error uploading pin codes:", err);
        return res.status(500).json({
            status: false,
            message: "Server error while uploading pin codes",
        });
    }
};

export const getAllPinCodes = async (req: Request, res: Response) => {
    try {
        const pinCodes = await PinCode.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
};

export const createPincode = async (req: Request, res: Response) => {
    try {
        const { stateName, area, pinCode } = req.body;
        console.log("BODY:- ", req.body);
        const newPin = await PinCode.create({ stateName, area, pinCode, });
        return res.status(200).json({ status: true, message: "Pin code created successfully", data: newPin, });
    } catch (err) {
        console.error("Error creating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while creating pin code", });
    }
}

export const getAllPinCodesById = async (req: Request, res: Response) => {
    try {
        const pinCodes = await PinCode.findById(req.params.id).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, message: "Pin codes fetched successfully", pinCodes, });
    } catch (err) {
        console.error("Error fetching pin codes:", err);
        return res.status(500).json({ status: false, message: "Server error while fetching pin codes", });
    }
}

export const updatePincode = async (req: Request, res: Response) => {
    try {
        const { stateName, area, pinCode, isActive } = req.body;
        const updatedPin = await PinCode.findByIdAndUpdate(req.params.id, { stateName, area, pinCode, isActive }, { new: true });
        return res.status(200).json({ status: true, message: "Pin code updated successfully", data: updatedPin, });
    } catch (err) {
        console.error("Error updating pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while updating pin code", });
    }
}

export const deletePincode = async (req: Request, res: Response) => {
    try {
        const deletedPin = await PinCode.findByIdAndDelete(req.params.id);
        return res.status(200).json({ status: true, message: "Pin code deleted successfully", data: deletedPin, });
    } catch (err) {
        console.error("Error deleting pin code:", err);
        return res.status(500).json({ status: false, message: "Server error while deleting pin code", });
    }
}

export const getAreapincodeByState = async (req: Request, res: Response) => {
    try {
        const { state } = req?.query;

        console.log("state-state-", state)

        if (!state) {
            return res.status(400).json({ message: "State is required" });
        }

        const data = await PinCode.find({ stateName: state });
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching area-pincode:", err);
        res.status(500).json({ message: "Server Error" });
    }
}