"use client";

import { useState } from "react";
import type { SurvivalGuideItem } from "@/types/country";

export default function CulturalSurvivalGuide({
  items,
}: {
  items: SurvivalGuideItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">
        Cultural Survival Guide
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Before you arrive — what foreigners wish they knew
      </p>
      <div className="space-y-2">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.title}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-slate-800">{item.title}</span>
                <span
                  className={`ml-4 shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
