import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({
      role: { $ne: "admin" },
    })
      .sort({ createdAt: -1 })
      .select("_id name email role createdAt")
      .lean();

    const blockedUsers =
      await BlockedUser.find({})
        .select("userId")
        .lean();

    const blockedIds = new Set(
      blockedUsers.map((item) =>
        String(item.userId)
      )
    );

    const result = users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: blockedIds.has(
        String(user._id)
      ),
      createdAt: user.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "GET ADMIN USERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load users",
      },
      {
        status: 500,
      }
    );
  }
}