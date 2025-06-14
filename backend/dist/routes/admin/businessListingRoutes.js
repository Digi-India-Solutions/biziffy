"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../../middleware/upload");
const businessListingController_1 = require("../../controllers/admin/businessListingController");
const router = express_1.default.Router();
/////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////
router.post("/createBusinessListing", upload_1.upload.array("businessImages"), businessListingController_1.createBusinessDetails);
router.get("/get-all-listings", businessListingController_1.getAllListings);
router.get("/get-all-listings-by-id/:id", businessListingController_1.getAllListingsById);
router.post("/update-listings-by-id/:id", upload_1.upload.any(), businessListingController_1.updateAllListingsById);
// router.post("/update-listings-without-image-by-id/:id", updateAllListingsWithoutImageById);
router.get("/delete-business-listing/:id", businessListingController_1.deleteBusinessListing);
router.post("/update-business-listing-status/:id", businessListingController_1.updateBusinessListingStatus);
router.post("/change-publish-status/:id", businessListingController_1.changePublishStatus);
router.post("/listing-bulk-action", businessListingController_1.listingBulkAction);
router.get("/get-all-listings-by-user-id/:id", businessListingController_1.getAllListingsByUserId);
router.get("/search-listings", businessListingController_1.searchBusinessListings);
router.post("/increase-click-count/:id", businessListingController_1.increaseClickCount);
router.post("/post-review-all-listings-by-id/:id", businessListingController_1.postReviewAllListingsById);
exports.default = router;
