"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  Card,
  ErrorBox,
  PageHeader,
  Spinner,
  Stat,
  fmtDate,
} from "@/components/ui";

import { api } from "@/lib/api";

/* =====================================================
   TYPES
===================================================== */

interface AdminStats {
  totalUsers: number;
  totalAnalyses: number;
  newUsers: number;
  adminUsers: number;

  mostAnalyzed: {
    username: string;
    avatar: string;
    count: number;
  }[];

  userGrowth: {
    month: string;
    users: number;
  }[];

  analysisGrowth: {
    month: string;
    analyses: number;
  }[];

  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];

  recentAnalyses: {
    id: string;
    username: string;
    avatar: string;
    createdAt: string;
    by: string;
  }[];
}

/* =====================================================
   PIE COLORS
===================================================== */

const PIE_COLORS = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

/* =====================================================
   ADMIN DASHBOARD
===================================================== */

export default function AdminDashboardPage() {
  const [data, setData] =
    useState<AdminStats | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  /* =====================================================
     FETCH DATA
  ===================================================== */

  useEffect(() => {
    api<AdminStats>("/api/admin/stats")
      .then(setData)
      .catch((e: Error) => {
        setError(
          e.message ||
            "Failed to load admin dashboard"
        );
      });
  }, []);

  /* =====================================================
     PIE DATA
     
     Show top 5 developers and combine
     the remaining developers into "Others".
  ===================================================== */

  const developerPieData = useMemo(() => {
    if (!data) {
      return [];
    }

    const developers =
      data.mostAnalyzed || [];

    if (developers.length <= 5) {
      return developers.map(
        (developer) => ({
          name: developer.username,
          value: developer.count,
        })
      );
    }

    const topFive =
      developers.slice(0, 5);

    const othersCount =
      developers
        .slice(5)
        .reduce(
          (total, developer) =>
            total + developer.count,
          0
        );

    const result = topFive.map(
      (developer) => ({
        name: developer.username,
        value: developer.count,
      })
    );

    if (othersCount > 0) {
      result.push({
        name: "Others",
        value: othersCount,
      });
    }

    return result;
  }, [data]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (!data && !error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner label="Loading admin dashboard…" />
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Monitor users and platform activity"
        />

        <ErrorBox message={error} />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (
    <div className="space-y-6">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor users, GitHub analyses, and platform activity"
      />

      {/* =================================================
          STAT CARDS
      ================================================= */}

<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

  <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-500 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <p className="text-sm font-medium text-slate-500">👥 Registered Users</p>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
      {data.totalUsers ?? 0}
    </p>
    <p className="mt-1 text-xs text-slate-400">Total registered accounts</p>
  </div>

  <div className="rounded-xl border border-slate-200 border-l-4 border-l-violet-500 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <p className="text-sm font-medium text-slate-500">📊 GitHub Analyses</p>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
      {data.totalAnalyses ?? 0}
    </p>
    <p className="mt-1 text-xs text-slate-400">Total analyses completed</p>
  </div>

  <div className="rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <p className="text-sm font-medium text-slate-500">👤 New Users</p>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
      {data.newUsers ?? 0}
    </p>
    <p className="mt-1 text-xs text-slate-400">New user accounts</p>
  </div>

  <div className="rounded-xl border border-slate-200 border-l-4 border-l-amber-500 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
    <p className="text-sm font-medium text-slate-500">🛡️ Admin Users</p>
    <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
      {data.adminUsers ?? 0}
    </p>
    <p className="mt-1 text-xs text-slate-400">Administrator accounts</p>
  </div>

</div>
      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

<Card title="Quick Actions" className="mb-6">
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

    {/* MANAGE USERS */}
    <Link
      href="/admin/users"
      className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-2xl">
          👥
        </div>
        <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
          Manage Users
        </h3>
      </div>

      <p className="mt-4 text-sm leading-5 text-slate-500">
        View and manage registered users
      </p>
    </Link>

    {/* ANALYSIS DETAILS */}
    <Link
      href="/admin/analyses"
      className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-2xl">
          📊
        </div>
        <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
          Analysis Details
        </h3>
      </div>

      <p className="mt-4 text-sm leading-5 text-slate-500">
        View and manage project analyses
      </p>
    </Link>

    {/* PROFILE */}
    <Link
      href="/admin/profile"
      className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-2xl">
          👤
        </div>
        <h3 className="font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
          Profile
        </h3>
      </div>

      <p className="mt-4 text-sm leading-5 text-slate-500">
        View and manage your administrator profile
      </p>
    </Link>

  </div>
</Card>


      {/* =================================================
          CHARTS
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* =================================================
            USER GROWTH
            LINE CHART
        ================================================= */}

        <Card title="User Growth">

          <div className="h-80 w-full">

            {data.userGrowth.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-500">
                  No user growth data available.
                </p>
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={data.userGrowth}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                    axisLine={{
                      stroke: "#334155",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        "#0f172a",
                      border:
                        "1px solid #334155",
                      borderRadius:
                        "8px",
                      color: "#f8fafc",
                    }}
                    labelStyle={{
                      color: "#cbd5e1",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#10b981",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>
              </ResponsiveContainer>
            )}

          </div>

        </Card>

        {/* =================================================
            ANALYSIS ACTIVITY
            BAR CHART
        ================================================= */}
{/* =================================================
    ANALYSIS ACTIVITY
    THIN BAR CHART
================================================= */}

<Card title="Analysis Activity">

  <div className="h-72 w-full">

    {data.analysisGrowth.length === 0 ? (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500">
          No analysis activity available.
        </p>
      </div>
    ) : (
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data.analysisGrowth}
          margin={{
            top: 10,
            right: 15,
            left: 0,
            bottom: 5,
          }}
          barCategoryGap="35%"
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "#334155",
            }}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
            }}
            labelStyle={{
              color: "#cbd5e1",
            }}
            cursor={{
              fill: "rgba(148, 163, 184, 0.05)",
            }}
          />

          <Bar
            dataKey="analyses"
            name="Analyses"
            fill="#3b82f6"
            barSize={27}
            maxBarSize={27}
            radius={[5, 5, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    )}

  </div>

</Card>

      </div>

      {/* =================================================
          MOST ANALYZED DEVELOPERS
          PIE CHART
      ================================================= */}

      <Card title="Most Analyzed Developers">

        <div className="h-96 w-full">

          {developerPieData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-500">
                No developer analysis data available.
              </p>
            </div>
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={developerPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={125}
                  innerRadius={55}
                  paddingAngle={2}
                  label
                >

                  {developerPieData.map(
                    (entry, index) => (
                      <Cell
                        key={`developer-${index}`}
                        fill={
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius:
                      "8px",
                    color: "#f8fafc",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#cbd5e1",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          )}

        </div>

      </Card>

      {/* =================================================
          RECENT DATA
      ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* =================================================
            RECENT USERS
        ================================================= */}

        <Card title="Recent Users">

          <ul className="divide-y divide-slate-800">

            {data.recentUsers.length === 0 ? (
              <li className="py-4 text-sm text-slate-500">
                No users yet.
              </li>
            ) : (
              data.recentUsers.map(
                (user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between gap-3 py-4"
                  >

                    <div className="min-w-0">

                      <div className="truncate text-sm font-medium text-slate-900">
                        {user.name}
                      </div>

                      <div className="mt-1 truncate text-xs text-slate-500">
                        {user.email}
                      </div>

                    </div>

                    <div className="shrink-0 text-right">

                      <div
                        className={`text-xs font-medium ${
                          user.role ===
                          "admin"
                            ? "text-indigo-600"
                            : "text-slate-500"
                        }`}
                      >
                        {user.role}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {fmtDate(
                          user.createdAt,
                          true
                        )}
                      </div>

                    </div>

                  </li>
                )
              )
            )}

          </ul>

          <div className="mt-4 border-t border-slate-200 pt-4">

            <Link
              href="/admin/users"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View all users →
            </Link>

          </div>

        </Card>

        {/* =================================================
            RECENT ANALYSES
        ================================================= */}

        <Card title="Recent Analyses">

          <ul className="divide-y divide-slate-800">

            {data.recentAnalyses.length === 0 ? (
              <li className="py-4 text-sm text-slate-500">
                No analyses yet.
              </li>
            ) : (
              data.recentAnalyses.map(
                (analysis) => (
                  <li
                    key={analysis.id}
                    className="flex items-center gap-3 py-4"
                  >

                    {/* AVATAR */}

                    {analysis.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={analysis.avatar}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-700">
                        {analysis.username
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "?"}
                      </div>
                    )}

                    {/* INFO */}

                    <div className="min-w-0 flex-1">

                      <div className="truncate text-sm font-medium text-slate-900">
                        {analysis.username}
                      </div>

                      <div className="mt-1 truncate text-xs text-slate-500">
                        Analyzed by{" "}
                        {analysis.by}
                      </div>

                    </div>

                    {/* DATE */}

                    <div className="shrink-0 text-xs text-slate-500">
                      {fmtDate(
                        analysis.createdAt,
                        true
                      )}
                    </div>

                  </li>
                )
              )
            )}

          </ul>

        </Card>

      </div>

    </div>
  );
}