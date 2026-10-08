"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchMe, logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Spinner } from "./ui";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⌂" },
  { href: "/analyze", label: "Analyze GitHub", icon: "⌁" },
  { href: "/history", label: "My Analyses", icon: "◷" },
  { href: "/saved", label: "Saved Profiles", icon: "☆" },
  { href: "/compare", label: "Compare", icon: "⇄" },
  { href: "/repositories", label: "Repositories", icon: "▤" },
  { href: "/settings", label: "Profile & Settings", icon: "⚙" },
];
const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Overview", icon: "⌂" },
  { href: "/admin/users", label: "Users", icon: "♙" },
  { href: "/admin/analyses", label: "Analyses", icon: "◷" },
  { href: "/admin/profile", label: "Profile", icon: "⚙" },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-indigo-200">
        D
      </span>
      <span>
        <span className="block text-[15px] font-extrabold tracking-tight text-slate-900">DevIntel</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-400">GitHub Intelligence</span>
      </span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!user && status === "idle") dispatch(fetchMe());
  }, [user, status, dispatch]);

  useEffect(() => {
    if (!user && status === "ready") router.replace("/login");
  }, [user, status, router]);

  if (!user) return <Spinner label="Checking your session…" />;

  const items = user.role === "admin" ? ADMIN_NAV : NAV;

  async function onLogout() {
    await dispatch(logout());
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-[78px] items-center border-b border-slate-100 px-5"><Brand /></div>
        <div className="px-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
            {user.role === "admin" ? "Administration" : "Workspace"}
          </p>
          <nav className="space-y-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return <Link key={item.href} href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg text-base ${
                  active ? "bg-white text-indigo-600 shadow-sm" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                }`}>{item.icon}</span>
                {item.label}
              </Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="mb-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
            <p className="text-xs font-bold text-indigo-700">Developer insights</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Turn GitHub activity into clear, useful signals.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <button onClick={onLogout} title="Logout" className="text-xs font-bold text-slate-400 hover:text-rose-600">↪</button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden"><Brand /></div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-400">{user.role === "admin" ? "Admin workspace" : "Developer workspace"}</p>
              <p className="text-sm font-bold text-slate-800">Good to see you, {user.name?.split(" ")[0] || "there"}</p>
            </div>
            <div className="flex items-center gap-3">
            <button
  onClick={onLogout}
  className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 sm:inline-flex"
>
  Logout
</button>
 <div className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-sm font-bold text-indigo-700 lg:hidden">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <button onClick={onLogout} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 lg:hidden">Logout</button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return <Link key={item.href} href={item.href} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>{item.label}</Link>;
            })}
          </nav>
        </header>

        <main className="min-h-[calc(100vh-78px)]">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
