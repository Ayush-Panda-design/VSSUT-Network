import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../lib/firebase";

import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const loc = useLocation();

  const next =
    loc.state?.from?.pathname || "/app";

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    setBusy(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      nav(next, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message.replace("Firebase: ", "")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to access the VSSUT alumni network"
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) =>
            setForm({
              ...form,
              email: v,
            })
          }
        />

        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) =>
            setForm({
              ...form,
              password: v,
            })
          }
        />

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 font-medium text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {busy ? (
            "Signing in..."
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-brand-500/10 p-2 text-brand-400">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Secure Access
            </h3>

        
          </div>
        </div>
      </div>

      <p className="mt-7 text-center text-sm text-slate-400">
        New here?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-400 transition hover:text-brand-300"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="relative grid min-h-screen overflow-hidden bg-slate-950 px-6 py-10">
      {/* BACKGROUND GLOW */}

      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="absolute bottom-[-150px] right-[-100px] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      {/* CONTENT */}

      <div className="relative z-10 m-auto w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
              <GraduationCap className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                VSSUT Network
              </h2>

              <p className="text-xs text-slate-400">
                Alumni & Student Platform
              </p>
            </div>
          </div>

          {/* BACK */}

          <Link
            to="/"
            className="mt-6 inline-flex items-center text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to home
          </Link>

          {/* TITLE */}

          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {subtitle}
            </p>
          </div>

          {/* BODY */}

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type={type}
        required
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      />
    </label>
  );
}