"use client";

import { useEffect, useMemo, useState } from "react";
import { ChatMessage, Member, SessionState } from "@/lib/types";
import { addChatMessage, addDirectMessage, getSession } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function getThreadId(memberId: string, otherId: string) {
  return [memberId, otherId].sort().join(":");
}

export default function ChatPanel({
  sessionCode,
  memberId,
  memberName,
  initialMode = "group",
}: {
  sessionCode: string;
  memberId: string;
  memberName: string;
  initialMode?: "group" | "dm";
}) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [mode, setMode] = useState<"group" | "dm">(initialMode);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const loaded = getSession(sessionCode);
    if (loaded) setSession(loaded);

    const interval = setInterval(() => {
      const latest = getSession(sessionCode);
      if (latest) setSession(latest);
    }, 1200);

    return () => clearInterval(interval);
  }, [sessionCode]);

  const members = session?.members ?? [];

  useEffect(() => {
    if (!session) return;
    if (mode === "group") {
      setMessages(session.messages);
      return;
    }
    const target = selectedMember ?? members.find((member) => member.id !== memberId) ?? null;
    setSelectedMember(target);
    if (!target) {
      setMessages([]);
      return;
    }
    const threadId = getThreadId(memberId, target.id);
    setMessages(session.directMessages?.[threadId] ?? []);
  }, [session, mode, selectedMember, memberId, members]);

  const dmTargets = useMemo(() => members.filter((member) => member.id !== memberId), [members, memberId]);

  function handleSend() {
    if (!input.trim()) return;
    if (mode === "group") {
      addChatMessage(sessionCode, {
        memberId,
        memberName,
        message: input.trim(),
      });
    } else if (selectedMember) {
      const threadId = getThreadId(memberId, selectedMember.id);
      addDirectMessage(sessionCode, threadId, {
        memberId,
        memberName,
        message: input.trim(),
      });
    }
    setInput("");
    const updated = getSession(sessionCode);
    if (updated) setSession(updated);
  }

  return (
    <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
          {mode === "group" ? "Group Chat" : "Direct Message"}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "group" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("group")}
          >
            Group
          </Button>
          <Button
            variant={mode === "dm" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("dm")}
          >
            DM
          </Button>
        </div>
      </div>

      {mode === "dm" ? (
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8e6b5b]">Select member</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {dmTargets.length === 0 ? (
              <span className="text-xs text-[#8e6b5b]">No other members yet.</span>
            ) : (
              dmTargets.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    selectedMember?.id === member.id
                      ? "border-[color:var(--accent)] bg-[#ffe3ec] text-[color:var(--primary)]"
                      : "border-[#e6d2c3] text-[#8e6b5b]"
                  )}
                >
                  {member.name}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-3 max-h-44 space-y-3 overflow-y-auto rounded-2xl bg-[#fff7ef] p-3 text-sm">
        {messages.length === 0 ? (
          <p className="text-xs text-[#8e6b5b]">Send the first message.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-white p-2">
              <p className="text-xs font-semibold text-[color:var(--primary)]">{message.memberName}</p>
              <p className="text-sm text-[#6b4b3e]">{message.message}</p>
            </div>
          ))
        )}
      </div>
      <div className="mt-3 space-y-2">
        <Textarea
          placeholder={mode === "group" ? "Share a quick thought..." : "Send a DM..."}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button className="w-full" onClick={handleSend}>
          Send message
        </Button>
      </div>
    </div>
  );
}
