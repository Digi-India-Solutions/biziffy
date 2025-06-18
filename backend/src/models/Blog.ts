import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a Blog document
export interface IBlog extends Document {
  heading: string;
  shortDisc: string;
  disc: string;
  image?: string;
  banner?: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const blogSchema = new Schema<IBlog>(
  {
    heading: { type: String, required: true },
    shortDisc: { type: String, required: true },
    disc: { type: String, required: true },
    image: { type: String, default: "" },   // Optional with default fallback
    banner: { type: String, default: "" },  // Optional with default fallback
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Export the model
const Blog = mongoose.model<IBlog>("Blog", blogSchema);
export default Blog;
