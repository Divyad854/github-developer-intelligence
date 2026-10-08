import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { authResponse } from "@/lib/auth";
import { HttpError, handle } from "@/lib/http";

import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";

export const POST = handle(async (req) => {
  const body = await req.json().catch(() => ({}));

  const email = String(
    body.email ?? ""
  )
    .trim()
    .toLowerCase();

  const password = String(
    body.password ?? ""
  );

  if (!email || !password) {
    throw new HttpError(
      400,
      "Email and password are required"
    );
  }

  await connectDB();

  /* =====================================================
     FIND USER
  ===================================================== */

  const user = await User.findOne({
    email,
  });

  /* =====================================================
     CHECK PASSWORD
  ===================================================== */

  const ok = user
    ? await bcrypt.compare(
        password,
        user.passwordHash
      )
    : false;

  if (!user || !ok) {
    throw new HttpError(
      401,
      "Invalid email or password"
    );
  }

  /* =====================================================
     CHECK IF USER IS BLOCKED
  ===================================================== */

  const blockedUser =
    await BlockedUser.findOne({
      userId: user._id,
    });

  if (blockedUser) {
    throw new HttpError(
      403,
      "Your account has been blocked by the administrator."
    );
  }

  /* =====================================================
     LOGIN
  ===================================================== */

  return authResponse(user);
});