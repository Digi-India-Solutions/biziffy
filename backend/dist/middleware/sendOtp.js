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
        from: '"Biziffy" <amankumartiwari5255@gmail.com>',
        to: email,
        subject: "Biziffy - Your OTP for Registration",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #007bff;">Welcome to Biziffy!</h2>
        <p>Hi there,</p>
        <p>Use the OTP below to complete your registration:</p>
        <h3 style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
          ${otp}
        </h3>
        <p>This OTP is valid for 20 minutes.</p>
        <p>If you did not request this, please ignore the email.</p>
        <hr />
        <a href="https://biziffy.com" style="color: #007bff;">Visit Biziffy</a>
        <p>Best regards,<br/><strong>Team Biziffy</strong></p>
      </div>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendOTP = sendOTP;
