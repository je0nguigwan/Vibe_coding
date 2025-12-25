import type { ReactNode } from "react";
import {
  CUISINES,
  DIET_TAGS,
  DISTANCE_LEVELS,
  MemberPreferences,
  PRICE_RANGES,
  SPICE_LEVELS,
  PreferenceChoice,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

const choiceOrder: PreferenceChoice[] = ["neutral", "yes", "no"];
const cuisinePrimary = CUISINES.slice(0, 6);
const cuisineSecondary = CUISINES.slice(6);

function cycleChoice(value: PreferenceChoice) {
  if (value === "neutral") return "yes";
  if (value === "yes") return "no";
  return "neutral";
}

function ChoiceButton({
  label,
  active,
  onClick,
  tone,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone: "yes" | "neutral" | "no";
}) {
  const toneClasses =
    tone === "yes"
      ? "border-[color:var(--success)] bg-[color:var(--success)] text-white"
      : tone === "no"
        ? "border-[color:var(--danger)] bg-[color:var(--danger)] text-white"
        : "border-[#e6d2c3] bg-white text-[#8e6b5b]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none rounded-full border px-3 py-1 text-xs font-semibold transition active:scale-[0.98]",
        active ? "shadow-[0_6px_12px_rgba(135,53,53,0.16)]" : "opacity-70",
        toneClasses
      )}
    >
      {label}
    </button>
  );
}

function OptionRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PreferenceChoice;
  onChange: (choice: PreferenceChoice) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      <div className="flex items-center gap-2">
        {choiceOrder.map((choice) => (
          <ChoiceButton
            key={choice}
            label={choice === "yes" ? "Yes" : choice === "no" ? "No" : "Neutral"}
            active={choice === value}
            tone={choice === "yes" ? "yes" : choice === "no" ? "no" : "neutral"}
            onClick={() => onChange(choice)}
          />
        ))}
      </div>
    </div>
  );
}

function ChipToggle({
  label,
  value,
  onToggle,
  icon,
}: {
  label: string;
  value: PreferenceChoice;
  onToggle: () => void;
  icon?: ReactNode;
}) {
  const classes =
    value === "yes"
      ? "border-[color:var(--success)] bg-[color:var(--success)] text-white"
      : value === "no"
        ? "border-[color:var(--danger)] bg-[color:var(--danger)] text-white"
        : "border-[#e6d2c3] bg-white text-[#8e6b5b]";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-semibold transition active:scale-[0.98]",
        classes
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </button>
  );
}

export default function PreferenceForm({
  value,
  onChange,
}: {
  value: MemberPreferences;
  onChange: (prefs: MemberPreferences) => void;
}) {
  function updateCategory<T extends keyof MemberPreferences>(
    category: T,
    key: keyof MemberPreferences[T],
    choice: PreferenceChoice
  ) {
    onChange({
      ...value,
      [category]: {
        ...value[category],
        [key]: choice,
      },
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
            Cuisine
          </h3>
          <p className="text-xs text-[#8e6b5b]">Tap to cycle</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {cuisinePrimary.map((item) => (
            <ChipToggle
              key={item}
              label={item}
              value={value.cuisine[item]}
              onToggle={() => updateCategory("cuisine", item, cycleChoice(value.cuisine[item]))}
            />
          ))}
        </div>
        {cuisineSecondary.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {cuisineSecondary.map((item) => (
              <ChipToggle
                key={item}
                label={item}
                value={value.cuisine[item]}
                onToggle={() => updateCategory("cuisine", item, cycleChoice(value.cuisine[item]))}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
          Budget
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRICE_RANGES.map((item) => (
            <ChipToggle
              key={item}
              label={item}
              value={value.price[item]}
              onToggle={() => updateCategory("price", item, cycleChoice(value.price[item]))}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
          Distance
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {DISTANCE_LEVELS.map((item) => (
            <ChipToggle
              key={item}
              label={item === "near" ? "Near" : item === "medium" ? "Medium" : "Far"}
              value={value.distance[item]}
              onToggle={() => updateCategory("distance", item, cycleChoice(value.distance[item]))}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
          Spice
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SPICE_LEVELS.map((item, index) => (
            <ChipToggle
              key={item}
              label={item === "mild" ? "Mild" : item === "medium" ? "Medium" : "Hot"}
              value={value.spice[item]}
              onToggle={() => updateCategory("spice", item, cycleChoice(value.spice[item]))}
              icon={<Flame className={cn("h-4 w-4", index === 1 && "opacity-80", index === 2 && "opacity-100")} />}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#ecd9cb] bg-white p-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[color:var(--primary)]">
          Diet
        </h3>
        <div className="mt-3 space-y-3">
          {DIET_TAGS.map((item) => (
            <OptionRow
              key={item}
              label={item.replace("-", " ")}
              value={value.diet[item]}
              onChange={(choice) => updateCategory("diet", item, choice)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
