import Link from "next/link";
import restaurantsData from "@/data/restaurants.json";
import dragonData from "@/../DragonMasterData.fixed.json";
import { Restaurant } from "@/lib/types";
import { getRestaurantImagePath } from "@/lib/restaurant-data";
import NavBar from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function buildHoursTable(hours: string[] | string) {
  if (!hours) return [];
  const list = Array.isArray(hours) ? hours : [hours];
  return list
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(.*)$/);
      if (!match) return { day: "Hours", time: entry };
      return { day: match[1], time: match[2] };
    });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 0x7fffffff;
  }
  return hash;
}

function pickMapStyle(name: string) {
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
    "linear-gradient(110deg, transparent 0 45%, rgba(210,188,172,0.7) 45% 48%, transparent 48% 100%)",
    "linear-gradient(20deg, transparent 0 35%, rgba(210,188,172,0.7) 35% 38%, transparent 38% 100%)",
    "linear-gradient(160deg, transparent 0 60%, rgba(210,188,172,0.6) 60% 63%, transparent 63% 100%)",
  ].join(",");
  const river = "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.0) 0 30%, transparent 30%),";
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

type DragonEntry = {
  name: string;
  rating: string | number;
  price_range: string;
  cuisine?: string;
  hours?: string[];
  photos?: string[];
  comments?: Array<[string, string] | string>;
  menu_sample?: string[];
  spiciness_level?: string | number;
  source?: string;
  description?: string;
  aggregate_comment?: string;
};

function normalizeDragon(entry: DragonEntry) {
  const rating = typeof entry.rating === "number" ? entry.rating : Number(entry.rating) || 0;
  const comments = (entry.comments || []).map((item) => {
    if (Array.isArray(item)) return `${item[0]}: ${item[1]}`;
    return item;
  });
  const imagePath = getRestaurantImagePath(entry.name);
  return {
    name: entry.name,
    rating,
    price_range: entry.price_range || "$",
    cuisine: (entry.cuisine || "Cafe").trim(),
    hours: entry.hours || [],
    photos: entry.photos && entry.photos.length > 0 ? entry.photos : imagePath ? [imagePath] : [],
    comments,
    menu_sample: entry.menu_sample || [],
    spiciness_level:
      entry.spiciness_level === 3 || entry.spiciness_level === "3"
        ? "hot"
        : entry.spiciness_level === 2 || entry.spiciness_level === "2"
          ? "medium"
          : "mild",
    source: entry.source || "",
    description: entry.description || "",
    aggregate_comment: entry.aggregate_comment || "",
  };
}

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurants = restaurantsData as Restaurant[];
  const paramId = params?.id ?? "";
  const lookupId = paramId.startsWith("r") ? paramId : `r${paramId}`;
  const restaurant =
    restaurants.find((item) => item.id === lookupId) ??
    restaurants.find((item) => slugify(item.name) === paramId);
  const dragonList = dragonData as DragonEntry[];
  const dragonIdMatch = paramId.match(/^d(\d+)$/);
  const dragonById = dragonIdMatch ? dragonList[Number(dragonIdMatch[1]) - 1] : null;
  const dragonMatch = restaurant
    ? dragonList.find((item) => slugify(item.name) === slugify(restaurant.name))
    : dragonById ?? dragonList.find((item) => slugify(item.name) === paramId);
  const detail = dragonMatch ? normalizeDragon(dragonMatch) : null;
  const displayName = detail?.name || restaurant?.name || "Restaurant";
  const sourceLink = detail?.source || restaurant?.source || "";
  const fallbackImage = getRestaurantImagePath(displayName);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayName)}`;
  if (!restaurant && !detail) {
    return (
      <div className="space-y-6">
        <NavBar title="Restaurant" showBack />
        <div className="rounded-3xl border border-[#ecd9cb] bg-white p-5 text-sm text-[#6b4b3e]">
          Restaurant not found.
        </div>
      </div>
    );
  }

  const hoursTable = buildHoursTable(detail?.hours ?? restaurant?.hours ?? []);

  return (
    <div className="h-[calc(90vh-60px)] overflow-y-auto pr-1">
      <div className="space-y-6">
        <NavBar title="Restaurant" showBack />

      <div className="rounded-3xl border border-[#ecd9cb] bg-white p-5">
        <div
          className="relative h-44 overflow-hidden rounded-3xl border border-[#efd8c8]"
          style={pickMapStyle(displayName)}
        >
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
          <div className="absolute bottom-3 right-3 rounded-full border border-[#efd8c8] bg-white/85 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#8e6b5b]">
            Map view
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[color:var(--primary)]">
            {displayName}
          </h2>
          <p className="text-sm text-[#8e6b5b]">
            {(detail?.cuisine || restaurant?.cuisine)} · {(detail?.price_range || restaurant?.price_range)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="warm">Rating {(detail?.rating ?? restaurant?.rating ?? 0).toFixed(1)}</Badge>
            <Badge variant="outline">{detail?.spiciness_level || restaurant?.spiciness_level} spice</Badge>
            {(restaurant?.diet_tags ?? []).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-[#ecd9cb] bg-white p-5">
        {detail?.description ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Description</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{detail.description}</p>
          </div>
        ) : null}
        {detail?.aggregate_comment ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Summary</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{detail.aggregate_comment}</p>
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Menu</p>
            {(detail?.menu_sample?.length || restaurant?.menu_sample?.length || 0) > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-[#6b4b3e]">
                {(detail?.menu_sample || restaurant?.menu_sample || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[#6b4b3e]">No menu sample available.</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Opening times</p>
            {hoursTable.length > 0 ? (
              <div className="mt-2 space-y-1 text-sm text-[#6b4b3e]">
                {hoursTable.map((row) => (
                  <div key={`${row.day}-${row.time}`} className="flex justify-between gap-3">
                    <span className="font-semibold text-[color:var(--primary)]">{row.day}</span>
                    <span className="text-right">{row.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[#6b4b3e]">No hours listed.</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Map</p>
          <div className="mt-2 h-32 rounded-2xl border border-dashed border-[#e6d2c3] bg-[#fff7ef]" />
        </div>
        {(sourceLink || mapsLink) ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Links</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sourceLink ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={sourceLink} target="_blank" rel="noreferrer">
                    View source
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="secondary" size="sm">
                <Link href={mapsLink} target="_blank" rel="noreferrer">
                  Reserve a table
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Reviews</p>
          <div className="mt-3 space-y-3">
            {(detail?.comments?.length || restaurant?.comments?.length || 0) === 0 ? (
              <p className="text-sm text-[#6b4b3e]">No reviews yet.</p>
            ) : (
              (detail?.comments || restaurant?.comments || []).map((comment) => (
                <div key={comment} className="rounded-2xl border border-[#f0ddd0] bg-[#fff7ef] p-3 text-sm text-[#6b4b3e]">
                  <p>{comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
        {detail?.source ? (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Source</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{detail.source}</p>
          </div>
        ) : null}
      </div>

        <Button asChild className="w-full" variant="secondary">
          <Link href="/results">Back to group results</Link>
        </Button>
      </div>
    </div>
  );
}
