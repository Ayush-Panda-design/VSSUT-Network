import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { CHAT_ROOMS } from "../../lib/constants";
import { Trash2 } from "lucide-react";

export default function ManageChat() {
  const [room, setRoom] = useState(CHAT_ROOMS[0].id);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "chatRooms", room, "messages"), orderBy("timestamp", "desc"), limit(100)),
      (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [room]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Chat Moderation</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {CHAT_ROOMS.map((r) => (
          <button key={r.id} onClick={() => setRoom(r.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              room === r.id ? "bg-brand-600 text-white" : "bg-white border border-slate-200"
            }`}>{r.label}</button>
        ))}
      </div>

      <div className="card mt-6 divide-y divide-slate-100">
        {messages.length === 0 && <p className="p-6 text-center text-slate-500">No messages.</p>}
        {messages.map((m) => (
          <div key={m.id} className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="text-xs text-slate-500">{m.senderName} · {m.timestamp?.toDate?.().toLocaleString() || "…"}</p>
              <p className="mt-1 text-sm">{m.text}</p>
            </div>
            <button onClick={() => deleteDoc(doc(db, "chatRooms", room, "messages", m.id))}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
