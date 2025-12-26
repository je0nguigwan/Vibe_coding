import { Flame, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function RestaurantCard({
  restaurant,
  compact = false,
  onSeeMore,
  showMapPreview = false,
}: {
  restaurant: Restaurant;
  compact?: boolean;
  onSeeMore?: () => void;
  showMapPreview?: boolean;
}) {
  function hashString(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) % 0x7fffffff;
    }
    return hash;
  }

  function pickFrom<T>(list: T[], seed: number) {
    if (list.length === 0) return list[0];
    return list[seed % list.length];
  }

  function buildMapMeta(name: string) {
    const seed = hashString(name);
    const areas = [
      "Seongsu",
      "Yeonnam",
      "Itaewon",
      "Hannam",
      "Euljiro",
      "Hongdae",
      "Jamsil",
      "Gangnam",
      "Ikseon",
      "Samcheong",
    ];
    const walks = ["3 min walk", "5 min walk", "7 min walk", "9 min walk"];
    const distances = ["0.4 km", "0.7 km", "1.1 km", "1.6 km"];
    const transits = ["Line 2", "Line 3", "Line 6", "Line 9", "Bus stop"];
    const landmarks = ["Near riverside", "By city park", "Next to market", "Behind museum", "By coffee alley"];
    return {
      area: pickFrom(areas, seed),
      walk: pickFrom(walks, seed + 3),
      distance: pickFrom(distances, seed + 7),
      transit: pickFrom(transits, seed + 11),
      landmark: pickFrom(landmarks, seed + 13),
    };
  }

  function buildMapStyle(name: string) {
    const palettes = [
      { water: "rgba(172, 216, 235, 0.9)", land: "rgba(244, 239, 232, 0.95)", park: "rgba(206, 231, 210, 0.9)" },
      { water: "rgba(177, 223, 241, 0.9)", land: "rgba(248, 242, 234, 0.95)", park: "rgba(210, 236, 214, 0.9)" },
      { water: "rgba(164, 212, 233, 0.9)", land: "rgba(245, 238, 229, 0.95)", park: "rgba(204, 230, 207, 0.9)" },
    ];
    const index = hashString(name) % palettes.length;
    const { water, land, park } = palettes[index];
    const grid = [
      "linear-gradient(90deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
      "linear-gradient(0deg, rgba(255,255,255,0.65) 1px, transparent 1px)",
    ].join(",");
    const roads = [
      "linear-gradient(120deg, transparent 0 45%, rgba(210,188,172,0.7) 45% 48%, transparent 48% 100%)",
      "linear-gradient(25deg, transparent 0 35%, rgba(210,188,172,0.7) 35% 38%, transparent 38% 100%)",
      "linear-gradient(160deg, transparent 0 60%, rgba(210,188,172,0.6) 60% 63%, transparent 63% 100%)",
    ].join(",");
    return {
      backgroundImage: [
        "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.7) 0 10%, transparent 10%)",
        `linear-gradient(135deg, ${land} 0 60%, ${water} 60% 100%)`,
        `radial-gradient(circle at 25% 70%, ${park} 0 22%, transparent 22%)`,
        `radial-gradient(circle at 70% 65%, ${park} 0 18%, transparent 18%)`,
        roads,
        grid,
      ].join(","),
      backgroundSize: "auto, auto, auto, auto, auto, 28px 28px",
    };
  }

  const mapMeta = buildMapMeta(restaurant.name);
  const mapCaption = `${mapMeta.area} · ${mapMeta.distance} · ${mapMeta.walk}`;

  const rawDescription = restaurant.description?.trim() ?? "";
  const rawAggregate = restaurant.aggregate_comment?.trim() ?? "";
  const description =
    rawAggregate && rawDescription.endsWith(rawAggregate)
      ? rawDescription.slice(0, rawDescription.length - rawAggregate.length).trim()
      : rawDescription;
  const descriptionItems = description
    .split(/\.\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (item.endsWith(".") ? item : `${item}.`));

  return (
    <Card className="overflow-hidden">
      <div
        className={cn(
          "relative rounded-[2.25rem] bg-[linear-gradient(140deg,_#f6d7c2_0%,_#f1b6c5_55%,_#f3c1b0_100%)]",
          compact ? "h-[250px]" : "h-[214px]"
        )}
      >
        {showMapPreview ? (
          <div className="absolute inset-0" style={buildMapStyle(restaurant.name)}>
            <div className="absolute inset-3 rounded-2xl border border-[#e7d6c9] bg-white/40" />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
              <div className="h-7 w-7 rounded-full border border-[#d67a43] bg-white shadow-sm" />
              <div className="-mt-2 h-3.5 w-3.5 rotate-45 rounded-sm border border-[#d67a43] bg-white shadow-sm" />
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-[#efd8c8] bg-white/85 px-2 py-1 text-[10px] font-semibold text-[#8e6b5b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6fb8d6]" />
              River
            </div>
            <div className="absolute left-4 top-12 flex items-center gap-1 rounded-full border border-[#efd8c8] bg-white/85 px-2 py-1 text-[10px] font-semibold text-[#8e6b5b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9ac9a6]" />
              Park
            </div>
            <div className="absolute bottom-3 left-3 rounded-full border border-[#efd8c8] bg-white/85 px-3 py-1 text-[10px] font-semibold text-[#8e6b5b]">
              {mapCaption}
            </div>
            <div className="absolute bottom-3 right-3 rounded-full border border-[#efd8c8] bg-white/85 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8e6b5b]">
              Map view
            </div>
          </div>
        ) : restaurant.photos[0] ? (
          <img
            src={restaurant.photos[0]}
            alt={restaurant.name}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <CardContent className={cn(compact ? "min-h-[30px] space-y-1.5 px-4 pb-1" : "space-y-1.5")}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              className={cn(
                "font-[family-name:var(--font-display)] font-bold text-[color:var(--primary)]",
                compact ? "text-base" : "text-lg"
              )}
            >
              {restaurant.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="warm">{restaurant.cuisine}</Badge>
              <Badge variant="outline">{restaurant.price_range}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {Array.from(
                  { length: restaurant.spiciness_level === "hot" ? 3 : restaurant.spiciness_level === "medium" ? 2 : 1 },
                  (_, index) => (
                    <Flame key={index} className="h-3.5 w-3.5" />
                  )
                )}
              </Badge>
            </div>
            {compact ? null : (
              <p className="mt-2 text-xs text-[#8e6b5b]">
                Hours: {Array.isArray(restaurant.hours) ? restaurant.hours.join("; ") : restaurant.hours}
              </p>
            )}
            {!compact && showMapPreview ? (
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#8e6b5b]">
                <span className="rounded-full border border-[#edd9cc] bg-[#fff6f0] px-2 py-1">{mapMeta.transit}</span>
                <span className="rounded-full border border-[#edd9cc] bg-[#fff6f0] px-2 py-1">{mapMeta.landmark}</span>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#fdf0e8] px-2 py-1 text-sm font-semibold text-[color:var(--primary)]">
            <Star className="h-4 w-4" />
            {restaurant.rating.toFixed(1)}
          </div>
        </div>
          <div className="flex min-h-0 flex-col">
            {descriptionItems.length > 0 ? (
            <ol className="mt-0 space-y-0.5 text-[11px] text-[#8e6b5b]">
              {descriptionItems.slice(0, 2).map((item, index) => (
                <li key={`${restaurant.id}-desc-${index}`} className="flex gap-2">
                  <span className="font-semibold text-[#b27a5b] text-[11px]">{index + 1}.</span>
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ol>
          ) : null}
          {rawAggregate ? (
            <div
              className="mt-0 rounded-xl border border-[#edd9cc] bg-[#fff6f0] px-3 py-1.5 text-center text-[11px] text-[#8e6b5b] leading-tight"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {rawAggregate}
            </div>
          ) : null}
          {descriptionItems.length === 0 && !rawAggregate ? (
            <p className="mt-0 text-[11px] text-[#8e6b5b] leading-tight">
              {restaurant.comments[0] || "Top pick for your group."}
            </p>
          ) : null}
          <div className="mt-1 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              data-swipe-ignore="true"
              className="w-fit px-0 text-[11px]"
              onClick={onSeeMore}
            >
              See more
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {restaurant.diet_tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag.replace("-", " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
