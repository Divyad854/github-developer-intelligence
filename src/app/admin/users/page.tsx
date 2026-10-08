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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  /* =====================================================
     LOAD USERS
  ===================================================== */

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const result = await api<User[]>(
        "/api/admin/users"
      );

      setUsers(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  /* =====================================================
     BLOCK / UNBLOCK
  ===================================================== */

  async function handleBlockToggle(
    user: User
  ) {
    const action = user.isBlocked
      ? "unblock"
      : "block";

    const confirmed = window.confirm(
      user.isBlocked
        ? `Unblock ${user.name}?`
        : `Block ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError(null);

      await api(
        `/api/admin/users/${user.id}`,
        {
          method: "PATCH",
          body: {
            action,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isBlocked:
                  action === "block",
              }
            : item
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update user"
      );
    } finally {
      setActionLoading(null);
    }
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError(null);

      await api(
        `/api/admin/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item.id !== user.id
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete user"
      );
    } finally {
      setActionLoading(null);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner label="Loading users…" />
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage registered users"
      />

      {error && (
        <ErrorBox message={error} />
      )}

      <Card
        title={`Registered Users (${users.length})`}
      >
        {users.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl">
              👥
            </div>

            <p className="mt-3 text-sm text-slate-500">
              No users found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Joined
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const busy =
                    actionLoading ===
                    user.id;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200 hover:bg-slate-200/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </div>

                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {user.email}
                      </td>

                      <td className="px-4 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {fmtDate(
                          user.createdAt,
                          true
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleBlockToggle(
                                user
                              )
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            }`}
                          >
                            {busy
                              ? "..."
                              : user.isBlocked
                              ? "Unblock"
                              : "Block"}
                          </button>

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              handleDelete(
                                user
                              )
                            }
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {busy
                              ? "..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}