"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/nav-bar";
import PreferenceForm from "@/components/preference-form";
import { Button } from "@/components/ui/button";
import MemberList from "@/components/member-list";
import { createDefaultPreferences } from "@/lib/preferences";
import {
  getCurrentSession,
  getSavedPreferencesByName,
  getSession,
  savePreferences,
  savePreferencesForName,
} from "@/lib/storage";
import { MemberPreferences, SessionState } from "@/lib/types";

export default function PreferencesPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<MemberPreferences>(createDefaultPreferences());
  const [shareLink, setShareLink] = useState("");
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const current = getCurrentSession();
    if (!current) return;
    setMemberId(current.memberId);
    const loaded = getSession(current.code);
    if (!loaded) return;
    setSession(loaded);
    const member = loaded.members.find((item) => item.id === current.memberId);
    setMemberName(member?.name ?? null);

    const existing = loaded.preferences[current.memberId];
    if (existing) {
      setPrefs(existing);
    } else if (member?.name) {
      const savedByName = getSavedPreferencesByName(member.name);
      if (savedByName) {
        setPrefs(savedByName);
        setRestored(true);
      }
    }

    if (typeof window !== "undefined") {
      setShareLink(`${window.location.origin}/join?code=${loaded.code}`);
    }
  }, []);

  function handleSave() {
    if (session && memberId) {
      savePreferences(session.code, memberId, prefs);
      if (memberName) savePreferencesForName(memberName, prefs);
    }
    router.push("/swipe");
  }

  if (!session) {
    return (
      <div className="space-y-4">
        <NavBar title="Preferences" showBack />
        <p className="rounded-3xl border border-[#ecd9cb] bg-white p-4 text-sm text-[#8e6b5b]">
          Create or join a session first.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="space-y-6">
        <NavBar title="Preferences" showBack />
        <div className="rounded-3xl border border-[#ecd9cb] bg-[#fff7ef] p-4">
          <p className="text-xs text-[#8e6b5b]">Session {session.code}</p>
          <p className="font-semibold text-[color:var(--primary)]">{session.name}</p>
          {shareLink ? (
            <p className="mt-2 text-xs text-[#8e6b5b]">Share link: {shareLink}</p>
          ) : null}
          {restored ? (
            <p className="mt-2 text-xs font-semibold text-[color:var(--accent)]">
              Preferences restored from your last visit.
            </p>
          ) : null}
        </div>

        <PreferenceForm value={prefs} onChange={setPrefs} />

        <Button className="w-full" onClick={handleSave}>
          Save & start swiping
        </Button>

        <MemberList session={session} />
      </div>
    </div>
  );
}
