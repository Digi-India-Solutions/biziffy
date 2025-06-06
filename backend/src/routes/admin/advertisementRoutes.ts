import express from "express";
import multer from "multer";
import path from "path";
import {
  createAdvertisement,
  getAllAdvertisements,
  deleteAdvertisement,
  updateAdvertisement,
  getAdvertisementById,
  changestatus,
} from "../../controllers/admin/advertisementController";

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads")); // ✅ Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post("/create-advertisements", upload.single("image"), createAdvertisement);           // Create new ad with image
router.get("/get-all-advertisements", getAllAdvertisements);                                  // Get all ads
router.get("/get-advertisements-by-id/:id", getAdvertisementById);                               // Get ad by ID
router.post("/update-advertisements/:id", upload.single("image"), updateAdvertisement);        // Update ad with new image (optional)
router.get("/delete-advertisements/:id", deleteAdvertisement);  
router.post("/change-status/:id",changestatus)                           

export default router;
