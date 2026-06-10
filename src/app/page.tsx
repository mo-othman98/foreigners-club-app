import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative -mt-16 flex min-h-screen flex-col overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex flex-1 max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-teal-300/80">
          Foreigners Club
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Explore the world through the eyes of foreigners
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
          Real experiences, not travel guides
        </p>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/50">
          Discover what it actually feels like to live abroad — cultural
          insights, common mistakes, and honest perspectives from people who
          made a place their home.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/passport"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:bg-slate-100"
          >
            Start your travel journal
          </Link>
          <Link
            href="/map"
            className="rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Explore the world map
          </Link>
        </div>

        <div className="mt-16 grid max-w-2xl grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {[
            {
              title: "Place-based",
              desc: "Knowledge tied to countries and cities, not social feeds.",
            },
            {
              title: "Lived experience",
              desc: "What foreigners actually feel, not tourist highlights.",
            },
            {
              title: "Your identity",
              desc: "A travel journal of passport stamps collected across your life.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm"
            >
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
