import { DietTag, MemberPreferences, Restaurant } from "@/lib/types";

function hasYes<T extends Record<string, string>>(record: T) {
  return Object.values(record).some((value) => value === "yes");
}

function shouldExclude<T extends Record<string, string>>(record: T, key: string) {
  if (record[key] === "no") return true;
  if (hasYes(record) && record[key] !== "yes") return true;
  return false;
}

export function filterRestaurants(restaurants: Restaurant[], prefs: MemberPreferences | null) {
  if (!prefs) return restaurants;
  return restaurants.filter((restaurant) => {
    if (shouldExclude(prefs.cuisine, restaurant.cuisine)) return false;
    if (shouldExclude(prefs.price, restaurant.price_range)) return false;
    if (shouldExclude(prefs.distance, restaurant.distance_level)) return false;
    if (shouldExclude(prefs.spice, restaurant.spiciness_level)) return false;

    const dietYes = Object.entries(prefs.diet).filter(([, value]) => value === "yes");
    const dietNo = Object.entries(prefs.diet).filter(([, value]) => value === "no");

    if (dietYes.length > 0) {
      const required = dietYes.map(([key]) => key as DietTag);
      const hasAll = required.every((tag) => restaurant.diet_tags.includes(tag));
      if (!hasAll) return false;
    }

    if (dietNo.length > 0) {
      const excluded = dietNo.map(([key]) => key as DietTag);
      const hasExcluded = excluded.some((tag) => restaurant.diet_tags.includes(tag));
      if (hasExcluded) return false;
    }

    return true;
  });
}
