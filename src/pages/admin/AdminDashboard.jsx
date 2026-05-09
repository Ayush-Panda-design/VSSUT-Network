import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Users, BookUser, UserPlus } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ alumni: 0, students: 0, users: 0 });

  useEffect(() => {
    (async () => {
      try {
        const a = await getCountFromServer(query(collection(db, "users"), where("type", "==", "alumni")));
        const s = await getCountFromServer(query(collection(db, "users"), where("type", "==", "student")));
        const u = await getCountFromServer(collection(db, "users"));
        setStats({ alumni: a.data().count, students: s.data().count, users: u.data().count });
      } catch {}
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="mt-1 text-slate-600">Manage profiles, classifications, and chat rooms.</p>
        </div>
        <Link to="/admin/profiles/new" className="btn-primary"><UserPlus className="h-4 w-4" /> Add profile</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={<BookUser />} label="Alumni" value={stats.alumni} />
        <Stat icon={<Users />} label="Students" value={stats.students} />
        <Stat icon={<Users />} label="Total accounts" value={stats.users} />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
