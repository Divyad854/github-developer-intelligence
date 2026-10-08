import crypto from "crypto";

import { connectDB } from "@/lib/db";
import { authResponse } from "@/lib/auth";
import { HttpError, handle } from "@/lib/http";

import User from "@/models/User";
import EmailVerification from "@/models/EmailVerification";

export const POST = handle(async (req) => {
  const body = await req.json().catch(() => ({}));

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();

  const otp = String(body.otp ?? "").trim();

  if (!email) {
    throw new HttpError(
      400,
      "Email is required"
    );
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new HttpError(
      400,
      "OTP must be 6 digits"
    );
  }

  await connectDB();

  // Find pending registration
  const verification =
    await EmailVerification.findOne({
      email,
      expiresAt: {
        $gt: new Date(),
      },
    });

  if (!verification) {
    throw new HttpError(
      400,
      "OTP is invalid or expired"
    );
  }

  // Hash entered OTP
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // Compare OTP
  if (otpHash !== verification.otpHash) {
    throw new HttpError(
      400,
      "Invalid OTP"
    );
  }

  // Make sure user wasn't created already
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    await EmailVerification.deleteOne({
      _id: verification._id,
    });

    throw new HttpError(
      409,
      "Email is already registered"
    );
  }

  // Determine role
  const isFirst =
    (await User.countDocuments()) === 0;

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const role =
    isFirst ||
    (adminEmail && adminEmail === email)
      ? "admin"
      : "user";

  // Create actual user
  const user = await User.create({
    name: verification.name,
    email: verification.email,
    passwordHash: verification.passwordHash,
    role,
  });

  // Delete temporary verification data
  await EmailVerification.deleteOne({
    _id: verification._id,
  });

  // Login user immediately
 return Response.json(
  {
    message: "Email verified successfully. Please login.",
  },
  { status: 201 }
);
});