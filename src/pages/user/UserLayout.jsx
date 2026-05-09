import {
  NavLink,
  Outlet,
  Link,
} from "react-router-dom";

import {
  GraduationCap,
  Home,
  Users,
  BookUser,
  MessagesSquare,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const links = [
  {
    to: "/app",
    icon: Home,
    label: "Dashboard",
    end: true,
  },

  {
    to: "/app/alumni",
    icon: BookUser,
    label: "Alumni",
  },

  {
    to: "/app/students",
    icon: Users,
    label: "Students",
  },

  {
    to: "/app/chat",
    icon: MessagesSquare,
    label: "Chat Rooms",
  },
];

export default function UserLayout() {
  const {
    profile,
    isAdmin,
    logout,
  } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SIDEBAR */}

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 lg:block">
        {/* LOGO */}

        <div className="border-b border-slate-800 p-6">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
              <GraduationCap className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                VSSUT Network
              </h1>

              <p className="text-xs text-slate-400">
                Alumni Platform
              </p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}

        <nav className="space-y-2 p-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-lg shadow-brand-500/10"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <l.icon className="h-5 w-5" />

              {l.label}
            </NavLink>
          ))}

          {/* ADMIN PANEL */}

          {isAdmin && (
            <NavLink
              to="/admin"
              className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-brand-500/20 transition hover:opacity-90"
            >
              <ShieldCheck className="h-5 w-5" />

              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* USER PROFILE */}

        <div className="absolute inset-x-4 bottom-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-lg font-bold text-brand-400">
                {profile?.name?.charAt(0) || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {profile?.name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {profile?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="lg:ml-72">
        {/* TOPBAR MOBILE */}

        <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-bold text-white">
                VSSUT Network
              </h1>

              <p className="text-xs text-slate-400">
                Alumni Platform
              </p>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}

        <div className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}