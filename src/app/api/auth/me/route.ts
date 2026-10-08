import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import {
  authResponse,
  clearAuthCookie,
} from "@/lib/auth";

import { connectDB } from "@/lib/db";

import {
  HttpError,
  handle,
  requireSession,
} from "@/lib/http";

import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";

/* =====================================================
   GET CURRENT USER
===================================================== */

export const GET = handle(async () => {
  const session = await requireSession();

  await connectDB();

  /* =====================================================
     CHECK IF USER IS BLOCKED
  ===================================================== */

  const blockedUser =
    await BlockedUser.findOne({
      userId: session.id,
    });

  if (blockedUser) {
    const response = NextResponse.json(
      {
        error:
          "Your account has been blocked by the administrator.",
        code: "ACCOUNT_BLOCKED",
      },
      {
        status: 403,
      }
    );

    return clearAuthCookie(response);
  }

  /* =====================================================
     FIND USER
  ===================================================== */

  const user = await User.findById(
    session.id
  );

  if (!user) {
    return clearAuthCookie(
      NextResponse.json(
        {
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      )
    );
  }

  return NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* =====================================================
   UPDATE NAME / PASSWORD
===================================================== */

export const PATCH = handle(async (req) => {
  const session = await requireSession();

  await connectDB();

  /* =====================================================
     CHECK BLOCKED USER
  ===================================================== */

  const blockedUser =
    await BlockedUser.findOne({
      userId: session.id,
    });

  if (blockedUser) {
    const response = NextResponse.json(
      {
        error:
          "Your account has been blocked by the administrator.",
        code: "ACCOUNT_BLOCKED",
      },
      {
        status: 403,
      }
    );

    return clearAuthCookie(response);
  }

  /* =====================================================
     FIND USER
  ===================================================== */

  const user = await User.findById(
    session.id
  );

  if (!user) {
    throw new HttpError(
      401,
      "Not authenticated"
    );
  }

  const body = await req
    .json()
    .catch(() => ({}));

  /* =====================================================
     UPDATE NAME
  ===================================================== */

  if (body.name !== undefined) {
    const name = String(
      body.name
    ).trim();

    if (name.length < 2) {
      throw new HttpError(
        400,
        "Name must be at least 2 characters"
      );
    }

    user.name = name;
  }

  /* =====================================================
     UPDATE PASSWORD
  ===================================================== */

  if (
    body.newPassword !== undefined
  ) {
    const next = String(
      body.newPassword
    );

    if (next.length < 8) {
      throw new HttpError(
        400,
        "New password must be at least 8 characters"
      );
    }

    const ok =
      await bcrypt.compare(
        String(
          body.currentPassword ?? ""
        ),
        user.passwordHash
      );

    if (!ok) {
      throw new HttpError(
        400,
        "Current password is incorrect"
      );
    }

    user.passwordHash =
      await bcrypt.hash(
        next,
        12
      );
  }

  await user.save();

  return authResponse(user);
});