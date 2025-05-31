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
exports.googleLoginController = exports.resetPasswordHandler = exports.verifyOtpHandler = exports.sendOtpHandler = exports.bulkDeactivate = exports.deleteBulkUser = exports.getAllUse = exports.toggleUserStatus = exports.uploadProfileImage = exports.getUserById = exports.updateUser = exports.loginUser = exports.verifyOtpController = exports.signupUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto")); // To generate OTP
const authModel_1 = __importDefault(require("../../models/authModel"));
// import jwt from "jsonwebtoken";
const google_auth_library_1 = require("google-auth-library");
const otp_model_1 = __importDefault(require("../../models/otp-model"));
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const sendOtp_1 = require("../../middleware/sendOtp");
const cloudinary_1 = require("../../utils/cloudinary");
const deleteImageFromLocalFolder_1 = require("../../utils/deleteImageFromLocalFolder");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to send OTP to the user's email
// const sendOTP = async (email: string, otp: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // You can use other email services too
//     auth: {
//       user: "amankumartiwari5255@gmail.com", // Replace with your email
//       pass: "bqbd gioy wnir pqgj", // Replace with your generated App Password
//     },
//   });
//   const mailOptions = {
//     from: "amankumartiwari5255@gmail.com",
//     to: email,
//     subject: "Biziffy - Your One-Time Password (OTP) for Registration",
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <h2 style="color: #007bff;">Welcome to Biziffy!</h2>
//         <p>Hi there,</p>
//         <p>Thank you for choosing <strong>Biziffy</strong>. To complete your registration, please use the OTP below:</p>
//         <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
//           ${otp}
//         </h3>
//         <p>This OTP is valid for only 10 minutes. Please do not share it with anyone.</p>
//         <p>If you did not initiate this request, you can safely ignore this email.</p>
//         <hr />
//         <p>To learn more about our services, visit:</p>
//         <a href="https://biziffy.com" style="color: #007bff;">https://biziffy.com</a>
//         <br/><br/>
//         <p>Best regards,</p>
//         <p><strong>Team Biziffy</strong></p>
//       </div>
//     `,
//   };
//   try {
//     await transporter.sendMail(mailOptions);
//     // console.log("OTP sent to email:", email);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//   }
// };
// POST /api/auth/signup
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ status: false, message: "Email is required" });
            return;
        }
        const userExist = yield authModel_1.default.findOne({ email });
        if (userExist) {
            res.status(200).json({ status: false, message: "Email already exists" });
            return;
        }
        const uniqueNumId = new short_unique_id_1.default({ length: 6, dictionary: "number" });
        const otp = uniqueNumId.rnd();
        yield otp_model_1.default.create({ email, otp, otpExpiry: new Date(Date.now() + 20 * 60 * 1000), });
        yield (0, sendOtp_1.sendOTP)(email, otp);
        res.status(200).json({ status: true, message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ status: false, message: "Failed to send OTP", error: error.message });
    }
});
exports.signupUser = signupUser;
// POST /api/auth/verify-otp
const verifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, phone, email, otp, password } = req.body;
        // console.log("OTP:===>", req.body);
        if (!email || !otp || !password || !fullName || !phone) {
            res.status(400).json({ status: false, message: "All fields are required" });
            return;
        }
        const otpRecord = yield otp_model_1.default.findOne({ email, otp });
        if (!otpRecord) {
            res.status(200).json({ status: false, message: "Invalid OTP" });
            return;
        }
        // console.log("OTP2:===>", otpRecord);
        if (otpRecord.otpExpiry.getTime() < Date.now()) {
            yield otp_model_1.default.deleteMany({ email });
            res.status(400).json({ status: false, message: "OTP expired" });
            return;
        }
        yield otp_model_1.default.deleteMany({ email });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield authModel_1.default.create({ fullName, email, phone: phone, password: hashedPassword, });
        res.status(200).json({ status: true, message: "User created successfully", data: newUser, });
    }
    catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
});
exports.verifyOtpController = verifyOtpController;
// POST /api/auth/login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate request body
        if (!email || !password) {
            res.status(200).json({ status: false, message: "Email and Password are required" });
            return;
        }
        // Check if user exists
        const user = yield authModel_1.default.findOne({ email });
        if (!user) {
            res.status(204).json({ status: false, message: "User not found" });
            return;
        }
        // Compare passwords
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatched) {
            res.status(201).json({ status: false, message: "Incorrect password" });
            return;
        }
        // Check if user is active
        if (user.status === "Inactive") {
            res.status(203).json({ status: false, message: "Please contact admin. Your account is inactive." });
            return;
        }
        // Generate JWT token
        const payload = { id: user._id, email: user.email };
        const secret = process.env.JWT_SECRET;
        const expiresIn = (process.env.JWT_EXPIRES || "1d");
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
        // Success
        res.status(200).json({ status: true, message: "User logged in successfully", token, user, });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message, });
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, phone, address, city, state, whatsappNumber } = req.body;
        // console.log("userId:-", req.params.id)
        if (!req.params.id) {
            res.status(400).json({ status: false, message: "User ID is required" });
            return;
        }
        const user = yield authModel_1.default.findById(req.params.id);
        // console.log("user:-", user)
        if (!user) {
            res.status(404).json({ status: false, message: "User not found" });
            return;
        }
        if (fullName !== undefined)
            user.fullName = fullName;
        if (email !== undefined)
            user.email = email;
        if (phone !== undefined)
            user.phone = phone;
        if (whatsappNumber !== undefined)
            user.whatsappNumber = whatsappNumber;
        if (address !== undefined)
            user.address = address;
        if (city !== undefined)
            user.city = city;
        if (state !== undefined)
            user.state = state;
        yield user.save();
        res.status(200).json({ status: true, message: "User updated successfully", user });
    }
    catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
});
exports.updateUser = updateUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params.id:-", req.params.id);
        const user = yield authModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ status: false, message: "User not found" });
            return;
        }
        res.status(200).json({ status: true, message: "User found", user });
    }
    catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
});
exports.getUserById = getUserById;
const uploadProfileImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ status: false, message: "User not found" });
            return;
        }
        let imageUrl = null;
        if (req.file) {
            imageUrl = yield (0, cloudinary_1.uploadImage)(req.file.path);
            (0, deleteImageFromLocalFolder_1.deleteLocalFile)(req.file.path);
        }
        user.profileImage = imageUrl;
        yield user.save();
        res.status(200).json({ status: true, message: "Profile image uploaded successfully", user });
    }
    catch (error) {
        console.error("Upload Profile Image Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
});
exports.uploadProfileImage = uploadProfileImage;
const toggleUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const user = yield authModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ status: false, message: "User not found" });
            return;
        }
        user.status = status || user.status;
        yield user.save();
        res.status(200).json({ status: true, message: "User status toggled successfully", data: user });
    }
    catch (error) {
        console.error("Toggle User Status Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
});
exports.toggleUserStatus = toggleUserStatus;
const getAllUse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield authModel_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ status: true, data: users });
    }
    catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});
