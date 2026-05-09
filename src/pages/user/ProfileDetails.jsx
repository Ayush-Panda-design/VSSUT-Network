import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Avatar } from "./Directory.jsx";
import { Linkedin, Twitter, Instagram, Github, Briefcase, Award, Code2, Mail } from "lucide-react";

export default function ProfileDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "users", id));
      setP(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!p) return <p className="text-slate-500">Profile not found.</p>;

  const socials = [
    { url: p.linkedin, icon: Linkedin, label: "LinkedIn" },
    { url: p.twitter, icon: Twitter, label: "Twitter" },
    { url: p.instagram, icon: Instagram, label: "Instagram" },
    { url: p.github, icon: Github, label: "GitHub" },
  ].filter((s) => s.url);

  return (
    <div>
      <Link to=".." className="text-sm text-slate-500 hover:text-slate-800">← Back</Link>

      <div className="card mt-4 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-brand-500 to-brand-700" />
        <div className="px-6 pb-8">
          <div className="-mt-12 flex items-end gap-4">
            <div className="rounded-full ring-4 ring-white">
              <Avatar name={p.name} src={p.profileImage} size={96} />
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{p.name}</h1>
            <p className="text-slate-600">{p.roleTitle}{p.company && ` @ ${p.company}`}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.branch && <span className="chip">{p.branch}</span>}
              {p.batch && <span className="chip">Batch {p.batch}</span>}
              {p.year && <span className="chip">{p.year}</span>}
              {p.classification && <span className="chip">{p.classification}</span>}
            </div>
          </div>

          {p.description && <Section title="About"><p className="text-slate-700">{p.description}</p></Section>}

          {p.skills?.length > 0 && (
            <Section title="Skills" icon={<Code2 className="h-4 w-4" />}>
              <div className="flex flex-wrap gap-2">{p.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </Section>
          )}

          {p.experience && <Section title="Experience" icon={<Briefcase className="h-4 w-4" />}><p className="whitespace-pre-line text-slate-700">{p.experience}</p></Section>}
          {p.internships && <Section title="Internships"><p className="whitespace-pre-line text-slate-700">{p.internships}</p></Section>}
          {p.freelancing && <Section title="Freelancing & Projects"><p className="whitespace-pre-line text-slate-700">{p.freelancing}</p></Section>}
          {p.achievements && <Section title="Achievements" icon={<Award className="h-4 w-4" />}><p className="whitespace-pre-line text-slate-700">{p.achievements}</p></Section>}

          <Section title="Connect">
            <div className="flex flex-wrap gap-2">
              {p.email && <a href={`mailto:${p.email}`} className="btn-secondary text-sm"><Mail className="h-4 w-4" /> {p.email}</a>}
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                  <s.icon className="h-4 w-4" /> {s.label}
                </a>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="mt-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{icon}{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
