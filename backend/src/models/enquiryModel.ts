import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", default: '' },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    requirement: { type: String },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
