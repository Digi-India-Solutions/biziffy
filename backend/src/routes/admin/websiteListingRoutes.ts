import express from 'express';

import { upload } from "../../middleware/upload";
import {
    createAdditionalInformation, createDetails, getAllWebsiteListings, getAllWebsiteListingsById, deleteWebsiteListing,
    updateWebsiteListingStatus, listingBulkAction, searchWebsiteListings, getAllWebsiteListingsByUserId,increaseClickCountWebsiteListing,
    updateAllWebsiteListingsById,updateBusinessListingVerified
} from '../../controllers/admin/websiteListingController';
const router = express.Router();


/////////////////////////////////AASIB KHAN////////////////////////////////////////////////////////


router.post("/createListing", upload.single("logo"), createDetails);
router.post("/createAdditionalInformation", upload.any(), createAdditionalInformation);
router.get("/get-all-website-listings", getAllWebsiteListings)
router.get("/get-all-website-listings-by-id/:id", getAllWebsiteListingsById)
router.get("/delete-website-listing/:id", deleteWebsiteListing)
router.post("/update-website-listing-status/:id", updateWebsiteListingStatus)
router.post("/update-website-listing-verified/:id", updateBusinessListingVerified)
router.post("/website-listing-bulk-action", listingBulkAction)
router.get("/search-website-listings", searchWebsiteListings)
router.get("/get-all-website-listings-by-user-id/:id", getAllWebsiteListingsByUserId)

router.post("/update-website-listings-by-id/:id",  upload.single("logo"), updateAllWebsiteListingsById);
// router.post("/update-listings-without-image-by-id/:id", updateAllListingsWithoutImageById);

// router.post("/change-publish-status/:id", changePublishStatus)

router.post("/increase-click-count-website-listing/:id", increaseClickCountWebsiteListing)




export default router;
