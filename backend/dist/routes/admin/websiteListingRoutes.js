"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../../middleware/upload");
const websiteListingController_1 = require("../../controllers/admin/websiteListingController");
const router = express_1.default.Router();
/////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////
router.post("/createListing", upload_1.upload.single("logo"), websiteListingController_1.createDetails);
router.post("/createAdditionalInformation", upload_1.upload.any(), websiteListingController_1.createAdditionalInformation);
router.get("/get-all-website-listings", websiteListingController_1.getAllWebsiteListings);
router.get("/get-all-website-listings-by-id/:id", websiteListingController_1.getAllWebsiteListingsById);
router.get("/delete-website-listing/:id", websiteListingController_1.deleteWebsiteListing);
router.post("/update-website-listing-status/:id", websiteListingController_1.updateWebsiteListingStatus);
router.post("/website-listing-bulk-action", websiteListingController_1.listingBulkAction);
router.get("/search-website-listings", websiteListingController_1.searchWebsiteListings);
router.get("/get-all-website-listings-by-user-id/:id", websiteListingController_1.getAllWebsiteListingsByUserId);
router.post("/update-website-listings-by-id/:id", upload_1.upload.single("logo"), websiteListingController_1.updateAllWebsiteListingsById);
// router.post("/update-listings-without-image-by-id/:id", updateAllListingsWithoutImageById);
// router.post("/change-publish-status/:id", changePublishStatus)
router.post("/increase-click-count-website-listing/:id", websiteListingController_1.increaseClickCountWebsiteListing);
exports.default = router;
