import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";

/* =====================================================
   BLOCK / UNBLOCK
===================================================== */

export async function PATCH(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    const userId = context.params.id;

    console.log("ADMIN USER ACTION");
    console.log("USER ID:", userId);

    const body = await request.json();

    console.log("BODY:", body);

    const action = body?.action;

    if (action !== "block" && action !== "unblock") {
      return NextResponse.json(
        {
          error: "Invalid action",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      _id: userId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       BLOCK
    ===================================================== */

    if (action === "block") {
      await BlockedUser.updateOne(
        {
          userId: user._id,
        },
        {
          $set: {
            userId: user._id,
          },
        },
        {
          upsert: true,
        }
      );

      return NextResponse.json({
        message: "User blocked successfully",
        isBlocked: true,
      });
    }

    /* =====================================================
       UNBLOCK
    ===================================================== */

    await BlockedUser.deleteOne({
      userId: user._id,
    });

    return NextResponse.json({
      message: "User unblocked successfully",
      isBlocked: false,
    });
  } catch (error) {
    console.error(
      "BLOCK / UNBLOCK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   DELETE
===================================================== */

export async function DELETE(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    await connectDB();

    const userId = context.params.id;

    const user = await User.findOne({
      _id: userId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    await BlockedUser.deleteOne({
      userId: user._id,
    });

    await User.deleteOne({
      _id: user._id,
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}