import type { LocalSong } from "@/types/country";

export default function MusicSection({ songs }: { songs: LocalSong[] }) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
        Most Popular Local Songs
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Cultural flavor — what plays in cafés, taxis, and gatherings
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {songs.map((song, i) => (
          <div
            key={`${song.title}-${i}`}
            className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-teal-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white">
              {i + 1}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800">{song.title}</p>
              <p className="text-sm text-slate-500">{song.artist}</p>
              {song.note && (
                <p className="mt-1 text-xs text-teal-600">{song.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
