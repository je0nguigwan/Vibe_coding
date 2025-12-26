"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import ConsensusMeter from "@/components/consensus-meter";
import ResultList from "@/components/result-list";
import RestaurantDetailSheet from "@/components/restaurant-detail-sheet";
import { Button } from "@/components/ui/button";
import { aggregateResults, getConsensusStatus } from "@/lib/aggregation";
import { getCurrentSession, getSession } from "@/lib/storage";
import { Restaurant, SessionState } from "@/lib/types";
import { RawRestaurant, normalizeRestaurant } from "@/lib/restaurant-data";
import { SWIPE_DECK_SIZE } from "@/lib/constants";

export default function ResultsPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const current = getCurrentSession();
    if (!current) return;
    const loaded = getSession(current.code);
    if (loaded) setSession(loaded);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadDragonData() {
      try {
        const response = await fetch("/data/DragonMasterData.fixed.json");
        if (!response.ok) throw new Error("Failed to load DragonMasterData.fixed.json");
        const payload = (await response.json()) as RawRestaurant[];
        if (!Array.isArray(payload)) {
          throw new Error("DragonMasterData.fixed.json must be an array");
        }
        const normalized = payload.map((item, index) => normalizeRestaurant(item, index + 1));
        if (active) {
          setRestaurants(normalized);
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setRestaurants([]);
        }
      } finally {
        if (active) {
          setDataReady(true);
        }
      }
    }
    loadDragonData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!session || !dataReady) return;
    setShowLeaderboard(true);
    const timeout = setTimeout(() => {
      setShowLeaderboard(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [session, dataReady]);

  const scores = useMemo(() => {
    if (!session) return [];
    return aggregateResults(restaurants, session).filter((score) => score.likeCount + score.dislikeCount > 0);
  }, [restaurants, session]);

  const memberStats = useMemo(() => {
    if (!session) return [];
    return session.members.map((member) => {
      const swipes = session.swipes[member.id] ?? {};
      const entries = Object.values(swipes);
      const liked = entries.filter((value) => value === "like").length;
      const disliked = entries.filter((value) => value === "dislike").length;
      const neutral = entries.filter((value) => value === "neutral").length;
      const complete = entries.length >= SWIPE_DECK_SIZE;
      const progress = SWIPE_DECK_SIZE > 0 ? Math.min(100, Math.round((entries.length / SWIPE_DECK_SIZE) * 100)) : 0;
      return {
        id: member.id,
        name: member.name,
        total: entries.length,
        liked,
        disliked,
        neutral,
        complete,
        progress,
      };
    });
  }, [session]);

  const leaderboardItems = useMemo(() => {
    const ranked = scores.slice(0, 3).map((score) => ({
      id: score.restaurant.id,
      name: score.restaurant.name,
      subtitle: `${score.restaurant.cuisine} · ${score.restaurant.price_range}`,
      match: Math.round(score.score * 100),
    }));
    const placeholders = [
      { id: "placeholder-1", name: "Top pick", subtitle: "Swipe to rank", match: 0 },
      { id: "placeholder-2", name: "Runner up", subtitle: "Swipe to rank", match: 0 },
      { id: "placeholder-3", name: "Third place", subtitle: "Swipe to rank", match: 0 },
    ];
    return [...ranked, ...placeholders].slice(0, 3);
  }, [scores]);

  function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.map((part) => part[0]?.toUpperCase()).join("");
    return letters.slice(0, 2) || "ME";
  }

  if (!session || !dataReady) {
    return (
      <div className="space-y-4">
        <NavBar title="Group results" showBack />
        <p className="rounded-3xl border border-[#ecd9cb] bg-white p-4 text-sm text-[#8e6b5b]">
          Swipe in a session to see results.
        </p>
      </div>
    );
  }

  const { consensusScore, decisionReady } = getConsensusStatus(scores, session.members.length);
  const topPicks = scores.slice(0, 2);

  return (
    <div className="relative h-[calc(90vh-60px)] overflow-y-auto pr-1">
      {showLeaderboard ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[2.25rem] p-6 leaderboard-overlay">
          <div className="absolute inset-0 rounded-[2.25rem] leaderboard-confetti opacity-70" />
          <div className="relative w-full max-w-md space-y-4 text-center">
            <div className="leaderboard-card">
              <p className="text-xs uppercase tracking-[0.4em] text-[#8e6b5b]">Leaderboard</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--primary)]">
                Top 3 picks
              </p>
            </div>
            <div className="grid grid-cols-3 items-end gap-3">
              {[leaderboardItems[1], leaderboardItems[0], leaderboardItems[2]].map((item, index) => {
                const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
                const height = rank === 1 ? "h-36" : rank === 2 ? "h-28" : "h-24";
                const delay = rank === 1 ? "0ms" : rank === 2 ? "120ms" : "220ms";
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border border-[#f0ddd0] bg-white/80 px-3 py-3 text-left shadow-sm leaderboard-card ${height} ${rank === 1 ? "leaderboard-float" : ""}`}
                    style={{ animationDelay: delay }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-[#f0ddd0] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#8e6b5b]">
                        #{rank}
                      </span>
                      <span className="text-[11px] font-semibold text-[color:var(--accent)]">{item.match}%</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--primary)]">{item.name}</p>
                    <p className="mt-1 text-[11px] text-[#8e6b5b]">{item.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-6">
        <NavBar
          title="Group results"
          showBack
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/swipe">Keep swiping</Link>
            </Button>
          }
        />

        <ConsensusMeter score={consensusScore} decisionReady={decisionReady} />

        <div className="rounded-3xl border border-[#ecd9cb] bg-[linear-gradient(135deg,_#fff4ea_0%,_#fff_55%,_#fff0e6_100%)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[color:var(--primary)]">Member status</p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e6b5b]">
              {session.members.length} members
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {memberStats.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-[#f0ddd0] bg-white px-3 py-2 text-xs text-[#8e6b5b] shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0ddd0] bg-[#fff6f0] text-[11px] font-semibold text-[color:var(--primary)]">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--primary)]">{member.name}</p>
                      <p className="text-[11px] text-[#8e6b5b]">{member.total} swipes</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      member.complete
                        ? "bg-[color:var(--success)] text-white"
                        : "border border-[#edd9cc] bg-white text-[#8e6b5b]"
                    }`}
                  >
                    {member.complete ? "Done" : "In progress"}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4e2d6]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,_#f29d73_0%,_#d96a5f_70%)]"
                      style={{ width: `${member.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-[#edd9cc] bg-[#fff7ef] px-2 py-0.5">
                    Likes {member.liked}
                  </span>
                  <span className="rounded-full border border-[#edd9cc] bg-[#fff7ef] px-2 py-0.5">
                    Dislikes {member.disliked}
                  </span>
                  <span className="rounded-full border border-[#edd9cc] bg-[#fff7ef] px-2 py-0.5">
                    Neutral {member.neutral}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[#ecd9cb] bg-[linear-gradient(140deg,_#fff4ea_0%,_#fff_55%,_#fff0e6_100%)] p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[color:var(--primary)]">Top matches</p>
            <span className="rounded-full border border-[#f0ddd0] bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#8e6b5b]">
              {scores.length} total
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {topPicks.length === 0 ? (
              <p className="text-xs text-[#8e6b5b]">No swipes yet. Head back to swipe.</p>
            ) : (
              topPicks.map((score) => (
                <div
                  key={score.restaurant.id}
                  className="rounded-2xl border border-[#f0ddd0] bg-white/70 p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Match highlight</p>
                      <p className="text-base font-semibold text-[color:var(--primary)]">{score.restaurant.name}</p>
                      <p className="mt-1 text-xs text-[#8e6b5b]">
                        {score.restaurant.cuisine} · {score.restaurant.price_range}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setDetailRestaurant(score.restaurant)}>
                      View
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-[#8e6b5b]">
                    {score.likeCount} liked · {Math.round(score.score * 100)}% match
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#ecd9cb] bg-white/60 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[color:var(--primary)]">All results</p>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8e6b5b]">
              Ranked by match
            </span>
          </div>
          <div className="mt-3">
            <ResultList scores={scores} onView={setDetailRestaurant} />
          </div>
        </div>
      </div>
      <RestaurantDetailSheet restaurant={detailRestaurant} onClose={() => setDetailRestaurant(null)} />
    </div>
  );
}
