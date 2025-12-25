export const CUISINES = [
  "Japanese",
  "Korean",
  "Chinese",
  "Thai",
  "Vietnamese",
  "Indian",
  "Italian",
  "Mexican",
  "Mediterranean",
  "American",
  "Cafe",
  "Seafood",
] as const;

export const PRICE_RANGES = ["$", "$$", "$$$"] as const;

export const DISTANCE_LEVELS = ["near", "medium", "far"] as const;

export const SPICE_LEVELS = ["mild", "medium", "hot"] as const;

export const DIET_TAGS = ["vegetarian", "vegan", "halal", "gluten-free"] as const;

export type Cuisine = (typeof CUISINES)[number];
export type PriceRange = (typeof PRICE_RANGES)[number];
export type DistanceLevel = (typeof DISTANCE_LEVELS)[number];
export type SpiceLevel = (typeof SPICE_LEVELS)[number];
export type DietTag = (typeof DIET_TAGS)[number];
export type PreferenceChoice = "yes" | "no" | "neutral";

export type Restaurant = {
  id: string;
  name: string;
  rating: number;
  price_range: PriceRange;
  cuisine: Cuisine;
  hours: string[] | string;
  photos: string[];
  comments: string[];
  menu_sample: string[];
  spiciness_level: SpiceLevel;
  source: string;
  distance_level: DistanceLevel;
  diet_tags: DietTag[];
  description?: string;
  aggregate_comment?: string;
  raw?: Record<string, unknown>;
};

export type Member = {
  id: string;
  name: string;
  joinedAt: string;
};

export type MemberPreferences = {
  cuisine: Record<Cuisine, PreferenceChoice>;
  price: Record<PriceRange, PreferenceChoice>;
  distance: Record<DistanceLevel, PreferenceChoice>;
  spice: Record<SpiceLevel, PreferenceChoice>;
  diet: Record<DietTag, PreferenceChoice>;
};

export type SwipeValue = "like" | "dislike" | "neutral";

export type SwipeMap = Record<string, SwipeValue>;

export type SessionState = {
  code: string;
  name: string;
  createdAt: string;
  members: Member[];
  preferences: Record<string, MemberPreferences>;
  swipes: Record<string, SwipeMap>;
  messages: ChatMessage[];
  directMessages: Record<string, ChatMessage[]>;
};

export type ChatMessage = {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  createdAt: string;
};

export type RestaurantScore = {
  restaurant: Restaurant;
  likeCount: number;
  dislikeCount: number;
  score: number;
  likedBy: string[];
};
