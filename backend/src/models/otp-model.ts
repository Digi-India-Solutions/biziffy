import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  otpExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema: Schema = new Schema<IOtp>({
  email: {
    type: String,
    trim: true,
    default: '',
  },
  otp: {
    type: String,
    trim: true,
    default: '',
  },
  otpExpiry: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update the updatedAt field
otpSchema.pre<IOtp>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Otp = mongoose.model<IOtp>('Otp', otpSchema);
export default Otp;