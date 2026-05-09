import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import { ALUMNI_CATEGORIES, BRANCHES, STUDENT_YEARS } from "../../lib/constants";
import { Save, ArrowLeft, Upload } from "lucide-react";

const empty = {
  name: "", email: "", type: "student", role: "user",
  branch: "", batch: "", year: "", classification: "",
  profileImage: "", linkedin: "", twitter: "", instagram: "", github: "",
  company: "", roleTitle: "", experience: "", internships: "",
  freelancing: "", achievements: "", description: "", skills: "",
};

export default function ProfileForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) {
        const d = snap.data();
        setF({ ...empty, ...d, skills: (d.skills || []).join(", ") });
      }
    })();
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const r = ref(storage, `profileImages/${Date.now()}_${file.name}`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setF((prev) => ({ ...prev, profileImage: url }));
    } finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...f,
        skills: f.skills ? f.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        updatedAt: serverTimestamp(),
      };
      if (id) {
        await updateDoc(doc(db, "users", id), payload);
      } else {
        await addDoc(collection(db, "users"), { ...payload, createdAt: serverTimestamp() });
      }
      nav("/admin/profiles");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <Link to="/admin/profiles" className="text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="inline h-4 w-4" /> Back</Link>
      <h1 className="mt-2 text-3xl font-bold">{id ? "Edit profile" : "Add profile"}</h1>

      <form onSubmit={save} className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card space-y-4 p-6 lg:col-span-1">
          <h3 className="font-semibold">Profile photo</h3>
          {f.profileImage && <img src={f.profileImage} className="h-32 w-32 rounded-full object-cover" alt="" />}
          <label className="btn-secondary cursor-pointer text-sm">
            <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/*" onChange={upload} className="hidden" />
          </label>
          <Sel label="Type" value={f.type} onChange={set("type")} options={[["student","Student"],["alumni","Alumni"]]} />
          <Sel label="Role" value={f.role} onChange={set("role")} options={[["user","User"],["admin","Admin"]]} />
        </div>

        <div className="card space-y-4 p-6 lg:col-span-2">
          <h3 className="font-semibold">Basic information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <In label="Full name" value={f.name} onChange={set("name")} required />
            <In label="Email" type="email" value={f.email} onChange={set("email")} />
            <Sel label="Branch" value={f.branch} onChange={set("branch")} options={BRANCHES.map((b) => [b, b])} />
            <In label="Batch (e.g. 2021 - 2025)" value={f.batch} onChange={set("batch")} />
            {f.type === "student"
              ? <Sel label="Year" value={f.year} onChange={set("year")} options={STUDENT_YEARS.map((y) => [y, y])} />
              : <Sel label="Classification" value={f.classification} onChange={set("classification")} options={ALUMNI_CATEGORIES.map((c) => [c, c])} />}
          </div>
        </div>

        <div className="card space-y-4 p-6 lg:col-span-2">
          <h3 className="font-semibold">Professional</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <In label="Company" value={f.company} onChange={set("company")} />
            <In label="Current role" value={f.roleTitle} onChange={set("roleTitle")} />
          </div>
          <In label="Skills (comma separated)" value={f.skills} onChange={set("skills")} />
          <Ta label="Experience" value={f.experience} onChange={set("experience")} />
          <Ta label="Internship history" value={f.internships} onChange={set("internships")} />
          <Ta label="Freelancing & projects" value={f.freelancing} onChange={set("freelancing")} />
          <Ta label="Achievements" value={f.achievements} onChange={set("achievements")} />
          <Ta label="About / description" value={f.description} onChange={set("description")} />
        </div>

        <div className="card space-y-4 p-6 lg:col-span-1">
          <h3 className="font-semibold">Social links</h3>
          <In label="LinkedIn URL" value={f.linkedin} onChange={set("linkedin")} />
          <In label="X / Twitter URL" value={f.twitter} onChange={set("twitter")} />
          <In label="Instagram URL" value={f.instagram} onChange={set("instagram")} />
          <In label="GitHub URL" value={f.github} onChange={set("github")} />
        </div>

        <div className="lg:col-span-3">
          <button disabled={busy} className="btn-primary"><Save className="h-4 w-4" /> {busy ? "Saving…" : "Save profile"}</button>
        </div>
      </form>
    </div>
  );
}

function In({ label, ...p }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">{label}</span><input className="input" {...p} /></label>;
}
function Ta({ label, ...p }) {
  return <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600">{label}</span><textarea rows={3} className="input" {...p} /></label>;
}
function Sel({ label, options, ...p }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <select className="input" {...p}>
        <option value="">Select…</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
