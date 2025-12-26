"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Settings, Users } from "lucide-react";
import SwipeDeck from "@/components/swipe-deck";
import { Button } from "@/components/ui/button";
import { createSession, getCurrentSession, getSession, saveSwipe } from "@/lib/storage";
import { Cuisine, Restaurant, SessionState } from "@/lib/types";
import { RawRestaurant, normalizeRestaurant } from "@/lib/restaurant-data";
import { SWIPE_DECK_SIZE } from "@/lib/constants";

type CuisineCount = Record<string, number>;
function buildCounts(weights: CuisineCount, total: number) {
  const entries = Object.entries(weights).filter(([, value]) => value > 0);
  const sum = entries.reduce((acc, [, value]) => acc + value, 0);
  if (entries.length === 0 || sum === 0) return new Map<string, number>();

  const targets = entries.map(([key, value]) => ({
    key,
    value,
    exact: (value / sum) * total,
  }));

  const base = new Map<string, number>();
  let remaining = total;
  targets.forEach((entry) => {
    const count = Math.floor(entry.exact);
    base.set(entry.key, count);
    remaining -= count;
  });

  targets
    .sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)))
    .forEach((entry) => {
      if (remaining <= 0) return;
      base.set(entry.key, (base.get(entry.key) ?? 0) + 1);
      remaining -= 1;
    });

  return base;
}

function shuffleList<T>(list: T[]) {
  const items = [...list];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function buildPreferenceDeck(
  all: Restaurant[],
  prefs: SessionState["preferences"][string] | null,
  total: number
) {
  if (!prefs) return all.slice(0, total);
  const selectedCuisines = Object.entries(prefs.cuisine)
    .filter(([, value]) => value === "yes")
    .map(([cuisine]) => cuisine as Cuisine);

  if (selectedCuisines.length === 0) {
    return all.slice(0, total);
  }

  const cuisineSet = new Set(selectedCuisines);
  const matches = all.filter((restaurant) => cuisineSet.has(restaurant.cuisine));

  if (matches.length > total) {
    return shuffleList(matches).slice(0, total);
  }

  const selected = matches;
  if (selected.length >= total) return selected.slice(0, total);

  const used = new Set(selected.map((item) => item.id));
  const pool = all.filter((item) => !used.has(item.id));
  const extras = shuffleList(pool).slice(0, total - selected.length);
  return [...selected, ...extras];
}

export default function SwipePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [dragonRestaurants, setDragonRestaurants] = useState<Restaurant[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [showQrPrompt, setShowQrPrompt] = useState(false);

  useEffect(() => {
    const current = getCurrentSession();
    if (!current) {
      const created = createSession("Quick demo", "Guest");
      setMemberId(created.member.id);
      setSession(created.session);
      return;
    }
    setMemberId(current.memberId);
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
          setDragonRestaurants(normalized);
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setDragonRestaurants([]);
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

  const restaurants = useMemo(() => {
    if (!session || !memberId) return [] as Restaurant[];
    const all = dragonRestaurants;
    const prefs = session.preferences[memberId] ?? null;
    if (!prefs) return all.slice(0, SWIPE_DECK_SIZE);
    return buildPreferenceDeck(all, prefs, SWIPE_DECK_SIZE);
  }, [session, memberId, dragonRestaurants]);

  function handleSwipe(restaurant: Restaurant, value: "like" | "dislike" | "neutral") {
    if (!session || !memberId) return;
    saveSwipe(session.code, memberId, restaurant.id, value);
  }

  if (!session || !memberId || !dataReady) {
    return null;
  }

  return (
    <div className="pt-1 space-y-0.5">
      <div className="rounded-3xl border border-[#f0cbb3] bg-white/70 px-4 py-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[color:var(--primary)]">{session.name}</p>
          <p className="text-xs font-semibold text-[#b06a4a]">#{session.code}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#8e6b5b]">
        <Button
          variant="ghost"
          size="sm"
          className="h-12 w-12 rounded-full"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 rounded-full"
            aria-label="Preferences"
            onClick={() => setShowQrPrompt(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button asChild variant="ghost" size="sm" className="h-12 w-12 rounded-full" aria-label="Group chat">
            <Link href="/chat?mode=group">
              <Users className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="h-12 w-12 rounded-full" aria-label="Direct message">
            <Link href="/chat?mode=dm">
              <MessageCircle className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <SwipeDeck restaurants={restaurants} onSwipe={handleSwipe} onComplete={() => router.push("/results")} />

      {showQrPrompt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[360px] rounded-[2rem] border border-[#ecd9cb] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[color:var(--primary)]">Scan to continue</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowQrPrompt(false);
                  router.push("/preferences");
                }}
              >
                X
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="h-44 w-44 rounded-2xl border border-[#e6d2c3] bg-white p-3"
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
            <p className="mt-4 text-center text-xs text-[#8e6b5b]">
              Mock QR for preference setup. Tap X to continue.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
