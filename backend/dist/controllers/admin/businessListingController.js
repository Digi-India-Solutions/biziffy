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
exports.increaseClickCount = exports.searchBusinessListings = exports.getAllListingsByUserId = exports.listingBulkAction = exports.changePublishStatus = exports.updateBusinessListingStatus = exports.deleteBusinessListing = exports.updateAllListingsById = exports.getAllListingsById = exports.getAllListings = exports.createBusinessDetails = void 0;
const BusinessListing_1 = __importDefault(require("../../models/BusinessListing"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
// Step 1: Create Contact
// export const createContact = async (req: Request, res: Response) => {
//   try {
//     const contact = new Contact(req.body);
//     await contact.save();
//     res.status(201).json({ message: "Contact saved", data: contact });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// // Step 2: Create Business Category
// export const createBusinessCategory = async (req: Request, res: Response) => {
//   try {
//     const { category, businessImages, about, keywords, serviceArea } = req.body;
//     if (!category || !businessImages || !about) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     const newCategory = new BusinessCategory({
//       category,
//       businessImages,
//       about,
//       keywords,
//       serviceArea,
//     });
//     await newCategory.save();
//     res.status(201).json({ message: "Business category created successfully!" });
//   } catch (error) {
//     console.error("Error creating business category:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // Step 3: Create Business Timing
// export const createBusinessTiming = async (req: Request, res: Response) => {
//   try {
//     const { timings } = req.body;
//     // Validate if timings array is provided and is not empty
//     if (!timings || timings.length === 0) {
//       return res.status(400).json({ message: "Timings data is required." });
//     }
//     // Validate that every day has openTime and closeTime if 'isOpen' is true
//     const invalidTimings = timings.some(item =>
//       item.isOpen && (!item.openTime || !item.closeTime)
//     );
//     if (invalidTimings) {
//       return res.status(400).json({ message: "Please fill in all timings for selected days." });
//     }
//     // Save business timings
//     const savedTimings = await BusinessTiming.create(timings);
//     res.status(201).json({ message: "Timings saved successfully", data: savedTimings });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // Step 4: Create Upgrade Listing
// export const createUpgradeListing = async (req: Request, res: Response) => {
//   const { direction, website, facebook, instagram, linkedin, twitter } = req.body;
//   // Validate the required fields
//   if (!direction || !website) {
//     return res.status(400).json({ message: "Direction and Website are required" });
//   }
//   try {
//     const upgrade = new UpgradeListing({
//       direction,
//       website,
//       facebook,
//       instagram,
//       linkedin,
//       twitter,
//     });
//     await upgrade.save();
//     res.status(201).json({
//       message: "Upgrade listing saved successfully",
//       data: upgrade,
//     });
//   } catch (err) {
//     console.error("Error saving upgrade listing:", err);
//     res.status(500).json({
//       message: "Failed to save upgrade listing",
//       error: "Internal Server Error",
//     });
//   }
// };
// // Step 5: Create Business Listing
// export const createBusinessListing = async (req: Request, res: Response) => {
//   try {
//     const listing = new BusinessListing(req.body);
//     await listing.save();
//     res.status(201).json({ message: "Full business listing saved", data: listing });
//   } catch (err) {
//     console.error("BusinessListing Save Error:", err);
//     res.status(500).json({ message: "Failed to save full business listing", error: err });
//   }
// };
// // Step 6: Get All Full Business Listings (merged from 5 forms)
// export const getAllFullListings = async (req: Request, res: Response) => {
//   try {
//     const businessDetails = await BusinessDetails.find();
//     const contacts = await Contact.find();
//     const categories = await BusinessCategory.find();
//     const timings = await BusinessTiming.find();
//     const upgrades = await UpgradeListing.find();
//     const listings = businessDetails.map((detail, index) => ({
//       businessDetails: detail,
//       contactPerson: contacts[index],
//       categories: categories[index],
//       timings: timings[index],
//       upgrade: upgrades[index],
//     }));
//     res.status(200).json(listings);
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // Step 7: Update Business Status
// export const updateBusinessStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     // Directly update fields in BusinessListing
//     listing.businessStatus = status;
//     listing.trustStatus =
//       status === "Approved" || status === "Pending" ? "Approved" : "Not Approved";
//     await listing.save();
//     res.status(200).json({ message: "Business status updated successfully", listing });
//   } catch (error) {
//     console.error("Error updating business status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // Step 8: Delete Business Listing by ID
// // export const deleteBusinessListing = async (req: Request, res: Response) => {
// //   const { id } = req.params;
// //   try {
// //     const deletedListing = await BusinessListing.findByIdAndDelete(id);
// //     if (!deletedListing) {
// //       return res.status(404).json({ message: "Business listing not found" });
// //     }
// //     res.status(200).json({ message: "Business listing deleted successfully", data: deletedListing });
// //   } catch (err) {
// //     console.error("Error deleting business listing:", err);
// //     res.status(500).json({ message: "Failed to delete business listing", error: err });
// //   }
// // };
// // Step 9: Update Publish Status
// export const updatePublishStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }
//     listing.publishedDate = status;
//     await listing.save();
//     res.status(200).json({ message: "Publish status updated successfully", listing });
//   } catch (error) {
//     console.error("Error updating publish status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // Step 10: Get Business Listing Details by ID
// export const getBusinessListingDetails = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const listing = await BusinessListing.findById(id);
//     if (!listing) {
//       return res.status(404).json({ message: "Business listing not found" });
//     }
//     const businessDetails = await BusinessDetails.findOne({ listingId: id });
//     const contact = await Contact.findOne({ listingId: id });
//     const category = await BusinessCategory.findOne({ listingId: id });
//     const timing = await BusinessTiming.findOne({ listingId: id });
//     const upgrade = await UpgradeListing.findOne({ listingId: id });
//     return res.status(200).json({
//       message: "Business listing details fetched successfully",
//       data: {
//         listing,
//         businessDetails,
//         contact,
//         category,
//         timing,
//         upgrade,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching business listing details:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
//////////////////////////////////////////////////////////////////
//////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////////////////////////
const createBusinessDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contactPerson, businessDetails, businessTiming, businessCategory, upgradeListing, } = req.body;
        const parsedBusinessDetails = JSON.parse(businessDetails);
        const existingBusiness = yield BusinessListing_1.default.findOne({ "businessDetails.businessName": parsedBusinessDetails.businessName, });
        if (existingBusiness) {
            return res.status(400).json({ message: "Business already exists", status: false });
        }
        const files = req.files;
        const imageUrls = [];
        let imageUrl = null;
        // console.log("ZZZZZZZZZZXXXXXXX1:--", req.files);
        if (files && Array.isArray(files)) {
            for (const file of files) {
                let imageUrl = null;
                imageUrl = (yield (0, cloudinary_1.uploadImage)(file.path));
                // console.log("ZZZZZZZZZZXXXXXXX2:--", imageUrl);
                imageUrls.push(imageUrl);
                (0, deleteImageFromLocalFolder_1.deleteLocalFile)(file.path);
            }
        }
        // console.log("ZZZZZZZZZZXXXXXXX:--", imageUrls);
        const parseBusinessCategory = JSON.parse(businessCategory);
        const listing = new BusinessListing_1.default({
            contactPerson: JSON.parse(contactPerson),
            businessDetails: Object.assign({}, parsedBusinessDetails),
            businessTiming: JSON.parse(businessTiming),
            businessCategory: Object.assign(Object.assign({}, parseBusinessCategory), { businessImages: imageUrls }),
            upgradeListing: JSON.parse(upgradeListing),
        });
        yield listing.save();
        // console.log("DDDDDDDDFFFFFFFDDDDDDDD:::---", listing);
        res.status(201).json({ message: "Business listing created successfully", status: true, data: listing, });
    }
    catch (error) {
        const err = error;
        console.error("Error creating business listing:", err);
        res.status(500).json({ message: "Failed to create business listing", status: false, error: err.message, });
    }
});
exports.createBusinessDetails = createBusinessDetails;
const getAllListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listings = yield BusinessListing_1.default.find()
            .sort({ createdAt: -1 })
            .populate('businessCategory.category')
            .populate('businessCategory.subCategory');
        // console.log("XXXXXXXX", listings);
        res.status(200).json({ status: true, message: "Listings fetched successfully", data: listings });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.getAllListings = getAllListings;
const getAllListingsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listing = yield BusinessListing_1.default.findById(req.params.id).populate("businessCategory.category").populate("businessCategory.subCategory");
        if (!listing)
            return res.status(404).json({ message: "Not found" });
        res.status(200).json({ data: listing, status: true, message: "Listing fetched successfully" });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.getAllListingsById = getAllListingsById;
const updateAllListingsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const listingId = req.params.id;
        const existingListing = yield BusinessListing_1.default.findById(listingId);
        if (!existingListing) {
            return res.status(404).json({ status: false, message: "Listing not found" });
        }
        const files = req.files || [];
        const { contactPerson, businessDetails, businessCategory, upgradeListing, } = req.body;
        // Utility to parse stringified JSON
        const parseIfJson = (data) => {
            try {
                return typeof data === "string" ? JSON.parse(data) : data;
            }
            catch (_a) {
                return data;
            }
        };
        const parsedContact = parseIfJson(contactPerson);
        const parsedDetails = parseIfJson(businessDetails);
        const parsedCategory = parseIfJson(businessCategory);
        const parsedUpgrade = parseIfJson(upgradeListing);
        // Extract files with fieldname `businessImages`
        const uploadedImageFiles = files.filter(file => file.fieldname.startsWith("businessImages"));
        let imageUrls = [];
        if (uploadedImageFiles.length > 0) {
            // Delete old images before uploading new ones
            // if (existingListing.businessCategory?.businessImages?.length > 0) {
            //   for (const oldImage of existingListing.businessCategory.businessImages) {
            //     await deleteImage(oldImage);
            //   }
            // }
            if (((_c = (_b = (_a = existingListing.businessCategory) === null || _a === void 0 ? void 0 : _a.businessImages) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) {
                for (const oldImage of existingListing.businessCategory.businessImages) {
                    yield (0, cloudinary_1.deleteImage)(oldImage);
                }
            }
            // Upload new images
            for (const file of uploadedImageFiles) {
                const uploadedUrl = yield (0, cloudinary_1.uploadImage)(file.path);
                imageUrls.push(uploadedUrl);
                (0, deleteImageFromLocalFolder_1.deleteLocalFile)(file.path);
            }
            parsedCategory.businessImages = imageUrls;
        }
        else {
            // No new images uploaded, keep existing images
            parsedCategory.businessImages = ((_d = existingListing.businessCategory) === null || _d === void 0 ? void 0 : _d.businessImages) || [];
        }
        // Perform the update
        const updated = yield BusinessListing_1.default.findByIdAndUpdate(listingId, {
            contactPerson: parsedContact,
            businessDetails: parsedDetails,
            businessCategory: parsedCategory,
            upgradeListing: parsedUpgrade,
            faq: JSON.parse((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.faq) || ((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.faq)
        }, { new: true });
        return res.status(200).json({ status: true, message: "Listing updated successfully", data: updated, });
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ status: false, message: "Error updating listing", error: err.message, });
    }
});
exports.updateAllListingsById = updateAllListingsById;
const deleteBusinessListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const listing = yield BusinessListing_1.default.findById(req.params.id);
        if (!listing)
            return res.status(404).json({ message: "Listing not found" });
        // Delete all business images if they exist
        const images = ((_a = listing.businessCategory) === null || _a === void 0 ? void 0 : _a.businessImages) || [];
        images.forEach((img) => {
            const filePath = path_1.default.join(__dirname, `/uploads/${img}`);
            // console.log("HHHHHHHH", filePath);
            try {
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    (0, cloudinary_1.deleteImage)(img);
                }
            }
            catch (fileErr) {
                console.error("Error deleting file:", fileErr);
            }
        });
        // Delete the listing from DB
        yield BusinessListing_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Listing deleted", data: listing });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.deleteBusinessListing = deleteBusinessListing;
const updateBusinessListingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: false, message: "New status is required" });
        }
        const listing = yield BusinessListing_1.default.findByIdAndUpdate(req.params.id, { "businessDetails.status": status }, { new: true });
        if (!listing) {
            return res.status(404).json({ status: false, message: "Business listing not found" });
        }
        res.status(200).json({ status: true, message: "Business listing status updated successfully", data: listing, });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Error fetching listings", error: err.message });
    }
});
exports.updateBusinessListingStatus = updateBusinessListingStatus;
const changePublishStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: false, message: "New status is required" });
        }
        const listing = yield BusinessListing_1.default.findByIdAndUpdate(req.params.id, { "businessDetails.publishedDate": status }, { new: true });
        if (!listing) {
            return res.status(404).json({ status: false, message: "Business listing not found" });
        }
        res.status(200).json({
            status: true,
            message: "Business listing status updated successfully",
            data: listing,
        });
    }
    catch (err) {
        console.error("Error updating business listing status:", err);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.changePublishStatus = changePublishStatus;
const listingBulkAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids, action } = req.body;
        // console.log("action:-", ids, action);
        if (!ids || !action) {
            return res.status(400).json({ status: false, message: "Ids and action are required" });
        }
        if (action === "Delete") {
            yield BusinessListing_1.default.deleteMany({ _id: { $in: ids } });
            return res.status(200).json({ status: true, message: "Listings deleted successfully" });
        }
        if (action === "publish") {
            yield BusinessListing_1.default.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
            return res.status(200).json({ status: true, message: "Listings published successfully" });
        }
        if (action === "unpublish") {
            yield BusinessListing_1.default.updateMany({ _id: { $in: ids } }, { "businessDetails.publishedDate": action });
            return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
        }
        if (action === "Rejected" || action === "Approved") {
            yield BusinessListing_1.default.updateMany({ _id: { $in: ids } }, { "businessDetails.status": action });
            return res.status(200).json({ status: true, message: "Listings unpublished successfully" });
        }
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
exports.listingBulkAction = listingBulkAction;
const getAllListingsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const listings = yield BusinessListing_1.default.find({ "contactPerson.userId": userId })
            .populate("businessCategory.category")
            .populate("businessCategory.subCategory")
            .populate("clickCounts.direction.user")
            .populate("clickCounts.share.user")
            .populate("clickCounts.contact.user")
            .populate("clickCounts.whatsapp.user")
            .populate("clickCounts.listings.user");
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
exports.getAllListingsByUserId = getAllListingsByUserId;
const searchBusinessListings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const allByPincode = yield BusinessListing_1.default.find({
                "businessDetails.pinCode": pincode
            }).populate("businessCategory.category businessCategory.subCategory");
            listings = allByPincode.filter((listing) => {
                var _a, _b, _c;
                return (((_c = (_b = (_a = listing === null || listing === void 0 ? void 0 : listing.businessCategory) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === query.toLowerCase());
            });
        }
        else {
            // console.log("CityPage console.log(CityPage)");
            // General search by text query and pincode
            listings = yield BusinessListing_1.default.find({
                $and: [
                    {
                        $or: [
                            { "businessDetails.businessName": regex },
                            { "businessCategory.about": regex },
                            { "businessCategory.keywords": { $in: [regex] } },
                            { "businessCategory.businessService": regex },
                            { "businessCategory.serviceArea": { $in: [regex] } }
                        ]
                    },
                    { "businessDetails.pinCode": pincode }
                ]
            }).populate("businessCategory.category businessCategory.subCategory");
        }
        // Only include Published or Approved listings
        const filteredListings = listings.filter((listing) => {
            var _a;
            const status = (_a = listing === null || listing === void 0 ? void 0 : listing.businessDetails) === null || _a === void 0 ? void 0 : _a.status;
            return status === "Published" || status === "Approved";
        });
        // console.log("filteredListings", filteredListings);
        return res.status(200).json({ status: true, data: filteredListings });
    }
    catch (error) {
        console.error("Search error:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
    }
});
exports.searchBusinessListings = searchBusinessListings;
const increaseClickCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allowedClickTypes = ["direction", "share", "contact", "website", "whatsapp", "listings"];
        const { type, user } = req.body;
        const businessId = req.params.id;
        if (!type || !allowedClickTypes.includes(type)) {
            return res.status(400).json({ status: false, message: "Invalid or missing click type." });
        }
        if (!user) {
            return res.status(400).json({ status: false, message: "Missing userId in body." });
        }
        const business = yield BusinessListing_1.default.findById(businessId);
        if (!business) {
            return res.status(404).json({ status: false, message: "Business not found." });
        }
        // Ensure clickCounts is initialized
        if (!business.clickCounts) {
            business.clickCounts = {};
        }
        // Ensure the specific click type is initialized
        if (!business.clickCounts[type]) {
            business.clickCounts[type] = {
                count: 0,
                user: [],
            };
        }
        // If user is not an array (corrupted), convert it
        if (!Array.isArray(business.clickCounts[type].user)) {
            business.clickCounts[type].user = business.clickCounts[type].user
                ? [business.clickCounts[type].user]
                : [];
        }
        // Only add user if not already present
        if (!business.clickCounts[type].user.some((u) => u.toString() === user)) {
            business.clickCounts[type].user.push(user);
        }
        // Increment the click count
        business.clickCounts[type].count += 1;
        yield business.save();
        return res.status(200).json({
            status: true,
            message: `${type} click count incremented.`,
            updatedCounts: business.clickCounts[type],
        });
    }
    catch (error) {
        console.error("Click count error:", error);
        return res.status(500).json({ status: false, message: error.message || "Server error." });
    }
});
exports.increaseClickCount = increaseClickCount;
