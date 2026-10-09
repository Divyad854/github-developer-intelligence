"use client";


import Link from "next/link";

import { useEffect, useMemo, useState } from "react";


import {

  Bar,

  BarChart,

  CartesianGrid,


  Line,

  LineChart,

  PolarAngleAxis,

  PolarGrid,

  PolarRadiusAxis,

  Radar,

  RadarChart,

  ResponsiveContainer,

  Tooltip,

  XAxis,

  YAxis,

} from "recharts";


import {

  Card,

  PageHeader,

  ScoreBar,

  Spinner,

  Stat,

  fmtDate,

} from "@/components/ui";


import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { loadHistory } from "@/store/githubSlice";

import { loadSaved } from "@/store/savedProfilesSlice";


const LINKS = [

  {

    href: "/analyze",

    title: "Analyze GitHub",

    desc: "Enter a profile URL and get a full report",

  },

  {

    href: "/history",

    title: "My Analyses",

    desc: "Reopen previous reports and track progress",

  },

  {

    href: "/saved",

    title: "Saved Profiles",

    desc: "Developers you want to monitor",

  },

  {

    href: "/compare",

    title: "Compare Developers",

    desc: "Put two profiles side by side",

  },

];


export default function DashboardPage() {

  const dispatch = useAppDispatch();


  const user = useAppSelector((s) => s.auth.user);


  const { history, historyLoading } = useAppSelector(

    (s) => s.github

  );


  const saved = useAppSelector((s) => s.savedProfiles);


  const [selectedUsername, setSelectedUsername] = useState("");


  useEffect(() => {

    dispatch(loadHistory());

    dispatch(loadSaved());

  }, [dispatch]);


  const uniqueDevelopers = useMemo(() => {

    return new Set(

      history.map((item) => item.username.toLowerCase())

    ).size;

  }, [history]);




  const developers = useMemo(() => {

    const map = new Map<string, (typeof history)[number]>();


    history.forEach((item) => {

      const key = item.username.toLowerCase();


      if (!map.has(key)) {

        map.set(key, item);

      }

    });


    return Array.from(map.values());

  }, [history]);


  useEffect(() => {

    if (!selectedUsername && developers.length > 0) {

      setSelectedUsername(developers[0].username);

    }

  }, [developers, selectedUsername]);


  const selectedDeveloper = useMemo(() => {

    return history.find(

      (item) =>

        item.username.toLowerCase() ===

        selectedUsername.toLowerCase()

    );

  }, [history, selectedUsername]);


  const selectedScoreData = useMemo(() => {

    if (!selectedDeveloper) {

      return [];

    }


    return [

      {

        subject: "Frontend",

        score: selectedDeveloper.scores.frontend || 0,

      },

      {

        subject: "Backend",

        score: selectedDeveloper.scores.backend || 0,

      },

      {

        subject: "Open Source",

        score: selectedDeveloper.scores.openSource || 0,

      },

      {

        subject: "Activity",

        score: selectedDeveloper.scores.activity || 0,

      },

      {

        subject: "Project",

        score: selectedDeveloper.scores.project || 0,

      },

    ];

  }, [selectedDeveloper]);

  const selectedScoreTrend = useMemo(() => {

    if (!selectedDeveloper) {

      return [];

    }


    return history

      .filter(

        (item) =>

          item.username.toLowerCase() ===

          selectedDeveloper.username.toLowerCase()

      )

      .slice(0, 10)

      .reverse()

      .map((item, index) => {

        const scores = item.scores;


        const overall = Math.round(

          (

            (scores.frontend || 0) +

            (scores.backend || 0) +

            (scores.openSource || 0) +

            (scores.activity || 0) +

            (scores.project || 0)

          ) / 5

        );


        return {

          name: `${index + 1}`,

          score: overall,

        };

      });

  }, [history, selectedDeveloper]);


  /*

   * =========================================================

   * ALL LANGUAGES

   * =========================================================

   *

   * We first try to find language information

   * inside the existing `analysis` snapshot.

   *

   * We DO NOT change AnalysisHistory.

   */


  const languageData = useMemo(() => {

    const counts: Record<string, number> = {};


    function addLanguage(language: string, value: number) {

      const clean = language.trim();


      if (!clean) return;


      counts[clean] = (counts[clean] || 0) + value;

    }


    function extractLanguages(analysis: unknown) {

      if (!analysis || typeof analysis !== "object") {

        return;

      }


      const data = analysis as Record<string, unknown>;


      /*

       * Possible existing structures.

       *

       * We do not modify your database.

       */


      const possible =

        data.languages ??

        data.languageStats ??

        data.languageBreakdown;


      if (

        possible &&

        typeof possible === "object" &&

        !Array.isArray(possible)

      ) {

        Object.entries(

          possible as Record<string, unknown>

        ).forEach(([language, value]) => {

          if (typeof value === "number") {

            addLanguage(language, value);

          }

        });

      }


      /*

       * GitHub-style languages object

       *

       * Example:

       * {

       *   JavaScript: 12000,

       *   Python: 5000

       * }

       */


      const githubLanguages = data.language;


      if (

        githubLanguages &&

        typeof githubLanguages === "object" &&

        !Array.isArray(githubLanguages)

      ) {

        Object.entries(

          githubLanguages as Record<string, unknown>

        ).forEach(([language, value]) => {

          if (typeof value === "number") {

            addLanguage(language, value);

          }

        });

      }

    }


    type HistoryWithAnalysis = (typeof history)[number] & {

      analysis?: unknown;

    };


    history.forEach((item) => {

      const historyItem = item as HistoryWithAnalysis;

      extractLanguages(historyItem.analysis);

    });


    /*

     * If the existing analysis snapshot

     * does not contain language data,

     * fall back to topLanguage.

     */


    if (Object.keys(counts).length === 0) {

      history.forEach((item) => {

        if (item.topLanguage) {

          addLanguage(item.topLanguage, 1);

        }

      });

    }


    return Object.entries(counts)

      .sort((a, b) => b[1] - a[1])

      .map(([language, count]) => ({

        language,

        count,

      }));

  }, [history]);





  const developerScoreData = useMemo(() => {

    return developers.map((developer) => {

      const scores = developer.scores;


      const overallScore = Math.round(

        (

          (scores.frontend || 0) +

          (scores.backend || 0) +

          (scores.openSource || 0) +

          (scores.activity || 0) +

          (scores.project || 0)

        ) / 5

      );


      return {
        username: developer.username,
        score: overallScore,

      };

    });

  }, [developers]);


  return (

    <>

   
      <PageHeader

        title={`Welcome, ${user?.name ?? ""}`}

        subtitle="Your developer intelligence dashboard"

      />

```tsx
{/* STATISTICS CARDS */}
<div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

  {/* ANALYSES RUN */}
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50">
    <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-indigo-50 transition-transform duration-300 group-hover:scale-125" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Analyses Run
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          {history.length}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 4 3 5-7" />
        </svg>
      </div>
    </div>

    <div className="relative mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
      <span className="h-2 w-2 rounded-full bg-indigo-500" />
      <p className="text-sm text-slate-500">
        Total GitHub analyses performed
      </p>
    </div>
  </div>

  {/* DEVELOPERS ANALYZED */}
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50">
    <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-sky-50 transition-transform duration-300 group-hover:scale-125" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Developers Analyzed
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          {uniqueDevelopers}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="9" cy="8" r="4" />
          <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
          <path d="M16 4.5a4 4 0 0 1 0 7.5" />
          <path d="M22 21v-2a7 7 0 0 0-4-6.3" />
        </svg>
      </div>
    </div>

    <div className="relative mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
      <span className="h-2 w-2 rounded-full bg-sky-500" />
      <p className="text-sm text-slate-500">
        Unique GitHub profiles analyzed
      </p>
    </div>
  </div>

  {/* SAVED PROFILES */}
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50">
    <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-violet-50 transition-transform duration-300 group-hover:scale-125" />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Saved Profiles
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          {saved.items.length}
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <path d="m9 10 2 2 4-4" />
        </svg>
      </div>
    </div>

    <div className="relative mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
      <span className="h-2 w-2 rounded-full bg-violet-500" />
      <p className="text-sm text-slate-500">
        Developers saved for later
      </p>
    </div>
  </div>

</div>


{/* QUICK ACCESS */}
<div className="mb-8">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-bold tracking-tight text-slate-900">
        Quick Access
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Explore your developer analysis tools
      </p>
    </div>

    <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
      {LINKS.length} tools available
    </span>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {LINKS.map((link, index) => {
      const icons = [
        <svg key="analyze" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
          <path d="M8 11h6M11 8v6" />
        </svg>,
        <svg key="history" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>,
        <svg key="saved" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>,
        <svg key="compare" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="9" cy="7" r="4" />
          <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
          <path d="M19 8v8M15 12h8" />
        </svg>,
      ];

      const themes = [
        "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
        "bg-sky-50 text-sky-600 group-hover:bg-sky-600",
        "bg-violet-50 text-violet-600 group-hover:bg-violet-600",
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
      ];

      return (
        <Link
          key={link.href}
          href={link.href}
          className="group relative flex min-h-48 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 group-hover:text-white ${themes[index % themes.length]}`}>
              {icons[index % icons.length]}
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-slate-100 group-hover:text-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </div>
          </div>

          <h3 className="mt-5 text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
            {link.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
            {link.desc}
          </p>

          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500 transition-colors group-hover:text-indigo-600">
            Open tool
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>
        </Link>
      );
    })}
  </div>
