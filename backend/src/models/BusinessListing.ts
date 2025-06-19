import { auth } from "google-auth-library";
import mongoose from "mongoose";
import { Schema } from "mongoose";

const ContactPersonSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true, },
  title: String,
  firstName: String,
  lastName: String,
  contactNumber: String,
  whatsappNumber: String,
  email: String,
});

const BusinessDetailsSchema = new mongoose.Schema({
  businessName: { type: String },
  building: { type: String },
  street: { type: String },
  area: { type: String },
  landmark: { type: String },
  city: { type: String },
  state: { type: String },
  pinCode: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  publishedDate: {
    type: String,
    enum: ["Pending", "Published", "Unpublished",],
    default: "Pending",
  },
  yib: { type: String },
});

const TimingSchema = new mongoose.Schema({
  day: String,
  openTime: String,
  openPeriod: String,
  closeTime: String,
  closePeriod: String,
  isOpen: Boolean,
});

const BusinessCategorySchema = new mongoose.Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true, },
  subCategory: [{ type: Schema.Types.ObjectId, ref: "Subcategory", }],
  categoryName: { type: String, required: true },
  subCategoryName: [{ type: String }],
  businessImages: [{ type: String }],
  about: { type: String },
  keywords: [{ type: String }],
  businessService: [{ type: String }],
  serviceArea: [{ type: String }],
});

const UpgradeListingSchema = new mongoose.Schema({
  direction: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
});

const ClickDetailSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth", default: '' }],
});

const ClickCountsSchema = new mongoose.Schema({
  direction: ClickDetailSchema,
  share: ClickDetailSchema,
  contact: ClickDetailSchema,
  website: ClickDetailSchema,
  whatsapp: ClickDetailSchema,
  listings: ClickDetailSchema,
})

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
})

const reviewsSchema = new mongoose.Schema({
  author: { type: String },
  rating: { type: Number },
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
})

const BusinessListingSchema = new mongoose.Schema(
  {
    contactPerson: ContactPersonSchema,
    businessDetails: BusinessDetailsSchema,
    businessTiming: [TimingSchema],
    businessCategory: BusinessCategorySchema,
    upgradeListing: UpgradeListingSchema,
    // clickCounts: clickCountsSchema,
    clickCounts: { type: ClickCountsSchema },
    faq: [faqSchema],
    reviews: [reviewsSchema],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("BusinessListing", BusinessListingSchema);
