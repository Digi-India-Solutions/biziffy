"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const ContactPersonSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_2.Schema.Types.ObjectId, ref: "Auth", required: true, },
    title: String,
    firstName: String,
    lastName: String,
    contactNumber: String,
    whatsappNumber: String,
    email: String,
});
const BusinessDetailsSchema = new mongoose_1.default.Schema({
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
const TimingSchema = new mongoose_1.default.Schema({
    day: String,
    openTime: String,
    openPeriod: String,
    closeTime: String,
    closePeriod: String,
    isOpen: Boolean,
});
const BusinessCategorySchema = new mongoose_1.default.Schema({
    category: { type: mongoose_2.Schema.Types.ObjectId, ref: "Category", required: true, },
    subCategory: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "Subcategory", }],
    categoryName: { type: String, required: true },
    subCategoryName: [{ type: String }],
    businessImages: [{ type: String }],
    about: { type: String },
    keywords: [{ type: String }],
    businessService: [{ type: String }],
    serviceArea: [{ type: String }],
});
const UpgradeListingSchema = new mongoose_1.default.Schema({
    direction: { type: String },
    website: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
});
const ClickDetailSchema = new mongoose_1.default.Schema({
    count: { type: Number, default: 0 },
    user: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth", default: '' }],
});
const ClickCountsSchema = new mongoose_1.default.Schema({
    direction: ClickDetailSchema,
    share: ClickDetailSchema,
    contact: ClickDetailSchema,
    website: ClickDetailSchema,
    whatsapp: ClickDetailSchema,
    listings: ClickDetailSchema,
});
const faqSchema = new mongoose_1.default.Schema({
    question: { type: String },
    answer: { type: String },
});
const reviewsSchema = new mongoose_1.default.Schema({
    author: { type: String },
    rating: { type: Number },
    comment: { type: String },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Auth" },
});
const BusinessListingSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.model("BusinessListing", BusinessListingSchema);
