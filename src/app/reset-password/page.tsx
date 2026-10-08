"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
} from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl =
    searchParams.get("email") || "";

  const [email, setEmail] =
    useState(emailFromUrl);

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!emailFromUrl) {
      const storedEmail =
        sessionStorage.getItem(
          "resetEmail"
        );

      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [emailFromUrl]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("Email is missing");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter a valid 6-digit OTP"
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
            newPassword,
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
            "Password reset failed"
        );
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      sessionStorage.removeItem(
        "resetEmail"
      );

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
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
          <div className="text-4xl">
            🔑
          </div>

          <h1 className="mt-2 text-xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="text-sm text-slate-500">
            Enter the OTP sent to
          </p>

          <p className="mt-1 text-sm font-medium text-indigo-600">
            {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md bg-indigo-50 p-3 text-sm text-indigo-600">
            {message}
          </div>
        )}

        <div>
          <label className="label">
            OTP
          </label>

          <input
            className="input text-center text-xl tracking-[0.5em]"
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            placeholder="000000"
          />
        </div>

        <div>
          <label className="label">
            New Password
          </label>

          <input
            className="input"
            type="password"
            minLength={8}
            required
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label className="label">
            Confirm New Password
          </label>

          <input
            className="input"
            type="password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          className="btn w-full"
          disabled={loading}
        >
          {loading
            ? "Resetting..."
            : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}