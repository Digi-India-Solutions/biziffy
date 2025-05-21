import mongoose from "mongoose";


const websiteListingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", },
    companyName: { type: String, required: true, },
    website: String,
    shortDescription: String,
    // aboutBusiness: String,
    // area: String,
    service: [String],
    logo: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", },
    serviceArea: String,
    // businessPhotos: [String],
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    cliCkCount: {
        type: Map,
        of: new mongoose.Schema({
            count: { type: Number, default: 0 },
            user: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auth" }],
        }),
        default: {},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("WebsiteListing", websiteListingSchema);
