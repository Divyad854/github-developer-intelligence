// import Link from "next/link";

// const features = [
//   ["01", "Developer intelligence", "Turn GitHub activity, projects, skills and contributions into an easy-to-read developer profile."],
//   ["02", "Evidence-based scoring", "See focused scores for frontend, backend, activity, open source and project strength."],
//   ["03", "Repository insights", "Explore languages, stars, forks, contributors and the work behind each profile."],
//   ["04", "Side-by-side comparison", "Compare two developers category by category and spot strengths at a glance."],
//   ["05", "Saved profiles", "Keep important developers close so you can revisit reports without starting over."],
//   ["06", "Analysis history", "Review previous reports and see how the same developer's signals change over time."],
// ];

// export default function Home() {
//   return (
//     <main className="min-h-screen overflow-hidden bg-white text-slate-900">
//       <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
//         <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
//           <Link href="/" className="flex items-center gap-3">
//             <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 font-extrabold text-white shadow-lg shadow-indigo-200">D</span>
//             <span><span className="block text-[15px] font-extrabold tracking-tight">DevIntel</span><span className="hidden text-[9px] font-bold uppercase tracking-[.18em] text-slate-400 sm:block">GitHub Intelligence</span></span>
//           </Link>
//           <nav className="hidden items-center gap-8 md:flex">
//             <a href="#features" className="text-sm font-semibold text-slate-500 hover:text-slate-900">Features</a>
//             <a href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-slate-900">How it works</a>
//             <a href="#about" className="text-sm font-semibold text-slate-500 hover:text-slate-900">About</a>
//           </nav>
//           <div className="flex items-center gap-2">
//             <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">Sign in</Link>
//             <Link href="/register" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700">Get started</Link>
//           </div>
//         </div>
//       </header>

//       <section className="relative border-b border-slate-100">
//         <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_10%,rgba(99,102,241,.12),transparent_34rem)]" />
//         <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pb-28 lg:pt-28">
//           <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
//             <span className="h-2 w-2 rounded-full bg-indigo-500" /> GitHub Developer Intelligence Platform
//           </div>
//           <h1 className="mx-auto mt-7 max-w-5xl text-4xl font-black tracking-[-.04em] text-slate-950 sm:text-6xl lg:text-7xl">
//             Understand developers
//             <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">beyond the GitHub profile.</span>
//           </h1>
//           <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
//             Analyze repositories, languages, activity, contribution signals and technical strengths in one polished workspace built for better developer insights.
//           </p>
//           <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
//             <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">Analyze a developer <span className="ml-2">→</span></Link>
//             <Link href="/login" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Explore workspace</Link>
//           </div>
//           <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/60 sm:grid-cols-4">
//             {[["5", "core score areas"], ["6+", "insight views"], ["2", "profiles to compare"], ["1", "unified workspace"]].map(([n,l]) =>
//               <div key={l} className="px-4 py-5"><div className="text-2xl font-black text-slate-900">{n}</div><div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{l}</div></div>
//             )}
//           </div>
//         </div>
//       </section>

//       <section id="features" className="bg-slate-50 py-20 sm:py-24">
//         <div className="mx-auto max-w-7xl px-5 sm:px-8">
//           <div className="max-w-2xl"><p className="eyebrow">Everything in one place</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A cleaner way to read developer signals.</h2><p className="mt-4 text-slate-500">Designed to make GitHub data useful without making you dig through dozens of pages.</p></div>
//           <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {features.map(([n,t,d]) => <div key={n} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50">
//               <div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600">{n}</span><span className="text-slate-300 transition group-hover:text-indigo-500">↗</span></div>
//               <h3 className="mt-6 text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p>
//             </div>)}
//           </div>
//         </div>
//       </section>

//       <section id="how-it-works" className="border-y border-slate-100 bg-white py-20 sm:py-24">
//         <div className="mx-auto max-w-6xl px-5 sm:px-8">
//           <div className="text-center"><p className="eyebrow">Simple workflow</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">From username to insight in minutes.</h2></div>
//           <div className="mt-12 grid gap-6 md:grid-cols-3">
//             {[["01","Create your account","Register and verify your account to access your private analysis workspace."],["02","Enter a GitHub profile","Paste a username or profile URL and let DevIntel collect the relevant signals."],["03","Explore the report","Review scores, repositories, languages, history and comparisons from one dashboard."]].map(([n,t,d]) =>
//               <div key={n} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-7"><span className="text-5xl font-black text-indigo-100">{n}</span><h3 className="mt-4 text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{d}</p></div>
//             )}
//           </div>
//         </div>
//       </section>

//       <section id="about" className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20 text-white sm:py-24">
//         <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
//           <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-200">Built for clarity</p>
//           <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Make technical profiles easier to understand.</h2>
//           <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">DevIntel brings profile data, repository context, scoring and comparisons together so you can focus on the signals that matter.</p>
//           <Link href="/register" className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-xl hover:bg-indigo-50">Start with DevIntel →</Link>
//         </div>
//       </section>

