import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true, default: "INDIA" },
  cityImage: { type: String, required: true },
  badge: { type: String },
  color: { type: String, required: true },
  pinCode: { type: String, required: true },
  state: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  topCity: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("City", citySchema);
