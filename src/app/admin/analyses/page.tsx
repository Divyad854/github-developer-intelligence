"use client";

import { useEffect, useState } from "react";

import {
  Card,
  ErrorBox,
  PageHeader,
  Spinner,
  fmtDate,
} from "@/components/ui";

import { api } from "@/lib/api";

interface Scores {
  frontend: number;
  backend: number;
  openSource: number;
  activity: number;
  project: number;
}

interface Analysis {
  id: string;

  developer: {
    username: string;
    avatar: string;
  };

  analyzedBy: {
    id: string;
    name: string;
    email: string;
  };

  topLanguage: string;

  scores: Scores;

  overallScore: number;

  createdAt: string;
}

export default function AdminAnalysesPage() {
  const [analyses, setAnalyses] =
    useState<Analysis[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [selectedAnalysis, setSelectedAnalysis] =
    useState<Analysis | null>(null);

  async function loadAnalyses() {
    try {
      setLoading(true);
      setError(null);

      const result =
        await api<Analysis[]>(
          "/api/admin/analyses"
        );

      setAnalyses(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load analyses"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  const filteredAnalyses =
    analyses.filter((analysis) => {
      const query =
        search.trim().toLowerCase();

      if (!query) return true;

      return (
        analysis.developer.username
          .toLowerCase()
          .includes(query) ||
        analysis.analyzedBy.name
          .toLowerCase()
          .includes(query) ||
        analysis.analyzedBy.email
          .toLowerCase()
          .includes(query)
      );
    });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner label="Loading analyses…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <PageHeader
        title="Analyses"
        subtitle="View developer analysis history"
      />

      {/* ================= ERROR ================= */}

      {error && (
        <ErrorBox message={error} />
      )}

      {/* ================= SEARCH ================= */}

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Analysis History
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredAnalyses.length} analysis
              {filteredAnalyses.length !== 1
                ? "es"
                : ""}
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search developer or user..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-500 focus:border-indigo-500 md:w-80"
          />

        </div>
      </Card>

      {/* ================= TABLE ================= */}

      <Card>

        {filteredAnalyses.length === 0 ? (
          <div className="py-12 text-center">

            <div className="text-4xl">
              📊
            </div>

            <p className="mt-3 text-sm text-slate-500">
              No analyses found.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b border-slate-200">

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Developer
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Analyzed By
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Most used Language
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Score
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredAnalyses.map(
                  (analysis) => (
                    <tr
                      key={analysis.id}
                      className="border-b border-slate-200 transition hover:bg-slate-200/30"
                    >

                      {/* DEVELOPER */}

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          {analysis.developer.avatar ? (
                            <img
                              src={
                                analysis
                                  .developer
                                  .avatar
                              }
                              alt=""
                              className="h-9 w-9 rounded-full"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                              {analysis
                                .developer
                                .username
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "U"}
                            </div>
                          )}

                          <div className="text-sm font-medium text-slate-900">
                            {
                              analysis
                                .developer
                                .username
                            }
                          </div>

                        </div>

                      </td>

                      {/* ANALYZED BY */}

                      <td className="px-4 py-4">

                        <div className="text-sm text-slate-800">
                          {
                            analysis
                              .analyzedBy
                              .name
                          }
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {
                            analysis
                              .analyzedBy
                              .email
                          }
                        </div>

                      </td>

                      {/* LANGUAGE */}

                      <td className="px-4 py-4">

                        <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                          {
                            analysis
                              .topLanguage
                          }
                        </span>

                      </td>

                      {/* SCORE */}

                      <td className="px-4 py-4">

                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                          {
                            analysis
                              .overallScore
                          }
                          /100
                        </span>

                      </td>

                      {/* DATE */}

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {fmtDate(
                          analysis.createdAt,
                          true
                        )}
                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAnalysis(
                              analysis
                            )
                          }
                          className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>

      {/* =====================================================
          ANALYSIS DETAILS MODAL
          ===================================================== */}

      {selectedAnalysis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() =>
            setSelectedAnalysis(null)
          }
        >

          {/* MODAL */}

          <div
            className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ================= MODAL HEADER ================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Analysis Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complete developer analysis
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAnalysis(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                ×
              </button>

            </div>

            {/* ================= MODAL BODY ================= */}

            <div className="space-y-5 p-6">

              {/* ================= DEVELOPER INFO ================= */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center gap-4">

                  {/* AVATAR */}

                  {selectedAnalysis.developer.avatar ? (
                    <img
                      src={
                        selectedAnalysis
                          .developer
                          .avatar
                      }
                      alt=""
                      className="h-14 w-14 rounded-full border border-slate-300"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-lg font-semibold text-indigo-600">
                      {selectedAnalysis
                        .developer
                        .username
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>
                  )}

                  {/* INFO */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">

                      <h3 className="text-lg font-semibold text-slate-900">
                        {
                          selectedAnalysis
                            .developer
                            .username
                        }
                      </h3>

                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                        Developer
                      </span>

                    </div>

                    <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">

                      <div>
                        <span className="text-slate-500">
                          Analyzed By:{" "}
                        </span>

                        <span className="text-slate-700">
                          {
                            selectedAnalysis
                              .analyzedBy
                              .name
                          }
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-500">
                          Date:{" "}
                        </span>

                        <span className="text-slate-700">
                          {fmtDate(
                            selectedAnalysis.createdAt,
                            true
                          )}
                        </span>
                      </div>

                    </div>

                    <div className="mt-1 truncate text-xs text-slate-500">
                      {
                        selectedAnalysis
                          .analyzedBy
                          .email
                      }
                    </div>

                  </div>

                </div>

              </div>

              {/* ================= TOP LANGUAGE + OVERALL ================= */}

              <div className="grid gap-4 md:grid-cols-2">

                {/* TOP LANGUAGE */}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Top Language
                  </div>

                  <div className="mt-3 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-lg">
                      💻
                    </div>

                    <div className="text-xl font-semibold text-indigo-600">
                      {
                        selectedAnalysis
                          .topLanguage
                      }
                    </div>

                  </div>

                </div>

                {/* OVERALL SCORE */}

                <div className="rounded-xl border border-indigo-100 bg-indigo-600/5 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Overall Score
                      </div>

                      <div className="mt-2 text-xs text-slate-500">
                        Average of 5 categories
                      </div>

                    </div>

                    <div className="text-3xl font-bold text-indigo-600">

                      {
                        selectedAnalysis
                          .overallScore
                      }

                      <span className="ml-1 text-sm font-medium text-slate-500">
                        /100
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= SCORES ================= */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-sm font-semibold text-slate-900">
                    Scores
                  </h3>

                  <span className="text-xs text-slate-500">
                    Skill breakdown
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

                  <ScoreCard
                    label="Frontend"
                    score={
                      selectedAnalysis
                        .scores
                        .frontend
                    }
                  />

                  <ScoreCard
                    label="Backend"
                    score={
                      selectedAnalysis
                        .scores
                        .backend
                    }
                  />

                  <ScoreCard
                    label="Open Source"
                    score={
                      selectedAnalysis
                        .scores
                        .openSource
                    }
                  />

                  <ScoreCard
                    label="Activity"
                    score={
                      selectedAnalysis
                        .scores
                        .activity
                    }
                  />

                  <ScoreCard
                    label="Projects"
                    score={
                      selectedAnalysis
                        .scores
                        .project
                    }
                  />

                </div>

              </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="flex justify-end border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSelectedAnalysis(null)
                }
                className="btn-ghost"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =====================================================
   SCORE CARD
   ===================================================== */

function ScoreCard({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const safeScore = Math.min(
    100,
    Math.max(0, score)
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-4">

      <div className="flex flex-col gap-2">

        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className="text-xl font-semibold text-slate-900">
          {score}
        </span>

      </div>

      {/* SCORE BAR */}

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{
            width: `${safeScore}%`,
          }}
        />

      </div>

    </div>
  );
}