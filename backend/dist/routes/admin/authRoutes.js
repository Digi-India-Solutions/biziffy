"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authController_1 = require("../../controllers/admin/authController");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage });
router.post("/send-otp-user-signup", authController_1.signupUser); // Signup route
router.post("/verify-otp", authController_1.verifyOtpController);
router.post("/update-user/:id", authController_1.updateUser);
router.get("/get-user-by-id/:id", authController_1.getUserById);
router.post("/upload-profile-image/:id", upload.single('image'), authController_1.uploadProfileImage);
router.get('/get-use-all', authController_1.getAllUse);
router.post("/all/:id/toggle-status", authController_1.toggleUserStatus);
router.post('/auth/delete-bulk-user', authController_1.deleteBulkUser);
router.post('/auth/bulk-deactivate', authController_1.bulkDeactivate);
// Login route
router.post('/send-otp', authController_1.sendOtpHandler);
router.post('/verify-otp', authController_1.verifyOtpHandler);
router.post("/user-login", authController_1.loginUser);
router.post('/reset-password', authController_1.resetPasswordHandler);
router.post("/google-login", authController_1.googleLoginController);
exports.default = router;
