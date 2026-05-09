import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  GraduationCap,
  ShieldCheck,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Database,
  Globe,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND */}

      <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      {/* HEADER */}

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
            <GraduationCap className="h-7 w-7" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              VSSUT Network
            </h1>

            <p className="text-xs text-slate-400">
              Alumni & Student Platform
            </p>
          </div>
        </div>

        <Link
          to="/login"
          className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
        >
          Sign In
        </Link>
      </header>

      {/* HERO */}

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* CHIP */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-400">
            <Sparkles className="h-4 w-4" />
            Connecting VSSUT batches across years
          </div>

          {/* TITLE */}

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl">
          Grow Beyond Campus
            <span className="block bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">
              Student Network
            </span>
          </h1>

          {/* SUBTITLE */}

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Discover alumni, connect with students,
            explore professional journeys, and join
            real-time year-wise communities — all in
            one powerful platform.
          </p>

          {/* BUTTONS */}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-7 py-3 font-medium text-white shadow-xl shadow-brand-600/20 transition hover:bg-brand-500"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-7 py-3 font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Explore Network
            </Link>
          </div>
        </motion.div>

        {/* ROLE CARDS */}

        <div className="mx-auto mt-20 grid max-w-5xl gap-6 lg:grid-cols-2">
          <RoleCard
            to="/login"
            icon={<Users className="h-7 w-7" />}
            title="Continue as User"
            desc="Browse alumni and student profiles, connect with peers, and join year-wise chat rooms."
            cta="Enter as User"
            tone="brand"
          />

          <RoleCard
            to="/admin/login"
            icon={<ShieldCheck className="h-7 w-7" />}
            title="Continue as Admin"
            desc="Manage profiles, classifications, user accounts, and moderate the entire platform."
            cta="Enter as Admin"
            tone="dark"
          />
        </div>

        {/* FEATURES */}

        <div className="mx-auto mt-24 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Feature
            icon={<Users />}
            title="Student Directory"
            text="Explore current students classified year-wise and branch-wise."
          />

          <Feature
            icon={<GraduationCap />}
            title="Alumni Network"
            text="Discover alumni working across industries and top companies."
          />

          <Feature
            icon={<MessageSquare />}
            title="Chat Rooms"
            text="Interact in real-time with batch-wise and community discussions."
          />

       <Feature
  icon={<Database />}
  title="Career Growth"
  text="Connect with alumni and students to discover opportunities, guidance, and grow in your career journey."
/>
        </div>

        {/* TECH STACK */}

      </main>
    </div>
  );
}

function RoleCard({
  to,
  icon,
  title,
  desc,
  cta,
  tone,
}) {
  const isBrand = tone === "brand";

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`rounded-3xl border p-8 shadow-2xl ${
        isBrand
          ? "border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-slate-900"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
          isBrand
            ? "bg-brand-500/10 text-brand-400"
            : "bg-slate-800 text-white"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-3xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">
        {desc}
      </p>

      <Link
        to={to}
        className={`mt-7 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium transition ${
          isBrand
            ? "bg-brand-600 text-white hover:bg-brand-500"
            : "bg-white text-slate-900 hover:bg-slate-100"
        }`}
      >
        {cta}

        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition-all"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
        {icon}
      </div>

      <h4 className="mt-5 text-lg font-semibold text-white">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {text}
      </p>
    </motion.div>
  );
}