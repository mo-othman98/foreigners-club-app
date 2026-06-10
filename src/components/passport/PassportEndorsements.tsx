import type { PassportEndorsement } from "@/types/passport";

export default function PassportEndorsements({
  endorsements,
}: {
  endorsements: PassportEndorsement[];
}) {
  const collected = endorsements.filter((e) => e.collected);

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
        Passport Endorsements
      </h3>
      <p className="mb-4 text-xs text-slate-500">
        {collected.length} of {endorsements.length} collected — official marks
        of a life in motion
      </p>

      <div className="space-y-2">
        {endorsements.map((endorsement) => (
          <div
            key={endorsement.id}
            className={`rounded-xl border px-4 py-3 transition ${
              endorsement.collected
                ? "border-amber-200/80 bg-gradient-to-r from-amber-50/80 to-white shadow-sm"
                : "border-slate-100 bg-slate-50/50 opacity-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  endorsement.collected
                    ? "bg-amber-500 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {endorsement.collected ? "✓" : "·"}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    endorsement.collected ? "text-amber-900" : "text-slate-500"
                  }`}
                >
                  {endorsement.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {endorsement.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
