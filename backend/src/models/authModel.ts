import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema
const authSchema = new Schema(
  {
    fullName: { type: String, required: true, },
    email: { type: String, required: true, unique: true, lowercase: true, },
    phone: { type: String, required: true, },
    password: { type: String, required: true, },
    address: { type: String, },
    city: { type: String, },
    state: { type: String, },
    whatsappNumber: { type: String, },
    status: { type: String, enum: ["Active", "Inactive", "pending"], default: "pending", },
    profileImage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


authSchema.pre('save', function (next) {
  this.updatedAt = new Date(Date.now())
  next();
});

const Auth = mongoose.model("Auth", authSchema);
export default Auth;
