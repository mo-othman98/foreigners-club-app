import { Suspense } from "react";
import ExplorePageClient from "@/components/ExplorePageClient";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      }
    >
      <ExplorePageClient />
    </Suspense>
  );
}
