import { Cuisine, Restaurant } from "@/lib/types";
import imageMapData from "@/data/restaurant-images.json";

export type RawRestaurant = Record<string, unknown>;
export type HappyRestaurantRaw = {
  name: string;
  rating: string | number;
  price_range: string;
  cuisine?: string;
  hours?: string[];
  photos?: string[];
  comments?: string[];
  menu_sample?: string[];
  spiciness_level?: string | number;
  source?: string;
};

const KNOWN_KEYS = new Set([
  "name",
  "rating",
  "price_range",
  "cuisine",
  "aggregate_comment",
  "description",
  "hours",
  "photos",
  "comments",
  "menu_sample",
  "spiciness_level",
  "source",
]);

const imageMap = imageMapData as Record<string, string>;

function buildImageKey(name: string) {
  const noDiacritics = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return noDiacritics.trim().replace(/[\/\s]+/g, "_");
}

export function getRestaurantImagePath(name: string) {
  return imageMap[buildImageKey(name)] ?? "";
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeComments(value: unknown) {
  if (!Array.isArray(value)) return [] as string[];
  return value
    .map((entry) => {
      if (Array.isArray(entry) && entry.length >= 2) {
        return `${entry[0]}: ${entry[1]}`.trim();
      }
      if (typeof entry === "string") return entry.trim();
      return "";
    })
    .filter(Boolean);
}

function normalizeSpice(value: unknown) {
  if (value === 3 || value === "3") return "hot";
  if (value === 2 || value === "2") return "medium";
  return "mild";
}

function normalizeHoursList(hoursList: string[] | undefined) {
  if (!hoursList || hoursList.length === 0) return [];
  return hoursList
    .map((entry) => entry.replace("Open now", "").replace("Closed now", "").trim())
    .filter(Boolean);
}

export function normalizeRestaurant(raw: RawRestaurant, id: number): Restaurant {
  const name = normalizeString(raw.name) || `Restaurant ${id}`;
  const ratingRaw = typeof raw.rating === "number" ? raw.rating : Number(raw.rating);
  const rating = Number.isFinite(ratingRaw) ? ratingRaw : 0;
  const priceRange = normalizeString(raw.price_range) || "$";
  const cuisine = (normalizeString(raw.cuisine) || "Cafe") as Cuisine;
  const hours = normalizeStringArray(raw.hours);
  const photos = normalizeStringArray(raw.photos);
  const menuSample = normalizeStringArray(raw.menu_sample);
  const description = normalizeString(raw.description);
  const aggregateComment = normalizeString(raw.aggregate_comment);
  const source = normalizeString(raw.source);
  const comments = normalizeComments(raw.comments);

  const imagePath = photos.length > 0 ? "" : getRestaurantImagePath(name);
  return {
    id: `d${id}`,
    name,
    rating,
    price_range: priceRange as Restaurant["price_range"],
    cuisine,
    hours,
    photos: photos.length > 0 ? photos : imagePath ? [imagePath] : [],
    comments,
    menu_sample: menuSample,
    spiciness_level: normalizeSpice(raw.spiciness_level),
    source,
    distance_level: priceRange === "$" ? "near" : priceRange === "$$" ? "medium" : "far",
    diet_tags: [],
    description,
    aggregate_comment: aggregateComment,
    raw,
  };
}

export function normalizeHappyRestaurant(raw: HappyRestaurantRaw, id: number): Restaurant {
  const rating = typeof raw.rating === "number" ? raw.rating : Number(raw.rating) || 0;
  const cuisine = (raw.cuisine || "Thai").trim();
  const priceRange = raw.price_range || "$";
  const imagePath = getRestaurantImagePath(raw.name);
  return {
    id: `h${id}`,
    name: raw.name,
    rating,
    price_range: priceRange as Restaurant["price_range"],
    cuisine: cuisine as Cuisine,
    hours: normalizeHoursList(raw.hours),
    photos: raw.photos && raw.photos.length > 0 ? raw.photos : imagePath ? [imagePath] : [],
    comments: raw.comments || [],
    menu_sample: raw.menu_sample || [],
    spiciness_level: normalizeSpice(raw.spiciness_level),
    source: raw.source || "",
    distance_level: priceRange === "$" ? "near" : priceRange === "$$" ? "medium" : "far",
    diet_tags: [],
  };
}

export function getOtherFields(raw?: RawRestaurant) {
  if (!raw) return [];
  return Object.entries(raw)
    .filter(([key]) => !KNOWN_KEYS.has(key))
    .map(([key, value]) => {
      if (Array.isArray(value)) return [key, value.filter(Boolean).join(", ")];
      if (value && typeof value === "object") return [key, JSON.stringify(value)];
      return [key, String(value ?? "")];
    })
    .filter(([, value]) => value.trim().length > 0);
}
