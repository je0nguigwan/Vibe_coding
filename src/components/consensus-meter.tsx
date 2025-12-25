import { Progress, ProgressIndicator } from "@/components/ui/progress";

export default function ConsensusMeter({ score, decisionReady }: { score: number; decisionReady: boolean }) {
  return (
    <div className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[color:var(--primary)]">Consensus</p>
        <span className="text-sm font-semibold text-[color:var(--accent)]">{score}%</span>
      </div>
      <div className="mt-3">
        <Progress>
          <ProgressIndicator style={{ width: `${score}%` }} />
        </Progress>
      </div>
      <p className="mt-2 text-xs text-[#8e6b5b]">
        {decisionReady ? "Decision Ready: top pick is strong." : "Keep swiping to sharpen consensus."}
      </p>
    </div>
  );
}
