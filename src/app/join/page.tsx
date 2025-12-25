"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, joinSession } from "@/lib/storage";
import { getNextMemberName } from "@/lib/preferences";

export default function JoinSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [memberName, setMemberName] = useState("");
  const [groupName, setGroupName] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    const session = getSession(code);
    if (!session) {
      setGroupName(null);
      return;
    }
    setGroupName(session.name);
    setMemberName((prev) => prev || getNextMemberName(session.members.length));
  }, [code]);

  function handleJoin() {
    const joined = joinSession(code.trim(), memberName.trim() || getNextMemberName(0));
    if (!joined) {
      setError("Session not found. Check the code.");
      return;
    }
    router.push("/preferences");
  }

  return (
    <div className="space-y-6">
      <NavBar title="Join session" showBack />

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#8e6b5b]">Session code</label>
          <Input
            placeholder="123456"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#8e6b5b]">Your name</label>
          <Input
            placeholder="User B"
            value={memberName}
            onChange={(event) => setMemberName(event.target.value)}
          />
        </div>
        {groupName ? (
          <div className="rounded-2xl bg-[#fff7ef] p-3 text-xs text-[#8e6b5b]">
            Joining <span className="font-semibold text-[color:var(--primary)]">{groupName}</span>
          </div>
        ) : null}
        {error ? <p className="text-xs text-[color:var(--danger)]">{error}</p> : null}
        <Button className="w-full" onClick={handleJoin}>
          Join & continue
        </Button>
      </div>
    </div>
  );
}
