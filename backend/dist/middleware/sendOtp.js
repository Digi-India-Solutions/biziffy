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
exports.sendOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: "amankumartiwari5255@gmail.com",
            pass: "bqbd gioy wnir pqgj", // Use env variables in production
        },
    });
    const mailOptions = {
        from: '"Biziffy" <support@biziffy.com>',
        to: email,
        subject: "Biziffy - Your OTP for Registration",
        html: `
       <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #007bff;">Hi Bot</h2>
        <p style="margin: 0;">Hi there,</p>
        <p style="margin: 0;">Thank you for registering on Bizzify.com!</p>
        <p style="margin: 0;">Please use the One-Time Password (OTP) below to verify your email address and complete your registration
            process:</p>
        <h5 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
            🔐 Your OTP is: ${otp}
        </h5>
        <p style="margin: 0;">This OTP is valid for the next 10 minutes.</p>
        <p style="margin: 0;">If you did not request this, please ignore the email.</p>
        <p style="margin: 0;">If you did not request this, you can safely ignore this email.</p>
        <p style="margin: 0;">For help or support, feel free to reach out to us at support@bizzify.com.</p>
        <p>Stay connected with us on social media:</p>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">🌐 www.bizzify.com</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://www.facebook.com/people/Biziffy-India/pfbid05EeMQK7qXrw5nuEe2B6cKNhBwYTskFwsMrijTM1WdgijuLjvuXUa7GQ94WJM9AEvl/">📘 Facebook</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://x.com/biziffy_india">🐦 Twitter/X</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://www.instagram.com/biziffyindia/">📸 Instagram</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">🔗 LinkedIn</a>
        </div>
        <hr />
        <p>Thank you,</p>
        <p>The Bizzify Team</p>
    </div>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendOTP = sendOTP;
