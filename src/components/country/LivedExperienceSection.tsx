export default function LivedExperienceSection({
  loves,
  challenges,
}: {
  loves: string[];
  challenges: string[];
}) {
  return (
    <section>
      <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-900">
        Lived Experience
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          title="What Foreigners Love"
          items={loves}
          accent="teal"
          icon="♥"
        />
        <Card
          title="Biggest Challenges"
          items={challenges}
          accent="amber"
          icon="!"
        />
      </div>
    </section>
  );
}

function Card({
  title,
  items,
  accent,
  icon,
}: {
  title: string;
  items: string[];
  accent: "teal" | "amber";
  icon: string;
}) {
  const styles = {
    teal: {
      border: "border-teal-100",
      bg: "bg-teal-50/50",
      dot: "bg-teal-500",
      title: "text-teal-800",
    },
    amber: {
      border: "border-amber-100",
      bg: "bg-amber-50/50",
      dot: "bg-amber-500",
      title: "text-amber-800",
    },
  }[accent];

  return (
    <div
      className={`rounded-2xl border ${styles.border} ${styles.bg} p-5 shadow-sm`}
    >
      <h3
        className={`mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest ${styles.title}`}
      >
        <span className="text-base">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
