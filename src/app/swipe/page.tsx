"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Settings, Users } from "lucide-react";
import SwipeDeck from "@/components/swipe-deck";
import { Button } from "@/components/ui/button";
import { filterRestaurants } from "@/lib/filters";
import { createSession, getCurrentSession, getSession, saveSwipe } from "@/lib/storage";
import { Cuisine, Restaurant, SessionState } from "@/lib/types";
import { RawRestaurant, normalizeRestaurant } from "@/lib/restaurant-data";

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

function buildCuisineDeck(all: Restaurant[], session: SessionState, total: number) {
  const weights: CuisineCount = {};
  session.members.forEach((member) => {
    const prefs = session.preferences[member.id];
    if (!prefs) return;
    Object.entries(prefs.cuisine).forEach(([cuisine, value]) => {
      if (value !== "yes") return;
      weights[cuisine] = (weights[cuisine] ?? 0) + 1;
    });
  });

  const counts = buildCounts(weights, total);
  if (counts.size === 0) return all.slice(0, total);

  const byCuisine = all.reduce<Record<string, Restaurant[]>>((acc, restaurant) => {
    const key = restaurant.cuisine as Cuisine;
    if (!acc[key]) acc[key] = [];
    acc[key].push(restaurant);
    return acc;
  }, {});

  const selected: Restaurant[] = [];
  counts.forEach((count, cuisine) => {
    const list = byCuisine[cuisine] ?? [];
    list.slice(0, count).forEach((item) => selected.push(item));
  });

  if (selected.length < total) {
    const used = new Set(selected.map((item) => item.id));
    const remaining = all.filter((item) => !used.has(item.id));
    selected.push(...remaining.slice(0, total - selected.length));
  }

  return selected.slice(0, total);
}

export default function SwipePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [dragonRestaurants, setDragonRestaurants] = useState<Restaurant[]>([]);
  const [dataReady, setDataReady] = useState(false);

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
        const response = await fetch("/data/DragonMasterData.json");
        if (!response.ok) throw new Error("Failed to load DragonMasterData.json");
        const payload = (await response.json()) as RawRestaurant[];
        if (!Array.isArray(payload)) {
          throw new Error("DragonMasterData.json must be an array");
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
    if (!prefs) return all.slice(0, 10);
    const filtered = filterRestaurants(all, prefs);
    const base = filtered.length > 0 ? filtered : all;
    return buildCuisineDeck(base, session, 10);
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
          <Button asChild variant="ghost" size="sm" className="h-12 w-12 rounded-full" aria-label="Preferences">
            <Link href="/preferences">
              <Settings className="h-5 w-5" />
            </Link>
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
    </div>
  );
}
