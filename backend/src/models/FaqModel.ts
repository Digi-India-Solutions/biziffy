import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
export default Faq;