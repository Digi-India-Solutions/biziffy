import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // To generate OTP
import nodemailer from "nodemailer"; // For sending email
import User from "../../models/authModel";
// import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Otp from "../../models/otp-model";
import ShortUniqueId from "short-unique-id";
import { sendOTP } from "../../middleware/sendOtp"
import { uploadImage } from "../../utils/cloudinary";
import { deleteLocalFile } from "../../utils/deleteImageFromLocalFolder";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

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
export const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ status: false, message: "Email is required" });
      return;
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(200).json({ status: false, message: "Email already exists" });
      return;
    }

    const uniqueNumId = new ShortUniqueId({ length: 6, dictionary: "number" });
    const otp = uniqueNumId.rnd();

    await Otp.create({ email, otp, otpExpiry: new Date(Date.now() + 20 * 60 * 1000), });

    await sendOTP(email, otp);

    res.status(200).json({ status: true, message: 'OTP sent successfully' });

  } catch (error: any) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: false, message: "Failed to send OTP", error: error.message });
  }
};

// POST /api/auth/verify-otp
export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, email, otp, password } = req.body;
    // console.log("OTP:===>", req.body);
    if (!email || !otp || !password || !fullName || !phone) {
      res.status(400).json({ status: false, message: "All fields are required" });
      return;
    }
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      res.status(200).json({ status: false, message: "Invalid OTP" });
      return;
    }
    // console.log("OTP2:===>", otpRecord);

    if (otpRecord.otpExpiry.getTime() < Date.now()) {
      await Otp.deleteMany({ email });
      res.status(400).json({ status: false, message: "OTP expired" });
      return;
    }
    await Otp.deleteMany({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ fullName, email, phone: phone, password: hashedPassword, });

    res.status(200).json({ status: true, message: "User created successfully", data: newUser, });

  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      res.status(200).json({ status: false, message: "Email and Password are required" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(204).json({ status: false, message: "User not found" });
      return;
    }

    // Compare passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);
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
    const secret = process.env.JWT_SECRET as Secret;
    const expiresIn = (process.env.JWT_EXPIRES || "1d") as SignOptions["expiresIn"];

    const token = jwt.sign(payload, secret, { expiresIn });

    // Success
    res.status(200).json({ status: true, message: "User logged in successfully", token, user, });

  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message, });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, address, city, state, whatsappNumber } = req.body;
    // console.log("userId:-", req.params.id)
    if (!req.params.id) {
      res.status(400).json({ status: false, message: "User ID is required" });
      return;
    }

    const user = await User.findById(req.params.id);
    // console.log("user:-", user)
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }


    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (whatsappNumber !== undefined) user.whatsappNumber = whatsappNumber;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;

    await user.save();
    res.status(200).json({ status: true, message: "User updated successfully", user });
  } catch (error: any) {
    console.error("Update User Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("req.params.id:-", req.params.id)
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    res.status(200).json({ status: true, message: "User found", user });
  } catch (error: any) {
    console.error("Get User Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
      deleteLocalFile(req.file.path);
    }

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({ status: true, message: "Profile image uploaded successfully", user });
  } catch (error: any) {
    console.error("Upload Profile Image Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
}

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
      return;
    }

    user.status = status || user.status;
    await user.save();

    res.status(200).json({ status: true, message: "User status toggled successfully", data: user });
  } catch (error: any) {
    console.error("Toggle User Status Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
}

export const getAllUse = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const deleteBulkUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.body.userId);
    res.status(200).json({ status: true, data: deletedUser });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
}

export const bulkDeactivate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, userIds } = req.body;

    if (!Array.isArray(userIds) || typeof status !== "string") {
      res.status(200).json({ status: false, message: "Invalid input" });
      return;
    }

    const results = await Promise.all(
      userIds.map(async (id) => {
        const user = await User.findById(id);
        if (user) {
          user.status = status as "Active" | "Inactive" | "pending";
          await user.save();
          return { id, success: true };
        } else {
          return { id, success: false, error: "User not found" };
        }
      })
    );

    const failed = results.filter((r) => !r.success);

    if (failed.length > 0) {
      res.status(207).json({ status: false, message: "Some users were not updated", results, });
    } else {
      res.status(200).json({ status: true, message: `All users marked as ${status ? "Active" : "Inactive"} successfully`, });
    }
  } catch (error: any) {
    console.error("Toggle User Status Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message, });
  }
};

/////////////////////////////////////////////////////////////////////////

export const sendOtpHandler = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) { return res.status(400).json({ success: false, message: "Email is required" }); }

  try {
    const user = await User.findOne({ email });
    if (!user) { return res.status(404).json({ success: false, message: "User not found" }); }

    const otp = crypto.randomInt(100000, 999999).toString();

    // Delete any previous OTPs for this email
    await Otp.deleteMany({ email });

    await Otp.create({ email, otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000), });

    await sendOTP(email, otp);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/auth/verify-reset-otp
export const verifyOtpHandler = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
console.log("XXXXXXXXXXXX",req.body)
  if (!email || !otp) { return res.status(400).json({ success: false, message: "Email and OTP are required" }); }

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) { return res.status(400).json({ success: false, message: "Invalid OTP" }); }

    if (otpRecord.otpExpiry.getTime() < Date.now()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Mark OTP as verified by deleting it
    await Otp.deleteMany({ email });

    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/auth/reset-password
export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  console.log("XXXXXXXXXXXX",req.body)
  if (!email ||  !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// this this for google login setup

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Add this to your .env

export const googleLoginController = async (req: Request, res: Response) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
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

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        fullName: name,
        email,
        password: sub, // or generate a random password
        phone: "", // optional, you can prompt later
        status: "active",
        profileImage: picture, // optional field in your model
        isGoogleAccount: true, // optionally track Google accounts
      });

      await user.save();
    }


    const payloads = { id: user._id, email: user.email };
    const secret = process.env.JWT_SECRET as Secret;
    const expiresIn = (process.env.JWT_EXPIRES || "1d") as SignOptions["expiresIn"];

    const token = jwt.sign(payloads, secret, { expiresIn });

    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
};

// this for all users display in admin panel


