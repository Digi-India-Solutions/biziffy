import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_EMAIL_ID,
      pass: process.env.MAIL_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Biziffy" <${process.env.EMAIL_USER}>`,
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
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">📘 Facebook</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">🐦 Twitter/X</a>
        </div>
        <div>
            <a style="text-decoration: none; margin-bottom: 10px;" href="https://biziffy.com">📸 Instagram</a>
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

  await transporter.sendMail(mailOptions);
};