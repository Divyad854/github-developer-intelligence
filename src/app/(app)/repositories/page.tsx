"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Card,
  ErrorBox,
  PageHeader,
  Spinner,
  fmtDate,
} from "@/components/ui";
import { searchRepos } from "@/store/githubSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RepoDTO } from "@/lib/types";

interface Contributor {
  username: string;
  avatar: string;
  url: string;
  commits: number;
  percentage: number;
}

type RepoWithContributors = RepoDTO & {
  contributors?: Contributor[];
};

function RepositoriesInner() {
  const dispatch = useAppDispatch();

  const qp = useSearchParams().get("username");

  const {
    repos,
    repoLanguages,
    reposLoading,
    report,
    error,
  } = useAppSelector((s) => s.github);

  const [username, setUsername] = useState(
    qp ?? report?.analysis.profile.username ?? ""
  );

  const [q, setQ] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("stars");
  const [forks, setForks] = useState(false);

  useEffect(() => {
    if (!username.trim()) return;

    const t = setTimeout(() => {
      dispatch(
        searchRepos({
          username: username.trim(),
          q,
          language,
          sort,
          forks,
        })
      );
    }, 250);

    return () => clearTimeout(t);
  }, [
    username,
    q,
    language,
    sort,
    forks,
    dispatch,
  ]);

  return (
    <>
      <PageHeader
        title="Repositories"
        subtitle="Search and filter the repositories stored for an analyzed developer"
      />

      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="label">
              Username
            </label>

            <input
              className="input"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="octocat"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">
              Search
            </label>

            <input
              className="input"
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="name, description or topic"
            />
          </div>

          <div>
            <label className="label">
              Language
            </label>

            <select
              className="input"
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              <option value="">
                All
              </option>

              {repoLanguages.map((l) => (
                <option key={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Sort by
            </label>

            <select
              className="input"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
            >
              <option value="stars">
                Stars
              </option>

              <option value="forks">
                Forks
              </option>

              <option value="updated">
                Last updated
              </option>

              <option value="created">
                Created
              </option>

              <option value="name">
                Name
              </option>
            </select>
          </div>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={forks}
            onChange={(e) =>
              setForks(e.target.checked)
            }
          />

          Include forked repositories
        </label>
      </Card>

      <ErrorBox message={error} />

      {reposLoading && !repos.length ? (
        <Spinner />
      ) : !repos.length ? (
        <p className="text-sm text-slate-500">
          No repositories found. Make sure this developer was{" "}
          <Link
            href="/analyze"
            className="text-indigo-600 hover:underline"
          >
            analyzed
          </Link>{" "}
          first.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
          {repos.map((repo) => {
            const r =
              repo as RepoWithContributors;

            const contributors =
              r.contributors ?? [];

            return (
              <div
                key={r.repoId}
                className="card"
              >
                {/* Repository Header */}
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-indigo-700 hover:underline"
                  >
                    {r.name}
                  </a>

                  <span className="shrink-0 text-xs text-slate-500">
                    ★ {r.stars} · ⑂ {r.forks}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-1 min-h-[2.5rem] text-sm text-slate-500">
                  {r.description ||
                    "No description"}
                </p>

                {/* Topics */}
                {r.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {r.topics
                      .slice(0, 6)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-300"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}

                {/* Repository Information */}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    {r.language ?? "—"}
                  </span>

                  <span>
                    Created{" "}
                    {fmtDate(
                      r.createdAt,
                      true
                    )}
                  </span>

                  <span>
                    Updated{" "}
                    {fmtDate(
                      r.pushedAt,
                      true
                    )}
                  </span>

                  {r.fork && (
                    <span className="text-amber-400">
                      fork
                    </span>
                  )}

                  {r.archived && (
                    <span className="text-rose-400">
                      archived
                    </span>
                  )}
                </div>

                {/* Collaboration */}
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Collaboration
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Contribution based on commits
                      </p>
                    </div>

                    {contributors.length > 0 && (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                        {contributors.length}{" "}
                        {contributors.length === 1
                          ? "Contributor"
                          : "Contributors"}
                      </span>
                    )}
                  </div>

                  {contributors.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white/40 p-3">
                      <p className="text-xs text-slate-500">
                        No contributor information
                        available.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      {/* Table Header */}
                      <div className="grid grid-cols-[1fr_70px_80px] gap-2 bg-white/80 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        <span>
                          Developer
                        </span>

                        <span className="text-right">
                          Commits
                        </span>

                        <span className="text-right">
                          Contribution
                        </span>
                      </div>

                      {/* Contributors */}
                      <div className="divide-y divide-slate-800">
                        {contributors.map(
                          (contributor) => (
                            <div
                              key={`${r.repoId}-${contributor.username}`}
                              className="grid grid-cols-[1fr_70px_80px] items-center gap-2 px-3 py-2.5"
                            >
                              {/* Developer */}
                              <a
                                href={
                                  contributor.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-w-0 items-center gap-2"
                              >
                                {contributor.avatar ? (
                                  <img
                                    src={
                                      contributor.avatar
                                    }
                                    alt={
                                      contributor.username
                                    }
                                    className="h-7 w-7 shrink-0 rounded-full"
                                  />
                                ) : (
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
                                    {contributor.username
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}

                                <span className="truncate text-sm text-slate-700 hover:text-indigo-600 hover:underline">
                                  {
                                    contributor.username
                                  }
                                </span>
                              </a>

                              {/* Commits */}
                              <span className="text-right text-xs text-slate-500">
                                {
                                  contributor.commits
                                }
                              </span>

                              {/* Percentage */}
                              <span className="text-right text-xs font-semibold text-indigo-600">
                                {
                                  contributor.percentage
                                }
                                %
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contribution Progress */}
                  {contributors.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {contributors.map(
                        (contributor) => (
                          <div
                            key={`progress-${r.repoId}-${contributor.username}`}
                          >
                            <div className="mb-1 flex items-center justify-between text-[11px]">
                              <span className="max-w-[70%] truncate text-slate-500">
                                {
                                  contributor.username
                                }
                              </span>

                              <span className="text-slate-500">
                                {
                                  contributor.percentage
                                }
                                %
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-emerald-400 transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      contributor.percentage
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <RepositoriesInner />
    </Suspense>
  );
}