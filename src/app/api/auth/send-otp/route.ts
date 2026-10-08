import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already registered" },
        { status: 409 }
      );
    }

    // Delete previous OTP
    await EmailVerification.deleteOne({
      email: normalizedEmail,
    });

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // OTP expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailVerification.create({
      name,
      email: normalizedEmail,
      passwordHash,
      otpHash,
      expiresAt,
    });

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"GitHub Developer Intelligence" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>GitHub Developer Intelligence</h2>

          <p>Hello ${name},</p>

          <p>Your email verification OTP is:</p>

          <h1 style="letter-spacing: 8px;">
            ${otp}
          </h1>

          <p>This OTP will expire in <b>10 minutes</b>.</p>

          <p>If you did not request this, you can ignore this email.</p>

          <p>Thank you.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP email error:", error);

    return NextResponse.json(
      { message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}