//       <footer className="border-t border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
//           <div><span className="font-bold text-slate-800">DevIntel</span> · GitHub Developer Intelligence</div>
//           <div className="flex gap-5"><Link href="/login" className="hover:text-slate-900">Sign in</Link><Link href="/register" className="hover:text-slate-900">Create account</Link></div>
//         </div>
//       </footer>
//     </main>
//   );
// }
import Link from "next/link";

const features = [
  ["01", "Developer intelligence", "Turn GitHub activity, projects, skills and contributions into an easy-to-read developer profile."],
  ["02", "Evidence-based scoring", "See focused scores for frontend, backend, activity, open source and project strength."],
  ["03", "Repository insights", "Explore languages, stars, forks, contributors and the work behind each profile."],
  ["04", "Side-by-side comparison", "Compare two developers category by category and spot strengths at a glance."],
  ["05", "Saved profiles", "Keep important developers close so you can revisit reports without starting over."],
  ["06", "Analysis history", "Review previous reports and see how the same developer's signals change over time."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900 antialiased">

      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-[80px] max-w-7xl items-center px-5 sm:px-8">

          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md shadow-indigo-200/70 transition-all duration-200 group-hover:scale-105">
              <span className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
              D
            </span>

            <span>
              <span className="block text-[16px] font-black leading-none tracking-tight text-slate-950">
                DevIntel
              </span>

              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                GitHub Intelligence
              </span>
            </span>
          </Link>

          {/* Center Navigation */}
           <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
  <a
    href="#features"
    className="text-[15px] font-semibold text-black drop-shadow-sm transition-colors hover:text-indigo-600"
  >
    Features
  </a>

  <a
    href="#how-it-works"
    className="text-[15px] font-semibold text-black drop-shadow-sm transition-colors hover:text-indigo-600"
  >
    How it works
  </a>

  <a
    href="#about"
    className="text-[15px] font-semibold text-black drop-shadow-sm transition-colors hover:text-indigo-600"
  >
    About
  </a>
</nav>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-950"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200/70 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative border-b border-slate-100 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute left-1/2 top-[-250px] h-[550px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="absolute left-0 top-1/2 h-64 w-64 rounded-full bg-violet-100/30 blur-3xl" />

          <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pb-28 lg:pt-28">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-300" />
            GitHub Developer Intelligence Platform
          </div>

          <h1 className="mx-auto mt-7 max-w-5xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Understand developers
            <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              beyond the GitHub profile.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg">
            Analyze repositories, languages, activity, contribution signals and technical strengths in one polished workspace built for better developer insights.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/70 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
            >
              Analyze a developer
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
            >
              Explore workspace
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/60 sm:grid-cols-4">
            {[
              ["5", "core score areas"],
              ["6+", "insight views"],
              ["2", "profiles to compare"],
              ["1", "unified workspace"],
            ].map(([n, l]) => (
              <div
                key={l}
                className="px-4 py-5 transition-colors hover:bg-slate-50"
              >
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  {n}
                </div>

                <div className="mt-1 text-[11px] font-bold uppercase tracking-[.08em] text-slate-400">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        id="features"
        className="border-b border-slate-100 bg-slate-50/80 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-indigo-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              A cleaner way to read developer signals.
            </h2>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-500 sm:text-base">
              Designed to make GitHub data useful without making you dig through dozens of pages.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(([n, t, d]) => (
              <div
                key={n}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-indigo-100 bg-indigo-50 text-xs font-black text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    {n}
                  </span>

                  <span className="text-slate-300 transition-colors group-hover:text-indigo-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-extrabold tracking-tight text-slate-900">
                  {t}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how-it-works"
        className="border-y border-slate-100 bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[.2em] text-indigo-600">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              From username to insight in minutes.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "01",
                "Create your account",
                "Register and verify your account to access your private analysis workspace.",
              ],
              [
                "02",
                "Enter a GitHub profile",
                "Paste a username or profile URL and let DevIntel collect the relevant signals.",
              ],
              [
                "03",
                "Explore the report",
                "Review scores, repositories, languages, history and comparisons from one dashboard.",
              ],
            ].map(([n, t, d]) => (
              <div
                key={n}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
              >
                <span className="text-5xl font-black tracking-tight text-indigo-100 transition-colors group-hover:text-indigo-200">
                  {n}
                </span>

                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-slate-900">
                  {t}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section
        id="about"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20 text-white sm:py-24"
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">

          <p className="text-xs font-black uppercase tracking-[.2em] text-indigo-200">
            Built for clarity
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Make technical profiles easier to understand.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-indigo-100 sm:text-base">
            DevIntel brings profile data, repository context, scoring and comparisons together so you can focus on the signals that matter.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            Start with DevIntel →
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <div>
            <span className="font-extrabold text-slate-900">
              DevIntel
            </span>{" "}
            · GitHub Developer Intelligence
          </div>

          <div className="flex gap-5">
            <Link
              href="/login"
              className="font-medium transition-colors hover:text-indigo-600"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="font-medium transition-colors hover:text-indigo-600"
            >
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}