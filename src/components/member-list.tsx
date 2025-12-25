import { SessionState } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function MemberList({ session }: { session: SessionState }) {
  return (
    <div className="space-y-3 rounded-3xl border border-[#ecd9cb] bg-white p-4">
      <p className="text-sm font-semibold text-[color:var(--primary)]">Members</p>
      <div className="space-y-2">
        {session.members.map((member) => {
          const hasPrefs = Boolean(session.preferences[member.id]);
          return (
            <div key={member.id} className="flex items-center justify-between">
              <span className="text-sm font-medium text-[color:var(--foreground)]">{member.name}</span>
              <Badge variant={hasPrefs ? "success" : "outline"}>
                {hasPrefs ? "Prefs ready" : "Pending"}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
