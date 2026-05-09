import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Pencil, Trash2, UserPlus, GraduationCap } from "lucide-react";
import { Avatar } from "../user/Directory.jsx";

export default function ManageProfiles() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"),
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const filtered = items.filter((p) => filter === "all" || p.type === filter);

  const remove = async (id) => {
    if (!confirm("Delete this profile? This cannot be undone.")) return;
    await deleteDoc(doc(db, "users", id));
  };

  const promote = async (id) => {
    if (!confirm("Move this student to alumni?")) return;
    await updateDoc(doc(db, "users", id), { type: "alumni", year: null });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Profiles</h1>
          <p className="mt-1 text-slate-600">{filtered.length} profiles</p>
        </div>
        <Link to="/admin/profiles/new" className="btn-primary"><UserPlus className="h-4 w-4" /> Add profile</Link>
      </div>

      <div className="mt-4 flex gap-2">
        {["all", "student", "alumni"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              filter === f ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700"
            }`}>{f}</button>
        ))}
      </div>

      <div className="card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Branch / Batch</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} src={p.profileImage} size={36} />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 capitalize">{p.type || "—"} {p.role === "admin" && <span className="chip ml-1">admin</span>}</td>
                <td className="p-4">{p.branch || "—"} {p.batch && `· ${p.batch}`} {p.year && `· ${p.year}`}</td>
                <td className="p-4">{p.roleTitle || "—"}{p.company && ` @ ${p.company}`}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    {p.type === "student" && (
                      <button title="Promote to alumni" onClick={() => promote(p.id)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><GraduationCap className="h-4 w-4" /></button>
                    )}
                    <Link to={`/admin/profiles/${p.id}/edit`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
