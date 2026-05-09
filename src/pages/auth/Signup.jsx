import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../lib/firebase";

import {
  AuthShell,
  Field,
} from "./Login.jsx";

import {
  UserPlus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    setBusy(true);

    try {
      const cred =
        await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

      await updateProfile(cred.user, {
        displayName: form.name,
      });

      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          name: form.name,

          email: form.email,

          role: "user",

          type: "student",

          createdAt: serverTimestamp(),
        }
      );

      nav("/app", {
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
      title="Create Your Account"
      subtitle="Join the VSSUT alumni & student network"
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <Field
          label="Full Name"
          value={form.name}
          onChange={(v) =>
            setForm({
              ...form,
              name: v,
            })
          }
        />

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

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* CREATE BUTTON */}

        <button
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 font-medium text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-500 disabled:opacity-60"
        >
          {busy ? (
            "Creating..."
          ) : (
            <>
              Create Account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* INFO CARD */}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-brand-500/10 p-2 text-brand-400">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Join the Community
            </h3>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Connect with alumni, discover
              opportunities, and interact with
              students from all years.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <p className="mt-7 text-center text-sm text-slate-400">
        Already a member?{" "}
        <Link
          to="/login"
          className="font-medium text-brand-400 transition hover:text-brand-300"
        >
          Sign in
        </Link>
      </p>

      {/* BOTTOM ICON */}

      <div className="mt-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10 text-brand-400">
          <UserPlus className="h-6 w-6" />
        </div>
      </div>
    </AuthShell>
  );
}