exports.getAllUse = getAllUse;
const deleteBulkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield authModel_1.default.findByIdAndDelete(req.body.userId);
        res.status(200).json({ status: true, data: deletedUser });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});
exports.deleteBulkUser = deleteBulkUser;
const bulkDeactivate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, userIds } = req.body;
        if (!Array.isArray(userIds) || typeof status !== "string") {
            res.status(200).json({ status: false, message: "Invalid input" });
            return;
        }
        const results = yield Promise.all(userIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield authModel_1.default.findById(id);
            if (user) {
                user.status = status;
                yield user.save();
                return { id, success: true };
            }
            else {
                return { id, success: false, error: "User not found" };
            }
        })));
        const failed = results.filter((r) => !r.success);
        if (failed.length > 0) {
            res.status(207).json({ status: false, message: "Some users were not updated", results, });
        }
        else {
            res.status(200).json({ status: true, message: `All users marked as ${status ? "Active" : "Inactive"} successfully`, });
        }
    }
    catch (error) {
        console.error("Toggle User Status Error:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", error: error.message, });
    }
});
exports.bulkDeactivate = bulkDeactivate;
/////////////////////////////////////////////////////////////////////////
// POST /api/auth/forgot-password
const sendOtpHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email is required" });
    try {
        const user = yield authModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Optional: 10 min expiry
        yield user.save();
        yield (0, sendOtp_1.sendOTP)(email, otp);
        res.status(200).json({ message: "OTP sent to email for password reset" });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.sendOtpHandler = sendOtpHandler;
// POST /api/auth/verify-reset-otp
const verifyOtpHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield authModel_1.default.findOne({ email });
        if (!user || user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiry && user.otpExpiry < new Date())
            return res.status(400).json({ message: "OTP expired" });
        return res.status(200).json({ message: "OTP verified" });
    }
    catch (error) {
        console.error("Verify reset OTP error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyOtpHandler = verifyOtpHandler;
// POST /api/auth/reset-password
const resetPasswordHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "All fields are required" });
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });
    try {
        const user = yield authModel_1.default.findOne({ email });
        if (!user || user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiry && user.otpExpiry < new Date())
            return res.status(400).json({ message: "OTP expired" });
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpiry = undefined;
        yield user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPasswordHandler = resetPasswordHandler;
// this this for google login setup
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Add this to your .env
const googleLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenId } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: "Invalid Google token." });
        }
        const { email, name, picture, sub } = payload;
        if (!email) {
            return res.status(400).json({ message: "Google account missing email." });
        }
        let user = yield authModel_1.default.findOne({ email });
        if (!user) {
            // Create new user if not exists
            user = new authModel_1.default({
                fullName: name,
                email,
                password: sub, // or generate a random password
                phone: "", // optional, you can prompt later
                status: "active",
                profileImage: picture, // optional field in your model
                isGoogleAccount: true, // optionally track Google accounts
            });
            yield user.save();
        }
        // Create token
        // const token = jwt.sign(
        //   { id: user._id, email: user.email },
        //   process.env.JWT_SECRET as string,
        //   { expiresIn: process.env.JWT_EXPIRES }
        // );
        const payloads = { id: user._id, email: user.email };
        const secret = process.env.JWT_SECRET;
        const expiresIn = (process.env.JWT_EXPIRES || "1d");
        const token = jsonwebtoken_1.default.sign(payloads, secret, { expiresIn });
        res.status(200).json({
            message: "Google login successful",
            token,
            user,
        });
    }
    catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
});
exports.googleLoginController = googleLoginController;
// this for all users display in admin panel
