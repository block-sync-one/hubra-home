import { Marquee } from "@/components/ui/marquee";

export function NewsMarqueeSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <Marquee pauseOnHover className="[--duration:40s] [--gap:1rem]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="group relative block p-5 bg-card/80 rounded-xl w-[320px] shrink-0 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2.5">
                {/* Title skeleton - 2 lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700/50 rounded w-full" />
                  <div className="h-4 bg-gray-700/50 rounded w-4/5" />
                </div>

                {/* Source/date skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-gray-700/40 rounded w-20" />
                  <div className="h-3 w-1 bg-gray-700/40 rounded" />
                  <div className="h-3 bg-gray-700/40 rounded w-16" />
                </div>
              </div>

              {/* Icon skeleton */}
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-4 h-4 bg-gray-700/40 rounded" />
              </div>
            </div>
          </div>
        ))}
      </Marquee>
      {/* Gradient fade effects */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#0d0e21] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[#0d0e21] to-transparent" />
    </div>
  );
}
