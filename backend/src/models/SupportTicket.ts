import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true }, // Fixed typo: useId → userId
    supportType: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, enum: ["pending", "open", "completed"], default: "pending", },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
