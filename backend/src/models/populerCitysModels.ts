// models/PopularCity.js
import mongoose from "mongoose";

const popularCitySchema = new mongoose.Schema({
  banner: { type: String, required: true }, // Store file path or Cloudinary URL
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
  color: { type: String, default: "#6E59A5" },
  abouteCity: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("PopularCity", popularCitySchema);
