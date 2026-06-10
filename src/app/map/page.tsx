import { Suspense } from "react";
import MapPageClient from "@/components/MapPageClient";

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      }
    >
      <MapPageClient />
    </Suspense>
  );
}
