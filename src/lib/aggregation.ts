import { Restaurant, RestaurantScore, SessionState } from "@/lib/types";

export function aggregateResults(restaurants: Restaurant[], session: SessionState | null): RestaurantScore[] {
  if (!session) return [];
  const totalMembers = session.members.length;

  return restaurants
    .map((restaurant) => {
      let likeCount = 0;
      let dislikeCount = 0;
      const likedBy: string[] = [];

      session.members.forEach((member) => {
        const value = session.swipes[member.id]?.[restaurant.id];
        if (value === "like") {
          likeCount += 1;
          likedBy.push(member.name);
        }
        if (value === "dislike") {
          dislikeCount += 1;
        }
      });

      const score = totalMembers > 0 ? likeCount / totalMembers : 0;
      return { restaurant, likeCount, dislikeCount, score, likedBy };
    })
    .sort((a, b) => b.score - a.score || b.likeCount - a.likeCount);
}

export function getConsensusStatus(scores: RestaurantScore[], memberCount: number) {
  if (memberCount === 0) {
    return { consensusScore: 0, decisionReady: false };
  }
  const topScore = scores[0]?.score ?? 0;
  const decisionReady = topScore >= 0.6 && (scores[0]?.likeCount ?? 0) >= Math.ceil(memberCount / 2);
  return { consensusScore: Math.round(topScore * 100), decisionReady };
}
