import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
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

  await transporter.sendMail(mailOptions);
};