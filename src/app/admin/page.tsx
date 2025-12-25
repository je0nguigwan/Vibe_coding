"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/nav-bar";
import { getCurrentSession, getSession } from "@/lib/storage";
import { SessionState } from "@/lib/types";

export default function AdminPage() {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    const current = getCurrentSession();
    if (!current) return;
    const loaded = getSession(current.code);
    if (loaded) setSession(loaded);
  }, []);

  if (!session) {
    return (
      <div className="space-y-4">
        <NavBar title="Admin" showBack />
        <p className="rounded-3xl border border-[#ecd9cb] bg-white p-4 text-sm text-[#8e6b5b]">
          No active session found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <NavBar title="Admin" showBack />
      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <p className="text-xs text-[#8e6b5b]">Session {session.code}</p>
        <p className="font-semibold text-[color:var(--primary)]">{session.name}</p>
        <p className="mt-2 text-xs text-[#8e6b5b]">Members: {session.members.length}</p>
      </div>

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4 space-y-3">
        <p className="text-sm font-semibold text-[color:var(--primary)]">Preferences snapshot</p>
        {session.members.map((member) => (
          <div key={member.id} className="rounded-2xl bg-[#fff7ef] p-3">
            <p className="text-sm font-semibold text-[color:var(--primary)]">{member.name}</p>
            <p className="text-xs text-[#8e6b5b]">
              {session.preferences[member.id] ? "Preferences saved" : "No preferences yet"}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <p className="text-sm font-semibold text-[color:var(--primary)]">Swipe counts</p>
        <ul className="mt-3 space-y-2 text-xs text-[#8e6b5b]">
          {session.members.map((member) => {
            const count = Object.keys(session.swipes[member.id] ?? {}).length;
            return (
              <li key={member.id}>
                {member.name}: {count} swipes
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <p className="text-sm font-semibold text-[color:var(--primary)]">Chat messages</p>
        <p className="mt-2 text-xs text-[#8e6b5b]">Total: {session.messages.length}</p>
      </div>
    </div>
  );
}
