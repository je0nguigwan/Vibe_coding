"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import ConsensusMeter from "@/components/consensus-meter";
import ResultList from "@/components/result-list";
import { Button } from "@/components/ui/button";
import { aggregateResults, getConsensusStatus } from "@/lib/aggregation";
import { getCurrentSession, getSession } from "@/lib/storage";
import { Restaurant, SessionState } from "@/lib/types";
import { RawRestaurant, normalizeRestaurant } from "@/lib/restaurant-data";

export default function ResultsPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dataReady, setDataReady] = useState(false);

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
        const response = await fetch("/data/DragonMasterData.json");
        if (!response.ok) throw new Error("Failed to load DragonMasterData.json");
        const payload = (await response.json()) as RawRestaurant[];
        if (!Array.isArray(payload)) {
          throw new Error("DragonMasterData.json must be an array");
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

  const scores = useMemo(() => {
    if (!session) return [];
    return aggregateResults(restaurants, session).filter((score) => score.likeCount + score.dislikeCount > 0);
  }, [restaurants, session]);

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
    <div className="h-[calc(90vh-60px)] overflow-y-auto pr-1">
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
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/restaurants/${score.restaurant.id}`}>View</Link>
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
            <ResultList scores={scores} />
          </div>
        </div>
      </div>
    </div>
  );
}
