import {getOtp} from "../config/db.js";
import bcrypt from "bcrypt";
import transporter from "../config/mail.js";
import generateOtp from "../utils/genarate.otp.js";
import { renderTemplate } from "../utils/render.otp.templete.js";


// Constants
const OTP_VALIDITY_MINUTES = 5;
const OTP_VALIDITY_MS = OTP_VALIDITY_MINUTES * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otpCollection = getOtp();

    // Cooldown check
    const lastOtp = await otpCollection.findOne({ email });
    if (lastOtp) {
      const diff = Date.now() - new Date(lastOtp.createdAt).getTime();
      if (diff < RESEND_COOLDOWN_MS) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(
            (RESEND_COOLDOWN_MS - diff) / 1000
          )} seconds before resending OTP`,
        });
      }
    }

    await otpCollection.deleteMany({ email });

    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp,10);

    await otpCollection.insertOne({
      email,
      otp:hashedOtp,
      expiresAt: new Date(Date.now() + OTP_VALIDITY_MS),
      createdAt: new Date(),
    });

    // ✅ Render HTML AFTER otp & email exist
    const html = await renderTemplate("otp.html", {
      username: email.split("@")[0],
      otp,
      date: new Date().toLocaleDateString("en-GB"),
      validMinutes: OTP_VALIDITY_MINUTES,
      resendSeconds: RESEND_COOLDOWN_MS / 1000,
    });

    await transporter.sendMail({
      from: `"Omni Katyalist" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your One-Time Password",
      html,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP sending failed" });
  }
};



export const verifyOtpController = async(req,res) => {
    try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const otpCollection = getOtp();
    const otpDoc = await otpCollection.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check if OTP is expired
    if (otpDoc.expiresAt < new Date()) {
      await otpCollection.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, otpDoc.otp);
    if (!isMatch) {
      // Optional: Track failed attempts
      const failedAttempts = (otpDoc.failedAttempts || 0) + 1;
      if (failedAttempts >= 3) {
        await otpCollection.deleteOne({ email });
        return res.status(400).json({ 
          message: "Too many failed attempts. OTP has been invalidated." 
        });
      }
      
      await otpCollection.updateOne(
        { email },
        { $set: { failedAttempts } }
      );
      
      return res.status(400).json({ 
        message: "Invalid OTP",
        remainingAttempts: 3 - failedAttempts
      });
    }

    // Delete OTP after successful verification
    await otpCollection.deleteOne({ email });

    res.json({ 
      success: true, 
      message: "OTP verified successfully",
      verifiedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OTP verification failed" });
  }
}