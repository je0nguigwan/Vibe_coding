"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSession } from "@/lib/storage";
import { getNextMemberName } from "@/lib/preferences";

export default function CreateSessionPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState(getNextMemberName(0));
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState("");

  function handleCreate() {
    const created = createSession(groupName || "Tonight's crew", memberName.trim() || getNextMemberName(0));
    setSessionCode(created.session.code);
    router.push("/preferences");
  }

  useEffect(() => {
    if (!sessionCode || typeof window === "undefined") return;
    setShareLink(`${window.location.origin}/join?code=${sessionCode}`);
  }, [sessionCode]);

  return (
    <div className="space-y-6">
      <NavBar title="Create session" showBack />

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-5">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#8e6b5b]">Group name</label>
            <Input
              placeholder="Friday supper crew"
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#8e6b5b]">Your name</label>
            <Input
              placeholder="User A"
              value={memberName}
              onChange={(event) => setMemberName(event.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleCreate}>
            Create & start
          </Button>
        </div>
      </div>

      {sessionCode ? (
        <div className="rounded-3xl border border-[#ecd9cb] bg-[#fff7ef] p-4 text-sm">
          <p className="font-semibold text-[color:var(--primary)]">Session code</p>
          <p className="mt-1 text-lg font-bold text-[color:var(--accent)]">{sessionCode}</p>
          <p className="mt-2 text-xs text-[#8e6b5b]">Share link: {shareLink}</p>
        </div>
      ) : null}
    </div>
  );
}
