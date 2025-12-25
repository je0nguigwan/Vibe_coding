import { RestaurantScore } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function ResultList({ scores }: { scores: RestaurantScore[] }) {
  return (
    <div className="space-y-3">
      {scores.map((score, index) => {
        const matchPercent = Math.round(score.score * 100);
        return (
          <div
            key={score.restaurant.id}
            className="rounded-3xl border border-[#ecd9cb] bg-[linear-gradient(140deg,_#fff7ef_0%,_#fff_45%,_#fff2e8_100%)] p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#f0ddd0] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e6b5b]">
                    Rank {index + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#b27a5b]">
                    {score.restaurant.cuisine}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
                  {score.restaurant.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-[#8e6b5b]">
                  <span>{score.restaurant.price_range}</span>
                  <span>?</span>
                  <span>{score.likeCount} liked</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[color:var(--accent)]">{matchPercent}%</p>
                <p className="text-xs text-[#8e6b5b]">match</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4e2d6]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_#f29d73_0%,_#d96a5f_70%)]"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {score.likedBy.length === 0 ? (
                <Badge variant="outline">No likes yet</Badge>
              ) : (
                score.likedBy.map((member) => (
                  <Badge key={member} variant="success">
                    {member} liked
                  </Badge>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
