"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ErrorBox } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Unable to send OTP"
        );
      }

      // Save email temporarily
      sessionStorage.setItem(
        "verificationEmail",
        email
      );

      // Go to OTP page
      router.push(
        `/verify-otp?email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 font-black">D</span><span className="text-lg font-black">DevIntel</span></Link>
        <div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-200">Start analyzing</p><h2 className="mt-4 text-5xl font-black leading-tight tracking-tight">Build a clearer picture of every developer.</h2><p className="mt-5 leading-7 text-indigo-100">Create your workspace and turn public GitHub signals into organized, comparable insights.</p></div>
        <div className="grid grid-cols-3 gap-3">{["Profiles","Repositories","Comparisons"].map(x => <div key={x} className="rounded-xl border border-white/10 bg-white/10 p-3 text-xs font-semibold text-indigo-100">{x}</div>)}</div>
      </div>
      <div className="flex min-h-screen items-center justify-center p-5 sm:p-8">
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Link href="/" className="text-xl font-black text-indigo-600">DevIntel</Link></div>
          <div className="mb-7"><p className="eyebrow">Create account</p><h1 className="mt-2 text-3xl font-black tracking-tight">Start your DevIntel workspace</h1><p className="mt-2 text-sm text-slate-500">A few details, then verify your email with a one-time code.</p></div>
          <div className="card space-y-4 p-6 sm:p-7">
            <ErrorBox message={error} />
            <div><label className="label">Full name</label><input className="input" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
            <div><label className="label">Email address</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            <div><label className="label">Password</label><input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
            <button type="submit" className="btn w-full py-3" disabled={loading}>{loading ? "Sending verification code…" : "Create account →"}</button>
            <p className="text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-indigo-600 hover:underline">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}