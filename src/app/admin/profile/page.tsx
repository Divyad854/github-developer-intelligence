"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Card, PageHeader } from "@/components/ui";
import { setUser } from "@/store/authSlice";

export default function AdminProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  async function updateProfile(body: Record<string, string>) {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      if (data.user) {
        dispatch(setUser(data.user));
      }

      setMessage("Profile updated successfully.");
      setEditingName(false);
      setEditingEmail(false);
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

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to change password"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setChangingPassword(false);

      setMessage("Password changed successfully.");
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
    <div className="space-y-6">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your administrator account information"
      />

      {/* SUCCESS / ERROR MESSAGE */}

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-indigo-50 px-4 py-3 text-sm text-indigo-600">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <Card title="Administrator Information">
        <div className="space-y-6">

          {/* NAME */}

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Name
            </div>

            {editingName ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="input max-w-md"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  minLength={2}
                  required
                />

                <button
                  type="button"
                  className="btn"
                  disabled={loading}
                  onClick={() =>
                    updateProfile({ name })
                  }
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setName(user.name);
                    setEditingName(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {user.name}
                </span>

                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:underline"
                  onClick={() => setEditingName(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* EMAIL */}

          {/* ROLE */}

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Role
            </div>

            <div className="mt-2">
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                Admin
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* =====================================================
          CHANGE PASSWORD
      ===================================================== */}

      <Card title="Security">
        {!changingPassword ? (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Password
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Change your administrator account password.
              </p>
            </div>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => setChangingPassword(true)}
            >
              Change Password
            </button>
          </div>
        ) : (
          <form
            onSubmit={changePassword}
            className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5"
          >
            <div>
              <label className="label">
                Current Password
              </label>

              <input
                className="input"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="label">
                New Password
              </label>

              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                minLength={8}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setChangingPassword(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      {/* =====================================================
          ADMIN ACCESS
      ===================================================== */}

      <Card title="Administrator Access">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-lg">
              🛡️
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Administrator Account
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your account has administrator access to
                the DevIntel platform. You can manage users,
                view application usage, and monitor platform
                activity.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* =====================================================
          ACCOUNT STATUS
      ===================================================== */}

      <Card title="Account Status">
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-5">
          <div>
            <div className="text-sm font-medium text-slate-800">
              Account Status
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Your administrator account is active.
            </div>
          </div>

          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            Active
          </span>
        </div>
      </Card>
    </div>
  );
}