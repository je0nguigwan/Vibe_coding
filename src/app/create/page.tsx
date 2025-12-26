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
  }

  useEffect(() => {
    if (!sessionCode || typeof window === "undefined") return;
    setShareLink(`${window.location.origin}/join?code=${sessionCode}`);
  }, [sessionCode]);

  return (
    <div className="space-y-3">
      <NavBar title="Create session" showBack />

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-5">
        <div className="space-y-3">
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
          <p className="mt-1 text-xs text-[#8e6b5b]">Share link: {shareLink}</p>
          <div className="mt-3 flex items-center justify-center">
            <div
              className="h-32 w-32 rounded-2xl border border-[#e6d2c3] bg-white p-3"
              style={{
                backgroundImage: [
                  "linear-gradient(90deg, #2b1f1f 50%, transparent 50%)",
                  "linear-gradient(#2b1f1f 50%, transparent 50%)",
                  "linear-gradient(90deg, transparent 50%, #2b1f1f 50%)",
                  "linear-gradient(transparent 50%, #2b1f1f 50%)",
                ].join(","),
                backgroundSize: "12px 12px, 12px 12px, 6px 6px, 6px 6px",
                backgroundPosition: "0 0, 0 0, 3px 3px, 3px 3px",
              }}
            />
          </div>
          <p className="mt-1 text-center text-xs font-semibold text-[#8e6b5b]">QR</p>
          <Button className="mt-3 w-full" onClick={() => router.push("/preferences")}>
            Continue to preferences
          </Button>
        </div>
      ) : null}
    </div>
  );
}