</div>
```

      <Card

        title="Developer Score Analysis"

        action={

          selectedDeveloper ? (

            <span className="text-xs text-slate-500">

              {selectedDeveloper.username}

            </span>

          ) : undefined

        }

      >

        {developers.length === 0 ? (

          <div className="flex h-[330px] items-center justify-center">

            <p className="text-sm text-slate-500">

              Analyze a GitHub profile to see

              developer scores.

            </p>

          </div>

        ) : (

          <div className="space-y-5">


            {/* SEARCH */}


            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  Select a developer to view

                  all scores.

                </p>

              </div>


              <select

                value={selectedUsername}

                onChange={(event) =>

                  setSelectedUsername(event.target.value)

                }

                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 sm:w-64"

              >

                {developers.map((developer) => (

                  <option

                    key={developer.username}

                    value={developer.username}

                  >

                    {developer.username}

                  </option>

                ))}

              </select>

            </div>


            <div className="grid gap-6 lg:grid-cols-2">


              {/* RADAR */}


              <div className="h-[300px]">

                <ResponsiveContainer

                  width="100%"

                  height="100%"

                >

                  <RadarChart data={selectedScoreData}>

                    <PolarGrid stroke="#334155" />


                    <PolarAngleAxis

                      dataKey="subject"

                      tick={{

                        fill: "#94a3b8",

                        fontSize: 11,

                      }}

                    />


                    <PolarRadiusAxis

                      domain={[0, 100]}

                      tick={{

                        fill: "#475569",

                        fontSize: 9,

                      }}

                    />


                    <Radar

                      name="Score"

                      dataKey="score"

                      stroke="#34d399"

                      fill="#34d399"

                      fillOpacity={0.18}

                    />


                    <Tooltip

                      contentStyle={{

                        backgroundColor: "#020617",

                        border:

                          "1px solid #1e293b",

                        borderRadius: "8px",

                        color: "#e2e8f0",

                      }}

                      formatter={(value) => [

                        `${Number(value)}/100`,

                        "Score",

                      ]}

                    />

                  </RadarChart>

                </ResponsiveContainer>

              </div>


              {/* SCORE LIST */}


              <div className="flex flex-col justify-center space-y-4">

                <ScoreBar

                  label="Frontend"

                  value={

                    selectedDeveloper?.scores

                      .frontend || 0

                  }

                />


                <ScoreBar

                  label="Backend"

                  value={

                    selectedDeveloper?.scores

                      .backend || 0

                  }

                />


                <ScoreBar

                  label="Open Source"

                  value={

                    selectedDeveloper?.scores

                      .openSource || 0

                  }

                />


                <ScoreBar

                  label="Activity"

                  value={

                    selectedDeveloper?.scores

                      .activity || 0

                  }

                />


                <ScoreBar

                  label="Project"

                  value={

                    selectedDeveloper?.scores

                      .project || 0

                  }

                />

              </div>

            </div>

          </div>

        )}

      </Card>


      {/* =====================================================

          ALL DEVELOPERS OVERALL SCORE COMPARISON

          ===================================================== */}


      <div className="mt-6">

        <Card

          title="Developer Overall Score Comparison"

          action={

            <span className="text-xs text-slate-500">

              All analyzed developers

            </span>

          }

        >

          {developerScoreData.length === 0 ? (

            <div className="flex h-[320px] items-center justify-center">

              <p className="text-sm text-slate-500">

                Analyze GitHub developers to see

                score comparison.

              </p>

            </div>

          ) : (

            <div className="h-[320px] w-full">

              <ResponsiveContainer

                width="100%"

                height="100%"

              >

                <BarChart

                  data={developerScoreData}

                  margin={{

                    top: 10,

                    right: 20,

                    left: 0,

                    bottom: 10,

                  }}

                >

                  <CartesianGrid

                    strokeDasharray="3 3"

                    stroke="#1e293b"

                    vertical={false}

                  />


                  <XAxis

                    dataKey="username"

                    tick={{

                      fill: "#94a3b8",

                      fontSize: 11,

                    }}

                    axisLine={false}

                    tickLine={false}

                  />


                  <YAxis

                    domain={[0, 100]}

                    tick={{

                      fill: "#64748b",

                      fontSize: 11,

                    }}

                    axisLine={false}

                    tickLine={false}

                  />


                  <Tooltip

                    contentStyle={{

                      backgroundColor: "#020617",

                      border:

                        "1px solid #1e293b",

                      borderRadius: "8px",

                      color: "#e2e8f0",

                    }}

                    formatter={(value) => [

                      `${Number(value)}/100`,

                      "Overall Score",

                    ]}

                  />


                  <Bar

                    dataKey="score"

                    name="Overall Score"

                    fill="#34d399"

                    radius={[5, 5, 0, 0]}

                    barSize={30}

                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </Card>

      </div>


      <div className="mt-6">

        <Card

          title="Recent analyses"

          action={

            <Link

              href="/history"

              className="text-sm text-indigo-600 hover:underline"

            >

              View all

            </Link>

          }

        >

          {historyLoading && !history.length ? (

            <Spinner />

          ) : history.length === 0 ? (

            <p className="text-sm text-slate-500">

              Nothing yet.{" "}

              <Link

                href="/analyze"

                className="text-indigo-600 hover:underline"

              >

                Analyze your first profile

              </Link>

              .

            </p>

          ) : (

            <ul className="divide-y divide-slate-800">

              {history

                .slice(0, 6)

                .map((item) => (

                  <li key={item.id}>

                    <Link

                      href={`/profile/${item.username}?report=${item.id}`}

                      className="flex items-center gap-3 py-3 transition hover:text-indigo-700"

                    >

                      {/* eslint-disable-next-line @next/next/no-img-element */}

                      <img

                        src={item.avatar}

                        alt=""

                        className="h-8 w-8 rounded-full"

                      />


                      <span className="flex-1 text-sm font-medium">

                        {item.username}

                      </span>


                      <span className="text-xs text-slate-500">

                        {fmtDate(item.createdAt)}

                      </span>

                    </Link>

                  </li>

                ))}

            </ul>

          )}

        </Card>

      </div>

    </>

  );

}
