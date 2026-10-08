import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import {
  HttpError,
  handle,
  requireSession,
} from "@/lib/http";

import User from "@/models/User";

export const GET = handle(async () => {
  const session = await requireSession();

  await connectDB();

  const user = await User.findById(
    session.id
  ).select(
    "_id name email role"
  );

  if (!user) {
    throw new HttpError(
      404,
      "User not found"
    );
  }

  if (user.role !== "admin") {
    throw new HttpError(
      403,
      "Admin access required"
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