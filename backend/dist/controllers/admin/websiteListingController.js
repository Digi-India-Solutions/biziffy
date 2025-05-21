"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllWebsiteListingsById = exports.increaseClickCountWebsiteListing = exports.getAllWebsiteListingsByUserId = exports.searchWebsiteListings = exports.listingBulkAction = exports.updateWebsiteListingStatus = exports.deleteWebsiteListing = exports.getAllWebsiteListingsById = exports.getAllWebsiteListings = exports.createAdditionalInformation = exports.createDetails = void 0;
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const WebsiteListingModel_1 = __importDefault(require("../../models/WebsiteListingModel"));
const createDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("BODY:-", req.body);
        const { companyName, website, shortDescription, 
        // aboutBusiness, 
        // area,
        service, userId } = req.body;
        // Validate required fields
        if (!companyName || !website || !shortDescription || !service) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }
        // Handle single image file
        const file = (req.file || (req.files && Array.isArray(req.files) && req.files[0]));
        let imageUrl = null;
        if (file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(file.path);
        }
        // Create the business listing (initial phase)
        const listing = new WebsiteListingModel_1.default({
            companyName,
            website,
            shortDescription,
            // aboutBusiness,
            // area,
            userId,
            service: Array.isArray(service) ? service : [service],
            logo: imageUrl || "",
        });
        yield listing.save();
        res.status(201).json({
            message: "Business listing created successfully",
            status: true,
            data: listing,
        });
    }
    catch (error) {
        const err = error;
        console.error("Error creating business listing:", err);
        res.status(500).json({
            message: "Failed to create business listing",
            status: false,
            error: err.message,
        });
    }
});
exports.createDetails = createDetails;
const createAdditionalInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("BODY:-", req.body);
        const { category, subCategory, serviceArea, listingId } = req.body;
        // Validate required fields
        if (!category || !subCategory || !serviceArea || !listingId) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }
        // Find the listing
        const listing = yield WebsiteListingModel_1.default.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Business listing not found", status: false });
        }
        // Handle multiple photo uploads
        // const files = req.files as Express.Multer.File[] | undefined;
        // let businessPhotoUrls: string[] = [];
        // if (files && Array.isArray(files)) {
        //     for (const file of files) {
        //         const imageUrl = await uploadImage(file.path);
        //         businessPhotoUrls.push(imageUrl);
        //         deleteLocalFile(file.path);
        //     }
        // }
        // Update listing fields
        listing.category = category;
        listing.subCategory = subCategory;
        listing.serviceArea = serviceArea;
        // if (businessPhotoUrls.length > 0) {
        //     listing.businessPhotos = businessPhotoUrls;
        // }
        yield listing.save();
        res.status(200).json({ message: "Additional business info updated successfully", status: true, data: listing, });
    }
    catch (error) {
        const err = error;
        console.error("Error updating business listing:", err);
        res.status(500).json({
            message: "Failed to update business listing",
            status: false,
            error: err.message,
        });
    }
});
exports.createAdditionalInformation = createAdditionalInformation;
const getAllWebsiteListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield WebsiteListingModel_1.default.find()
            .sort({ createdAt: -1 })
            .populate('category')
            .populate('subCategory')
            .populate("userId")
            .populate("cliCkCount.websiteClick.user");
        // console.log("XXXXXXXX", listings);
        res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.getAllWebsiteListings = getAllWebsiteListings;
const getAllWebsiteListingsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listing = yield WebsiteListingModel_1.default.findById(req.params.id).populate("category").populate("subCategory").populate("userId");
        if (!listing)
            return res.status(404).json({ message: "Not found" });
        res.status(200).json({ data: listing, status: true, message: "Listing fetched successfully" });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.getAllWebsiteListingsById = getAllWebsiteListingsById;
const deleteWebsiteListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listing = yield WebsiteListingModel_1.default.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        // Delete all business photos if they exist
        const images = listing.businessPhotos || [];
        const logo = listing.logo || "";
        for (const img of images) {
            try {
                yield (0, cloudinary_1.deleteImage)(img); // Assuming deleteImage returns a promise
            }
            catch (fileErr) {
                console.error("Error deleting file:", fileErr);
            }
        }
        if (logo) {
            try {
                yield (0, cloudinary_1.deleteImage)(logo); // Assuming deleteImage returns a promise
            }
            catch (fileErr) {
                console.error("Error deleting file:", fileErr);
            }
        }
        // Delete the listing from DB
        yield WebsiteListingModel_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Listing deleted", data: listing, });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error deleting listing", error: err.message });
    }
});
exports.deleteWebsiteListing = deleteWebsiteListing;
const updateWebsiteListingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: false, message: "New status is required" });
        }
        const listing = yield WebsiteListingModel_1.default.findByIdAndUpdate(req.params.id, { "status": status }, { new: true });
        if (!listing) {
            return res.status(404).json({ status: false, message: "Website listing not found" });
        }
        res.status(200).json({ status: true, message: "Website listing status updated successfully", data: listing, });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.updateWebsiteListingStatus = updateWebsiteListingStatus;
const listingBulkAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids, action } = req.body;
        // console.log("action:-", ids, action);
        if (!ids || !action) {
            return res.status(400).json({ status: false, message: "Ids and action are required" });
        }
        if (action === "Delete") {
            yield WebsiteListingModel_1.default.deleteMany({ _id: { $in: ids } });
            return res.status(200).json({ status: true, message: "Listings deleted successfully" });
        }
        if (action === "Rejected" || action === "Approved") {
            yield WebsiteListingModel_1.default.updateMany({ _id: { $in: ids } }, { "status": action });
            return res.status(200).json({ status: true, message: "Listings status successfully" });
        }
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
exports.listingBulkAction = listingBulkAction;
const searchWebsiteListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query = "", pincode, title = '' } = req.query;
    // console.log("Incoming search:", { query, pincode, title });
    if (!pincode || typeof pincode !== "string") {
        return res.status(400).json({ status: false, error: "'pincode' is required." });
    }
    try {
        const regex = new RegExp(query, "i");
        let listings = [];
        if (title === "CityPage") {
            // console.log("CityPage");
            // Fetch all listings with the given pincode
            const allByPincode = yield WebsiteListingModel_1.default.find({ "serviceArea": pincode }).populate("category subCategory");
            listings = allByPincode.filter((listing) => {
                var _a, _b;
                return (((_b = (_a = listing === null || listing === void 0 ? void 0 : listing.category) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === query.toLowerCase());
            });
        }
        else {
            // console.log("CityPage console.log(CityPage)");
            // General search by text query and pincode
            listings = yield WebsiteListingModel_1.default.find({
                $and: [
                    {
                        $or: [
                            { "companyName": regex },
                            // { "area": regex },
                            { "service": { $in: [regex] } },
                            { "serviceArea": regex },
                        ]
                    },
                    { "serviceArea": pincode }
                ]
            }).populate("category subCategory userId");
        }
        // Only include Published or Approved listings
        const filteredListings = listings.filter((listing) => {
            const status = listing === null || listing === void 0 ? void 0 : listing.status;
            return status === "Approved";
        });
        // console.log("filteredListings", filteredListings);
        return res.status(200).json({ status: true, data: filteredListings });
    }
    catch (error) {
        console.error("Search error:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
});
exports.searchWebsiteListings = searchWebsiteListings;
const getAllWebsiteListingsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const listings = yield WebsiteListingModel_1.default.find({ "userId": userId })
            .populate("category")
            .populate("subCategory")
            .populate("cliCkCount.websiteClick.user");
        if (!listings || listings.length === 0) {
            return res.status(404).json({ status: false, message: "No listings found for this user.", });
        }
        res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings, });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ status: false, message: "Internal server error", error: err.message, });
    }
});
exports.getAllWebsiteListingsByUserId = getAllWebsiteListingsByUserId;
const increaseClickCountWebsiteListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, } = req.body;
        const Id = req.params.id;
        const type = 'websiteClick';
        if (!user || !type) {
            return res.status(400).json({ status: false, message: "Missing 'user' or 'type' in body.", });
        }
        const business = yield WebsiteListingModel_1.default.findById(Id);
        if (!business) {
            return res.status(404).json({ status: false, message: "Business not found.", });
        }
        if (!business.cliCkCount) {
            business.cliCkCount = new Map();
        }
        let clickData = business.cliCkCount.get(type);
        if (!clickData) {
            clickData = { count: 0, user: [] };
        }
        if (!Array.isArray(clickData.user)) {
            clickData.user = [];
        }
        const userExists = clickData.user.some((u) => u.toString() === user);
        if (!userExists) {
            clickData.user.push(user);
            clickData.count += 1;
        }
        business.cliCkCount.set(type, clickData);
        yield business.save();
        return res.status(200).json({ status: true, message: `${type} click count incremented.`, updatedCounts: clickData, });
    }
    catch (error) {
        console.error("Click count error:", error);
        return res.status(500).json({ status: false, message: error.message || "Server error.", });
    }
});
exports.increaseClickCountWebsiteListing = increaseClickCountWebsiteListing;
const updateAllWebsiteListingsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listingId = req.params.id;
        const existingListing = yield WebsiteListingModel_1.default.findById(listingId);
        if (!existingListing) {
            return res.status(404).json({ status: false, message: "Listing not found" });
        }
        const { companyName, website, shortDescription, service, userId } = req.body;
        // Validate required fields
        if (!companyName || !website || !shortDescription || !service) {
            return res.status(400).json({ message: "All fields are required", status: false });
        }
        // Handle logo image update
        const file = (req.file || (req.files && Array.isArray(req.files) && req.files[0]));
        let newLogoUrl = existingListing.logo;
        if (file) {
            // Delete old image if it exists
            if (existingListing.logo) {
                yield (0, cloudinary_1.deleteImage)(existingListing.logo);
            }
            newLogoUrl = yield (0, cloudinary_1.uploadImage)(file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(file.path);
        }
        // Perform the update
        existingListing.companyName = companyName;
        existingListing.website = website;
        existingListing.shortDescription = shortDescription;
        existingListing.userId = userId;
        existingListing.service = Array.isArray(service) ? service : [service];
        existingListing.logo = newLogoUrl;
        const updatedListing = yield existingListing.save();
        res.status(200).json({
            message: "Business listing updated successfully",
            status: true,
            data: updatedListing,
        });
    }
    catch (error) {
        const err = error;
        console.error("Error updating business listing:", err);
        res.status(500).json({
            message: "Failed to update business listing",
            status: false,
            error: err.message,
        });
    }
});
exports.updateAllWebsiteListingsById = updateAllWebsiteListingsById;
// export const changePublishStatus = async (req: Request, res: Response) => {
//   try {
//     const { status } = req.body;
//     if (!status) {
//       return res.status(400).json({ status: false, message: "New status is required" });
//     }
//     const listing = await BusinessListing.findByIdAndUpdate(
//       req.params.id,
//       { "businessDetails.publishedDate": status },
//       { new: true }
//     );
//     if (!listing) {
//       return res.status(404).json({ status: false, message: "Business listing not found" });
//     }
//     res.status(200).json({
//       status: true,
//       message: "Business listing status updated successfully",
//       data: listing,
//     });
//   } catch (err: any) {
//     console.error("Error updating business listing status:", err);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
