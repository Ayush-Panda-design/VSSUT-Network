import { useEffect, useState } from "react";

import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../lib/firebase";

import { Link } from "react-router-dom";

import {
  BookUser,
  Users,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { profile } = useAuth();

  const [stats, setStats] = useState({
    alumni: 0,
    students: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const a = await getCountFromServer(
          query(
            collection(db, "users"),
            where("type", "==", "alumni")
          )
        );

        const s = await getCountFromServer(
          query(
            collection(db, "users"),
            where("type", "==", "student")
          )
        );

        setStats({
          alumni: a.data().count,
          students: s.data().count,
        });
      } catch {}
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Welcome,{" "}
              <span className="text-brand-400">
                {profile?.name?.split(" ")[0] || "there"}
              </span>{" "}
              👋
            </h1>

            <p className="mt-2 text-slate-400">
              Explore the VSSUT alumni & student community,
              connect with seniors, and grow your network.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-brand-500/20 bg-brand-500/10 px-5 py-4 md:block">
            <p className="text-sm text-slate-300">
              Connected Community
            </p>

            <h2 className="mt-1 text-2xl font-bold text-brand-400">
              VSSUT Network
            </h2>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          to="/app/alumni"
          icon={<BookUser />}
          label="Alumni"
          value={stats.alumni}
          description="Explore alumni profiles and achievements."
        />

        <StatCard
          to="/app/students"
          icon={<Users />}
          label="Students"
          value={stats.students}
          description="Connect with current VSSUT students."
        />

        <StatCard
          to="/app/chat"
          icon={<MessagesSquare />}
          label="Chat Rooms"
          value="4"
          description="Join real-time year-wise discussions."
        />
      </div>

      {/* QUICK ACTIONS */}

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">
            Community Growth
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Build meaningful professional connections with
            alumni working across top companies and industries.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/10 px-4 py-3 text-brand-400">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-semibold text-white">
                Active Students
              </p>

              <p className="text-sm text-slate-400">
                Growing collaboration network
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">
            Start Exploring
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Browse profiles, discover opportunities, and
            engage with your VSSUT community.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/app/alumni"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500"
            >
              Explore Alumni
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/app/chat"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
            >
              Open Chat
              <MessagesSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  to,
  icon,
  label,
  value,
  description,
}) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-brand-500/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-brand-400" />
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-slate-500">
          {label}
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          {value}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}