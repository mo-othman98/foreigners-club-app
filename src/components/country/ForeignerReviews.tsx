import type { ForeignerReview } from "@/types/country";

export default function ForeignerReviews({
  reviews,
  totalCount,
}: {
  reviews: ForeignerReview[];
  totalCount: number;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Foreigner Reviews
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {totalCount.toLocaleString()} lived-experience reviews
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review, i) => (
          <article
            key={i}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl" role="img" aria-hidden>
                {review.nationalityFlag}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {review.nationality}
                </p>
                <p className="text-xs text-slate-400">
                  Lived {review.yearsLived}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="text-teal-500">&ldquo;</span>
              {review.review}
              <span className="text-teal-500">&rdquo;</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
