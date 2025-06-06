import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },
    categoryName: {
      type: String,
      default: null,
      trim: true,
    },
    subCategoryName: {
      type: String,
      default: null,
      trim: true,
    },
    redirectUrl: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Advertisement", AdvertisementSchema);
