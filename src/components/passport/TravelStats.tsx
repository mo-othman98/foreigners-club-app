import type { TravelStats as Stats } from "@/types/passport";

const STAT_ITEMS: Array<{
  key: keyof Stats;
  label: string;
  suffix?: string;
}> = [
  { key: "countriesVisited", label: "Countries Visited" },
  { key: "countriesLivedIn", label: "Countries Lived In" },
  { key: "heritageConnections", label: "Heritage Connections" },
  { key: "daysAbroad", label: "Days Abroad" },
  { key: "continentsExplored", label: "Continents Explored" },
  { key: "passportCompletion", label: "Passport Completion", suffix: "%" },
];

export default function TravelStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {STAT_ITEMS.map(({ key, label, suffix }) => (
        <div
          key={key}
          className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
        >
          <p className="text-2xl font-bold tabular-nums text-slate-900">
            {stats[key].toLocaleString()}
            {suffix ?? ""}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
