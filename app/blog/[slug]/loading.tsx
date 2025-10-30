/**
 * Loading UI for Blog Post Page
 * Displays skeleton while post content is loading
 */
export default function BlogPostLoading() {
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 p-4">
      {/* Back Button Skeleton */}
      <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-8" />

      <article className="prose prose-invert max-w-none">
        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="h-12 w-3/4 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="h-12 w-1/2 bg-gray-800 rounded animate-pulse mb-6" />

          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-800 animate-pulse mb-8" />

          <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
            <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-4/6" />
            </div>
          ))}
        </div>

        {/* Footer Skeleton */}
        <footer className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-gray-800 rounded animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
              ))}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
