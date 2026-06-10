export default function RealityCheckSection({
  statements,
}: {
  statements: string[];
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
        Reality Check
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Honest statements from foreigners who stayed past the honeymoon phase
      </p>
      <div className="space-y-3">
        {statements.map((statement, i) => (
          <blockquote
            key={i}
            className="relative rounded-2xl border border-slate-200/80 bg-white px-5 py-4 pl-8 text-sm leading-relaxed text-slate-700 shadow-sm"
          >
            <span
              className="absolute left-4 top-4 text-2xl leading-none text-teal-300"
              aria-hidden
            >
              &ldquo;
            </span>
            {statement}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
