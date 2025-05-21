import mongoose from "mongoose";

const pinCodeSchema = new mongoose.Schema(
    {
        stateName: {
            type: String,
            required: true,
            trim: true,
        },
        area: {
            type: String,
            required: true,
        },
        pinCode: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("PinCode", pinCodeSchema);
