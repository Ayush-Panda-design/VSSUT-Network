import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  limit,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import { CHAT_ROOMS } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";

import {
  Send,
  Trash2,
} from "lucide-react";

export default function ChatRooms() {
  const { roomId } = useParams();

  const nav = useNavigate();

  const { profile, user, isAdmin } = useAuth();

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "chatRooms", roomId, "messages"),
      orderBy("timestamp", "asc"),
      limit(200)
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setTimeout(() => {
        endRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 50);
    });

    return () => unsub();
  }, [roomId]);

  const send = async (e) => {
    e.preventDefault();

    if (!text.trim() || !roomId) return;

    await addDoc(
      collection(db, "chatRooms", roomId, "messages"),
      {
        text: text.trim(),

        senderUid: user.uid,

        senderName: profile?.name || "Anonymous",

        timestamp: serverTimestamp(),
      }
    );

    setText("");
  };

  const remove = async (id) => {
    if (!isAdmin) return;

    await deleteDoc(
      doc(db, "chatRooms", roomId, "messages", id)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Chat Rooms
          </h1>

          <p className="mt-1 text-slate-400">
            Connect with students and alumni in real-time.
          </p>
        </div>
      </div>

      {/* ROOM SELECTOR */}

      <div className="mt-6 flex flex-wrap gap-3">
        {CHAT_ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => nav(`/app/chat/${r.id}`)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              roomId === r.id
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}

      {!roomId ? (
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-16 text-center shadow-xl">
          <p className="text-lg text-slate-400">
            Select a room above to start chatting 👋
          </p>
        </div>
      ) : (
        <div className="mt-6 flex h-[70vh] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          {/* MESSAGES */}

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 && (
              <p className="mt-10 text-center text-sm text-slate-500">
                Be the first to say hi 👋
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.senderUid === user.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`group max-w-[80%] rounded-3xl px-5 py-3 shadow-lg transition-all ${
                    m.senderUid === user.uid
                      ? "bg-brand-600 text-white"
                      : "border border-slate-700 bg-slate-800 text-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium opacity-70">
                      {m.senderName}
                    </p>

                    <span className="text-[10px] opacity-60">
                      {fmt(m.timestamp)}
                    </span>
                  </div>

                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {m.text}
                  </p>

                  {isAdmin && (
                    <button
                      onClick={() => remove(m.id)}
                      className="mt-2 hidden items-center gap-1 text-[11px] text-red-400 underline group-hover:inline-flex"
                    >
                      <Trash2 className="h-3 w-3" />
                      delete
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div ref={endRef} />
          </div>

          {/* INPUT */}

          <form
            onSubmit={send}
            className="border-t border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex items-center gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />

              <button
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white transition hover:bg-brand-500"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function fmt(ts) {
  if (!ts?.toDate) return "";

  return ts.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}