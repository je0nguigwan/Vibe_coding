"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/nav-bar";
import ChatPanel from "@/components/chat-panel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentSession, getSession } from "@/lib/storage";
import { SessionState } from "@/lib/types";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const initialMode = modeParam === "dm" ? "dm" : "group";
  const [session, setSession] = useState<SessionState | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentSession();
    if (!current) return;
    setMemberId(current.memberId);
    const loaded = getSession(current.code);
    if (loaded) setSession(loaded);
  }, []);

  if (!session || !memberId) {
    return (
      <div className="space-y-4">
        <NavBar title="Chat" showBack />
        <p className="rounded-3xl border border-[#ecd9cb] bg-white p-4 text-sm text-[#8e6b5b]">
          Join a session first.
        </p>
      </div>
    );
  }

  const memberName = session.members.find((member) => member.id === memberId)?.name ?? "You";

  return (
    <div className="space-y-5">
      <NavBar title="Chat" showBack />
      <div className="rounded-3xl border border-[#ecd9cb] bg-[#fff7ef] p-4">
        <p className="text-xs text-[#8e6b5b]">Session {session.code}</p>
        <p className="font-semibold text-[color:var(--primary)]">{session.name}</p>
      </div>
      <ChatPanel
        sessionCode={session.code}
        memberId={memberId}
        memberName={memberName}
        initialMode={initialMode}
      />
      <Button asChild variant="ghost" size="sm" className="w-full">
        <Link href="/swipe">
          <ArrowLeft className="h-4 w-4" />
          Swipe
        </Link>
      </Button>
    </div>
  );
}
