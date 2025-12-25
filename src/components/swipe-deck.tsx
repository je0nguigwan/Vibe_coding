"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { Minus, ThumbsDown, ThumbsUp } from "lucide-react";
import { Restaurant, SwipeValue } from "@/lib/types";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantDetailSheet from "@/components/restaurant-detail-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 120;
const DRAG_HINT_THRESHOLD = 40;
const AXIS_LOCK_THRESHOLD = 24;

export default function SwipeDeck({
  restaurants,
  onSwipe,
  onComplete,
}: {
  restaurants: Restaurant[];
  onSwipe: (restaurant: Restaurant, value: SwipeValue) => void;
  onComplete?: () => void;
}) {
  const [stack, setStack] = useState<Restaurant[]>([]);
  const nextIndexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState<SwipeValue | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const initial = restaurants.slice(0, 3);
    setStack(initial);
    nextIndexRef.current = initial.length;
    setCurrentIndex(initial.length > 0 ? 1 : 0);
  }, [restaurants]);

  const current = stack[0];

  function appendNextCard(existing: Restaurant[]) {
    if (restaurants.length === 0) return existing;
    if (nextIndexRef.current >= restaurants.length) return existing;
    const next = restaurants[nextIndexRef.current];
    nextIndexRef.current += 1;
    return [...existing, next].slice(0, 3);
  }

  function handleSwipe(value: SwipeValue) {
    if (!current || isLeaving) return;
    setDirection(value);
    setIsLeaving(true);
    onSwipe(current, value);
    if (value === "like") {
      setDragX(520);
      setDragY(0);
    } else if (value === "dislike") {
      setDragX(-520);
      setDragY(0);
    } else {
      setDragX(0);
      setDragY(-520);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!current) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-swipe-ignore='true']")) return;
    if (target?.closest("a, button")) return;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (startXRef.current === null || startYRef.current === null || isLeaving) return;
    const deltaX = event.clientX - startXRef.current;
    const deltaY = event.clientY - startYRef.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX + AXIS_LOCK_THRESHOLD < absY) {
      setDragY(deltaY);
      setDragX(0);
      return;
    }
    if (absY + AXIS_LOCK_THRESHOLD < absX) {
      setDragX(deltaX);
      setDragY(0);
    }
  }

  function handlePointerUp() {
    if (startXRef.current === null || startYRef.current === null) return;
    if (dragX > SWIPE_THRESHOLD) {
      handleSwipe("like");
    } else if (dragX < -SWIPE_THRESHOLD) {
      handleSwipe("dislike");
    } else if (dragY < -SWIPE_THRESHOLD) {
      handleSwipe("neutral");
    } else {
      setDragX(0);
      setDragY(0);
    }
    startXRef.current = null;
    startYRef.current = null;
  }

  if (!current) {
    return (
      <div className="rounded-3xl border border-dashed border-[#ecd9cb] bg-white p-6 text-center">
        <p className="text-sm font-semibold text-[color:var(--primary)]">No more restaurants in the deck.</p>
        <p className="mt-2 text-xs text-[#8e6b5b]">Head to results to see the group match.</p>
      </div>
    );
  }

  const rotate = dragX / 18;
  const dragDirection =
    dragX > DRAG_HINT_THRESHOLD
      ? "like"
      : dragX < -DRAG_HINT_THRESHOLD
        ? "dislike"
        : dragY < -DRAG_HINT_THRESHOLD
          ? "neutral"
          : null;

  return (
    <div className="space-y-0.5">
      <div
        className={cn(
          "relative rounded-[2.75rem] border border-[#e3c7b5] bg-white/60 pb-4 transition overflow-hidden",
          (direction === "like" || dragDirection === "like") &&
            "border-[#d67a43] shadow-[0_0_0_4px_rgba(214,122,67,0.2)]",
          (direction === "dislike" || dragDirection === "dislike") &&
            "border-[#c45a4a] shadow-[0_0_0_4px_rgba(196,90,74,0.2)]",
          (direction === "neutral" || dragDirection === "neutral") &&
            "border-[#c9b39a] shadow-[0_0_0_4px_rgba(201,179,154,0.2)]"
        )}
      >
        <div className="invisible pointer-events-none">
          <RestaurantCard restaurant={current} compact />
        </div>
        {stack
          .map((card, idx) => {
            const isTop = idx === 0;
            const isMiddle = idx === 1;
            const isBack = idx === 2;
            const baseTransform = isMiddle
              ? "translateY(10px) scale(0.98)"
              : isBack
                ? "translateY(18px) scale(0.96)"
                : "translateY(0px) scale(1)";
            const transform = isTop
              ? `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotate}deg)`
              : baseTransform;
            return (
              <div
                key={card.id}
                className={cn(
                  "absolute inset-0",
                  isTop ? "z-20" : isMiddle ? "z-10" : "z-0"
                )}
                onPointerDown={isTop ? handlePointerDown : undefined}
                onPointerMove={isTop ? handlePointerMove : undefined}
                onPointerUp={isTop ? handlePointerUp : undefined}
                onPointerCancel={isTop ? handlePointerUp : undefined}
                style={{
                  transform,
                  transition: isTop
                    ? startXRef.current === null
                      ? "transform 280ms ease, opacity 200ms ease"
                      : "none"
                    : "transform 280ms ease",
                  opacity: isTop ? (isLeaving ? 0 : 1) : 1,
                  pointerEvents: isTop && !isLeaving ? "auto" : "none",
                  touchAction: isTop ? "none" : "auto",
                }}
                onTransitionEnd={() => {
                  if (!isTop || !isLeaving) return;
                  setDragX(0);
                  setDragY(0);
                  setDirection(null);
                  setIsLeaving(false);
                  setStack((prev) => {
                    const updated = appendNextCard(prev.slice(1));
                    if (updated.length === 0) {
                      onComplete?.();
                    }
                    return updated;
                  });
                  setCurrentIndex((prev) => Math.min(prev + 1, restaurants.length));
                }}
              >
                <RestaurantCard
                  restaurant={card}
                  compact
                  onSeeMore={() => setDetailRestaurant(card)}
                />
            </div>
          );
        })}
        <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2">
          <div
            className={cn(
              "flex h-12 w-20 flex-col items-center justify-center rounded-full bg-white text-[#8e6b5b] shadow-sm transition",
              dragDirection === "neutral" || direction === "neutral" ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          >
            <Minus className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Neutral</span>
          </div>
        </div>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10">
          <div
            className={cn(
              "flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-[color:var(--danger)] shadow-sm transition",
              dragDirection === "dislike" || direction === "dislike" ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          >
            <ThumbsDown className="h-7 w-7" />
            <span className="text-[10px] font-semibold">Nope</span>
          </div>
        </div>
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <div
            className={cn(
              "flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white text-[color:var(--primary)] shadow-sm transition",
              dragDirection === "like" || direction === "like" ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          >
            <ThumbsUp className="h-7 w-7" />
            <span className="text-[10px] font-semibold">Good</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-10"
          onClick={() => handleSwipe("dislike")}
          aria-label="Nope"
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-10"
          onClick={() => handleSwipe("neutral")}
          aria-label="Neutral"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 h-10"
          onClick={() => handleSwipe("like")}
          aria-label="Good"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/results">Results</Link>
        </Button>
        <p className="text-[11px] text-[#8e6b5b]">
          {currentIndex} of {restaurants.length} cards
        </p>
      </div>
      <RestaurantDetailSheet restaurant={detailRestaurant} onClose={() => setDetailRestaurant(null)} />
    </div>
  );
}
