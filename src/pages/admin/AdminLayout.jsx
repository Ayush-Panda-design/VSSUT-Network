import { NavLink, Outlet, Link } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, Users, MessagesSquare, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/admin/profiles", icon: Users, label: "Profiles" },
  { to: "/admin/chat", icon: MessagesSquare, label: "Chat Moderation" },
];

export default function AdminLayout() {
  const { profile, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-900 p-5 text-slate-100 lg:block">
        <Link to="/admin" className="flex items-center gap-2 font-bold">
          <ShieldCheck className="h-6 w-6 text-brand-400" /> Admin Panel
        </Link>
        <nav className="mt-8 space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}>
              <l.icon className="h-4 w-4" /> {l.label}
            </NavLink>
          ))}
          <Link to="/app" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" /> Back to user view
          </Link>
        </nav>
        <div className="absolute inset-x-5 bottom-5">
          <p className="truncate text-sm font-semibold">{profile?.name}</p>
          <p className="truncate text-xs text-slate-400">{profile?.email}</p>
          <button onClick={logout} className="btn mt-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-700"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      <main className="lg:ml-64">
        <div className="mx-auto max-w-6xl p-6 sm:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
