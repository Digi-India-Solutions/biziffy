import express from "express";
import multer from "multer";

import {
  signupUser, verifyOtpController, loginUser, sendOtpHandler, verifyOtpHandler, resetPasswordHandler, googleLoginController, getAllUse, updateUser,
  toggleUserStatus, getUserById, uploadProfileImage, deleteBulkUser,bulkDeactivate
} from "../../controllers/admin/authController";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const router = express.Router();

const upload = multer({ storage });

router.post("/send-otp-user-signup", signupUser); // Signup route
router.post("/verify-otp", verifyOtpController);
router.post("/update-user/:id", updateUser)
router.get("/get-user-by-id/:id", getUserById)
router.post("/upload-profile-image/:id", upload.single('image'), uploadProfileImage)
router.get('/get-use-all', getAllUse);
router.post("/all/:id/toggle-status", toggleUserStatus);
router.post('/auth/delete-bulk-user', deleteBulkUser)
router.post('/auth/bulk-deactivate', bulkDeactivate)
router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp-forgate-password', verifyOtpHandler);
router.post('/reset-password', resetPasswordHandler);
router.post("/google-login", googleLoginController);
router.post("/user-login", loginUser);
// Login route











export default router;
