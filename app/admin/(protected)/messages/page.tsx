"use client";

import { useState, useEffect, useCallback } from "react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error("Failed to fetch messages", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function markRead(id: number, isRead: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead } : m))
    );
  }

  async function deleteMessage(id: number) {
    if (!confirm("Delete this message permanently?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (expanded === id) setExpanded(null);
  }

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Messages</h1>
          <p className="text-stone-500 font-sans text-sm mt-1">
            {unread > 0 ? (
              <span className="text-amber-700 font-semibold">{unread} unread</span>
            ) : (
              "All caught up!"
            )}{" "}
            · {messages.length} total
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-stone-100 animate-pulse rounded" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-stone-400 font-sans">
          <p className="text-5xl mb-4">📭</p>
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border font-sans rounded transition-colors ${
                msg.isRead ? "border-stone-200 bg-white" : "border-amber-300 bg-amber-50"
              }`}
            >
              {/* Header Row */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-stone-900 truncate block">{msg.name}</span>
                    <span className="text-xs text-stone-500">{msg.email}</span>
                  </div>
                  <span className="hidden md:inline text-xs bg-stone-100 text-stone-700 font-medium px-2 py-0.5 rounded">
                    {msg.subject}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-xs text-stone-400 hidden sm:inline">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-stone-400 text-sm">{expanded === msg.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {/* Expanded Body */}
              {expanded === msg.id && (
                <div className="border-t border-stone-200 px-5 py-4">
                  <p className="text-stone-700 whitespace-pre-wrap leading-relaxed mb-5">
                    {msg.message}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-4 py-2 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-700 transition-colors"
                    >
                      Reply via Email
                    </a>
                    {msg.isRead ? (
                      <button
                        onClick={() => markRead(msg.id, false)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 text-sm hover:bg-stone-50 transition-colors"
                      >
                        Mark as Unread
                      </button>
                    ) : (
                      <button
                        onClick={() => markRead(msg.id, true)}
                        className="px-4 py-2 border border-amber-400 text-amber-800 text-sm hover:bg-amber-50 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="px-4 py-2 border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
