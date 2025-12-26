import {
  CUISINES,
  DIET_TAGS,
  DISTANCE_LEVELS,
  MemberPreferences,
  PRICE_RANGES,
  SPICE_LEVELS,
  PreferenceChoice,
} from "@/lib/types";

function neutralRecord<T extends readonly string[]>(items: T) {
  return items.reduce((acc, item) => {
    acc[item as T[number]] = "neutral";
    return acc;
  }, {} as Record<T[number], PreferenceChoice>);
}

export function createDefaultPreferences(): MemberPreferences {
  return {
    cuisine: neutralRecord(CUISINES),
    price: neutralRecord(PRICE_RANGES),
    distance: neutralRecord(DISTANCE_LEVELS),
    spice: neutralRecord(SPICE_LEVELS),
    diet: neutralRecord(DIET_TAGS),
  };
}

const MEMBER_LABELS = [
  "User A",
  "User B",
  "User C",
  "User D",
  "User E",
  "User F",
];

export function getNextMemberName(count: number) {
  return MEMBER_LABELS[count] ?? `User ${count + 1}`;
}
