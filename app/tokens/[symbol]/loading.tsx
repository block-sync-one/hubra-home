export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0d0e21]">
      {/* Header Navigation Skeleton */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-700 animate-pulse rounded" />
          <div className="h-4 w-4 bg-gray-700 animate-pulse rounded" />
          <div className="h-4 w-20 bg-gray-700 animate-pulse rounded" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Token Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 animate-pulse rounded-full" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-gray-700 animate-pulse rounded" />
                <div className="h-6 w-16 bg-gray-700 animate-pulse rounded" />
              </div>
            </div>

            <div className="flex gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-4 w-16 bg-gray-700 animate-pulse rounded mb-1" />
                  <div className="h-6 w-20 bg-gray-700 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart Skeleton */}
            <div className="bg-[#191a2c] border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="h-4 w-12 bg-gray-700 animate-pulse rounded mb-1" />
                  <div className="h-8 w-20 bg-gray-700 animate-pulse rounded" />
                </div>
                <div className="flex bg-white/5 rounded-xl p-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-12 bg-gray-700 animate-pulse rounded-lg mx-1" />
                  ))}
                </div>
              </div>
              <div className="h-48 bg-gray-800 animate-pulse rounded" />
            </div>

            {/* Volume Stats Skeleton */}
            <div className="bg-[#191a2c] border-white/10 rounded-2xl p-5">
              <div className="h-4 w-16 bg-gray-700 animate-pulse rounded mb-4" />
              <div className="space-y-6">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-16 bg-gray-700 animate-pulse rounded" />
                      <div className="h-4 w-20 bg-gray-700 animate-pulse rounded" />
                    </div>
                    <div className="h-1 bg-gray-700 animate-pulse rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 w-16 bg-gray-700 animate-pulse rounded" />
                      <div className="h-4 w-20 bg-gray-700 animate-pulse rounded" />
                    </div>
                    <div className="h-1 bg-gray-700 animate-pulse rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-4 w-20 bg-gray-700 animate-pulse rounded mb-1" />
                      <div className="h-4 w-32 bg-gray-700 animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            {/* Trading Section Skeleton */}
            <div className="bg-[#191a2c] border-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 animate-pulse rounded" />
                    <div className="h-6 w-20 bg-gray-700 animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-4 bg-gray-700 animate-pulse rounded" />
                </div>
                <div className="flex items-center justify-between p-6 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 animate-pulse rounded-full" />
                    <div className="h-6 w-12 bg-gray-700 animate-pulse rounded" />
                  </div>
                  <div className="h-6 w-8 bg-gray-700 animate-pulse rounded" />
                </div>
                <div className="h-12 w-full bg-gray-700 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-[#191a2c] border-white/10 rounded-2xl p-5">
              <div className="h-4 w-20 bg-gray-700 animate-pulse rounded mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-700 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-700 animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-gray-700 animate-pulse rounded" />
              </div>
              <div className="flex gap-4">
                <div className="h-5 w-5 bg-gray-700 animate-pulse rounded" />
                <div className="h-5 w-5 bg-gray-700 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
