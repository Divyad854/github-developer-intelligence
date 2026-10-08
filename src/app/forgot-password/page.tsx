"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const text = await res.text();

      let data: { message?: string } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Server returned an invalid response"
          );
        }
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Unable to send reset OTP"
        );
      }

      sessionStorage.setItem(
        "resetEmail",
        email
      );

      router.push(
        `/reset-password?email=${encodeURIComponent(
          email
        )}`
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="card w-full max-w-sm space-y-4"
      >
        <div className="text-center">
          <div className="text-4xl">🔐</div>

          <h1 className="mt-2 text-xl font-bold text-slate-900">
            Forgot Password
          </h1>

          <p className="text-sm text-slate-500">
            Enter your email to receive a reset OTP
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          className="btn w-full"
          disabled={loading}
        >
          {loading
            ? "Sending OTP..."
            : "Send Reset OTP"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}

          <Link
            href="/login"
            className="text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}