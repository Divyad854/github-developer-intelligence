import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import AnalysisHistory from "@/models/AnalysisHistory";

export async function GET() {
  try {
    await connectDB();

    // Get only normal users.
    // Admin users are excluded.
    const users = await User.find({
      role: { $ne: "admin" },
    })
      .select("_id name email")
      .lean();

    const userIds = users.map(
      (user) => user._id
    );

    // Get analyses created by normal users
    const analyses =
      await AnalysisHistory.find({
        userId: {
          $in: userIds,
        },
      })
        .sort({
          createdAt: -1,
        })
        .select(
          "_id userId username avatar topLanguage scores createdAt"
        )
        .lean();

    // Create user lookup
    const userMap = new Map(
      users.map((user) => [
        String(user._id),
        user,
      ])
    );

    const result = analyses.map(
      (analysis) => {
        const user = userMap.get(
          String(analysis.userId)
        );

        const scores = analysis.scores || {};

        const frontend =
          Number(scores.frontend) || 0;

        const backend =
          Number(scores.backend) || 0;

        const openSource =
          Number(scores.openSource) || 0;

        const activity =
          Number(scores.activity) || 0;

        const project =
          Number(scores.project) || 0;

        // Calculate overall score
        const overallScore = Math.round(
          (
            frontend +
            backend +
            openSource +
            activity +
            project
          ) / 5
        );

        return {
          id: String(analysis._id),

          developer: {
            username:
              analysis.username || "",
            avatar:
              analysis.avatar || "",
          },

          analyzedBy: {
            id: user
              ? String(user._id)
              : "",
            name:
              user?.name || "Unknown",
            email:
              user?.email || "",
          },

          topLanguage:
            analysis.topLanguage || "N/A",

          scores: {
            frontend,
            backend,
            openSource,
            activity,
            project,
          },

          overallScore,

          createdAt:
            analysis.createdAt,
        };
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "ADMIN ANALYSES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load analyses",
      },
      {
        status: 500,
      }
    );
  }
}