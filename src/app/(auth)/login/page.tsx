// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense, useState } from "react";
// import { ErrorBox } from "@/components/ui";
// import { clearAuthError, login } from "@/store/authSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

// function LoginForm() {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const next = useSearchParams().get("next");
//   const { error, status } = useAppSelector((s) => s.auth);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     dispatch(clearAuthError());
//     const res = await dispatch(login({ email, password }));
//     if (login.fulfilled.match(res)) {
//       const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
//       router.replace(safe);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_.95fr]">
//       <div className="hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
//         <Link href="/" className="flex items-center gap-3">
//           <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-black">D</span>
//           <span className="text-lg font-black">DevIntel</span>
//         </Link>
//         <div className="max-w-lg">
//           <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-200">Developer intelligence</p>
//           <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight">Turn GitHub data into useful insight.</h2>
//           <p className="mt-5 leading-7 text-indigo-100">Analyze profiles, repositories, technical signals and developer strengths from one focused workspace.</p>
//         </div>
//         <p className="text-xs text-indigo-200">Private workspace · Built for developer analysis</p>
//       </div>
//       <div className="flex min-h-screen items-center justify-center p-5 sm:p-8">
//         <form onSubmit={submit} className="w-full max-w-md">
//           <div className="mb-8 lg:hidden">
//             <Link href="/" className="text-xl font-black text-indigo-600">DevIntel</Link>
//           </div>
//           <div className="mb-7">
//             <p className="eyebrow">Welcome back</p>
//             <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Sign in to your workspace</h1>
//             <p className="mt-2 text-sm text-slate-500">Access your developer reports and saved profiles.</p>
//           </div>
//           <div className="card space-y-5 p-6 sm:p-7">
//             <ErrorBox message={error} />
//             <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
//             <div><div className="mb-1.5 flex items-center justify-between"><label className="label mb-0">Password</label><Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</Link></div><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></div>
//             <button className="btn w-full py-3" disabled={status === "loading"}>{status === "loading" ? "Signing in…" : "Sign in →"}</button>
//             <p className="text-center text-sm text-slate-500">Don't have an account? <Link href="/register" className="font-bold text-indigo-600 hover:underline">Create one</Link></p>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default function LoginPage() {
//   return (
//     <Suspense>
//       <LoginForm />
//     </Suspense>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBox } from "@/components/ui";
import { clearAuthError, login } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const next = useSearchParams().get("next");

  const { error, status } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    dispatch(clearAuthError());

    const res = await dispatch(
      login({
        email,
        password,
      })
    );

    if (login.fulfilled.match(res)) {
      /*
       * If a protected page originally redirected the user
       * to login with ?next=..., send them back there.
       *
       * Otherwise:
       * Admin  -> /admin/dashboard
       * User   -> /dashboard
       */
      const safeNext =
        next &&
        next.startsWith("/") &&
        !next.startsWith("//")
          ? next
          : null;

      /*
       * Try to get the logged-in user's role from the
       * login response.
       */
      const loggedInUser = res.payload as {
  role?: string;
};

if (safeNext) {
  router.replace(safeNext);
} else if (loggedInUser?.role === "admin") {
  router.replace("/admin/dashboard");
} else {
  router.replace("/dashboard");
}
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_.95fr]">
      {/* Left branding section */}
      <div className="hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-black">
            D
          </span>

          <span className="text-lg font-black">
            DevIntel
          </span>
        </Link>

        <div className="max-w-lg">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-200">
            Developer intelligence
          </p>

          <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight">
            Turn GitHub data into useful insight.
          </h2>

          <p className="mt-5 leading-7 text-indigo-100">
            Analyze profiles, repositories, technical signals and
            developer strengths from one focused workspace.
          </p>
        </div>

        <p className="text-xs text-indigo-200">
          Private workspace · Built for developer analysis
        </p>
      </div>

      {/* Login section */}
      <div className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <form onSubmit={submit} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-xl font-black text-indigo-600"
            >
              DevIntel
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <p className="eyebrow">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Sign in to your workspace
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Access your developer reports and saved profiles.
            </p>
          </div>

          {/* Login card */}
          <div className="card space-y-5 p-6 sm:p-7">
            <ErrorBox message={error} />

            {/* Email */}
            <div>
              <label className="label">
                Email
              </label>

              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="label mb-0">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
              />
            </div>

            {/* Login button */}
            <button
              className="btn w-full py-3"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Signing in…"
                : "Sign in →"}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-indigo-600 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}