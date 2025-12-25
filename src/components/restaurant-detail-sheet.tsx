import { Restaurant } from "@/lib/types";
import { getOtherFields } from "@/lib/restaurant-data";
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

export default function RestaurantDetailSheet({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant | null;
  onClose: () => void;
}) {
  if (!restaurant) return null;
  const hoursTable = buildHoursTable(restaurant.hours);
  const otherFields = getOtherFields(restaurant.raw);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
            {restaurant.name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {restaurant.description ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Description</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{restaurant.description}</p>
          </div>
        ) : null}

        {restaurant.aggregate_comment ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Summary</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{restaurant.aggregate_comment}</p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Hours</p>
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
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Menu sample</p>
            {restaurant.menu_sample.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-[#6b4b3e]">
                {restaurant.menu_sample.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[#6b4b3e]">No menu sample available.</p>
            )}
          </div>
        </div>

        {restaurant.photos.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Photos</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6b4b3e]">
              {restaurant.photos.map((photo) => (
                <span key={photo} className="rounded-full border border-[#e6d2c3] px-2 py-1">
                  {photo}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {restaurant.comments.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Comments</p>
            <ul className="mt-2 space-y-2 text-sm text-[#6b4b3e]">
              {restaurant.comments.map((comment) => (
                <li key={comment} className="rounded-2xl border border-[#f0ddd0] bg-[#fff7ef] p-3">
                  {comment}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {restaurant.spiciness_level ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Spiciness</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{restaurant.spiciness_level}</p>
          </div>
        ) : null}

        {restaurant.source ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Source</p>
            <p className="mt-2 text-sm text-[#6b4b3e]">{restaurant.source}</p>
          </div>
        ) : null}

        {otherFields.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8e6b5b]">Other</p>
            <div className="mt-2 space-y-1 text-sm text-[#6b4b3e]">
              {otherFields.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-3">
                  <span className="font-semibold text-[color:var(--primary)]">{key}</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
