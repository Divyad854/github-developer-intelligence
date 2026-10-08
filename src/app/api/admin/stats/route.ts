import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import User from "@/models/User";
import AnalysisHistory from "@/models/AnalysisHistory";

export async function GET() {
  try {
    await connectDB();

    /* =====================================================
       TOTAL NORMAL USERS
    ===================================================== */

    const totalUsers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    /* =====================================================
       ADMIN USERS
       Keep this only if you want admin count.
    ===================================================== */

    const adminUsers = await User.countDocuments({
      role: "admin",
    });

    /* =====================================================
       NEW NORMAL USERS THIS MONTH
    ===================================================== */

    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsers = await User.countDocuments({
      role: { $ne: "admin" },

      createdAt: {
        $gte: startOfMonth,
      },
    });

    /* =====================================================
       NORMAL USER IDs
       Used to exclude admin analysis records
    ===================================================== */

    const normalUsers = await User.find({
      role: { $ne: "admin" },
    })
      .select("_id")
      .lean();

    const normalUserIds = normalUsers.map(
      (user) => user._id
    );

    /* =====================================================
       TOTAL ANALYSES BY NORMAL USERS ONLY
    ===================================================== */

    const totalAnalyses =
      await AnalysisHistory.countDocuments({
        userId: {
          $in: normalUserIds,
        },
      });

    /* =====================================================
       MOST ANALYZED DEVELOPERS
       NORMAL USERS ONLY
    ===================================================== */

    const mostAnalyzedRaw =
      await AnalysisHistory.aggregate([
        {
          $match: {
            userId: {
              $in: normalUserIds,
            },
          },
        },

        {
          $group: {
            _id: "$usernameLower",

            username: {
              $first: "$username",
            },

            avatar: {
              $first: "$avatar",
            },

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },

        {
          $limit: 10,
        },
      ]);

    const mostAnalyzed =
      mostAnalyzedRaw.map((item) => ({
        username:
          item.username || item._id,

        avatar:
          item.avatar || "",

        count: item.count,
      }));

    /* =====================================================
       ANALYSIS ACTIVITY
       NORMAL USERS ONLY
    ===================================================== */

    const analysisGrowthRaw =
      await AnalysisHistory.aggregate([
        {
          $match: {
            userId: {
              $in: normalUserIds,
            },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            analyses: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },

        {
          $limit: 12,
        },
      ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const analysisGrowth =
      analysisGrowthRaw.map((item) => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,

        analyses: item.analyses,
      }));

    /* =====================================================
       USER GROWTH
       NORMAL USERS ONLY
    ===================================================== */

    const userGrowthRaw =
      await User.aggregate([
        {
          $match: {
            role: { $ne: "admin" },
          },
        },

        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },

              month: {
                $month: "$createdAt",
              },
            },

            users: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },

        {
          $limit: 12,
        },
      ]);

    const userGrowth =
      userGrowthRaw.map((item) => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,

        users: item.users,
      }));

    /* =====================================================
       RECENT NORMAL USERS
    ===================================================== */

    const recentUsersRaw =
      await User.find({
        role: { $ne: "admin" },
      })
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .select(
          "_id name email role createdAt"
        )
        .lean();

    const recentUsers =
      recentUsersRaw.map((user) => ({
        id: String(user._id),

        name: user.name,

        email: user.email,

        role: user.role,

        createdAt: user.createdAt,
      }));

    /* =====================================================
       RECENT ANALYSES
       NORMAL USERS ONLY
    ===================================================== */

    const recentAnalysesRaw =
      await AnalysisHistory.find({
        userId: {
          $in: normalUserIds,
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .select(
          "_id username avatar userId createdAt"
        )
        .lean();

    /* =====================================================
       GET NORMAL USERS WHO PERFORMED ANALYSIS
    ===================================================== */

    const userIds = recentAnalysesRaw
      .map((analysis) => analysis.userId)
      .filter(Boolean);

    const analysisUsers =
      await User.find({
        _id: {
          $in: userIds,
        },

        role: {
          $ne: "admin",
        },
      })
        .select("_id name email")
        .lean();

    const userMap = new Map(
      analysisUsers.map((user) => [
        String(user._id),
        user,
      ])
    );

    /* =====================================================
       FORMAT RECENT ANALYSES
    ===================================================== */

    const recentAnalyses =
      recentAnalysesRaw.map((analysis) => {
        const user = analysis.userId
          ? userMap.get(
              String(analysis.userId)
            )
          : undefined;

        return {
          id: String(analysis._id),

          username:
            analysis.username || "",

          avatar:
            analysis.avatar || "",

          createdAt:
            analysis.createdAt,

          by:
            user?.name ||
            user?.email ||
            "Unknown",
        };
      });

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      totalUsers,

      totalAnalyses,

      newUsers,

      adminUsers,

      mostAnalyzed,

      userGrowth,

      analysisGrowth,

      recentUsers,

      recentAnalyses,
    });
  } catch (error) {
    console.error(
      "Admin stats error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load admin statistics",
      },
      {
        status: 500,
      }
    );
  }
}