import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Directory({ type, title, filterOptions = [], filterField }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "users"), where("type", "==", type)),
      (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [type]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return items.filter((p) => {
      const matchesTerm = !term || [p.name, p.branch, p.batch, p.company, p.roleTitle, (p.skills || []).join(" ")]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(term));
      const matchesFilter = !filter || p[filterField] === filter;
      return matchesTerm && matchesFilter;
    });
  }, [items, q, filter, filterField]);

  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-slate-600">{items.length} profiles</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, branch, company, skill…"
            className="input pl-10" />
        </div>
        {filterOptions.length > 0 && (
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input sm:w-56">
            <option value="">All</option>
            {filterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="card mt-8 p-10 text-center text-slate-500">No profiles found.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProfileCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

function ProfileCard({ p }) {
  return (
    <Link to={`/app/profile/${p.id}`} className="card group overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <Avatar name={p.name} src={p.profileImage} />
        <div className="min-w-0">
          <p className="truncate font-semibold group-hover:text-brand-700">{p.name}</p>
          <p className="truncate text-xs text-slate-500">{p.branch} {p.batch && `· ${p.batch}`}</p>
        </div>
      </div>
      {(p.roleTitle || p.company) && (
        <p className="mt-3 text-sm text-slate-700">{p.roleTitle}{p.company && ` @ ${p.company}`}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {p.classification && <span className="chip">{p.classification}</span>}
        {p.year && <span className="chip">{p.year}</span>}
      </div>
    </Link>
  );
}

export function Avatar({ name, src, size = 48 }) {
  if (src) return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  const initials = (name || "?").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="grid flex-shrink-0 place-items-center rounded-full bg-brand-100 font-semibold text-brand-700"
      style={{ width: size, height: size, fontSize: size * 0.4 }}>{initials}</div>
  );
}
