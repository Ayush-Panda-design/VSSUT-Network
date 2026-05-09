import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { AuthShell, Field } from "./Login.jsx";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        setError("This account does not have admin access.");
        await auth.signOut();
        return;
      }
      nav("/admin", { replace: true });
    } catch (err) { setError(err.message.replace("Firebase: ", "")); }
    finally { setBusy(false); }
  };

  return (
    <AuthShell title={<span className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-brand-600" /> Admin Sign in</span>}
      subtitle="Restricted access — admins only">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Admin email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">{busy ? "Verifying…" : "Sign in as admin"}</button>
      </form>
    </AuthShell>
  );
}
