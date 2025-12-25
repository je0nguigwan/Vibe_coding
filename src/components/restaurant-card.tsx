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
}: {
  restaurant: Restaurant;
  compact?: boolean;
  onSeeMore?: () => void;
}) {
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
        {restaurant.photos[0] ? (
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
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#fdf0e8] px-2 py-1 text-sm font-semibold text-[color:var(--primary)]">
            <Star className="h-4 w-4" />
            {restaurant.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
            {descriptionItems.length > 0 ? (
            <ol className="mt-1 space-y-0.5 text-[11px] text-[#8e6b5b]">
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
              className="mt-1 rounded-xl border border-[#edd9cc] bg-[#fff6f0] px-3 py-1.5 text-center text-[11px] text-[#8e6b5b] leading-tight"
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
            <p className="mt-1 text-[11px] text-[#8e6b5b] leading-tight">
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
