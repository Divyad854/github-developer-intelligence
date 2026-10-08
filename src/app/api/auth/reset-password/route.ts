import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { HttpError, handle } from "@/lib/http";

import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";

export const POST = handle(async (req) => {
  const body = await req.json().catch(() => ({}));

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();

  const otp = String(body.otp ?? "").trim();

  const newPassword = String(
    body.newPassword ?? ""
  );

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

  if (newPassword.length < 8) {
    throw new HttpError(
      400,
      "Password must be at least 8 characters"
    );
  }

  await connectDB();

  const reset = await PasswordReset.findOne({
    email,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!reset) {
    throw new HttpError(
      400,
      "OTP is invalid or expired"
    );
  }

  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (otpHash !== reset.otpHash) {
    throw new HttpError(
      400,
      "Invalid OTP"
    );
  }

  const passwordHash =
    await bcrypt.hash(newPassword, 12);

  const user = await User.findOneAndUpdate(
    { email },
    { passwordHash },
    { new: true }
  );

  if (!user) {
    throw new HttpError(
      404,
      "User not found"
    );
  }

  await PasswordReset.deleteOne({
    _id: reset._id,
  });

  return Response.json({
    message:
      "Password reset successfully. Please login.",
  });
});