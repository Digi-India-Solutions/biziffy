import express from 'express';

import { upload } from "../../middleware/upload";
import {
    getAllListings, createBusinessDetails, getAllListingsById, updateAllListingsById, deleteBusinessListing,
    updateBusinessListingStatus, changePublishStatus, listingBulkAction, getAllListingsByUserId,
    searchBusinessListings,increaseClickCount,postReviewAllListingsById
} from '../../controllers/admin/businessListingController';
const router = express.Router();


/////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////


router.post("/createBusinessListing", upload.array("businessImages"), createBusinessDetails);
router.get("/get-all-listings", getAllListings)
router.get("/get-all-listings-by-id/:id", getAllListingsById)
router.post("/update-listings-by-id/:id", upload.any(), updateAllListingsById);
// router.post("/update-listings-without-image-by-id/:id", updateAllListingsWithoutImageById);
router.get("/delete-business-listing/:id", deleteBusinessListing)
router.post("/update-business-listing-status/:id", updateBusinessListingStatus)
router.post("/change-publish-status/:id", changePublishStatus)
router.post("/listing-bulk-action", listingBulkAction)
router.get("/get-all-listings-by-user-id/:id", getAllListingsByUserId)
router.get("/search-listings", searchBusinessListings)
router.post("/increase-click-count/:id", increaseClickCount)
router.post("/post-review-all-listings-by-id/:id", postReviewAllListingsById);




export default router;
