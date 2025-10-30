/**
 * Loading UI for Blog Index Page
 * Displays skeleton loaders while blog posts are being fetched
 */
export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 p-4">
      {/* Header Skeleton */}
      <header className="mb-12">
        <div className="h-10 w-48 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="h-6 w-full max-w-3xl bg-gray-800 rounded animate-pulse" />
      </header>

      {/* Featured Post Skeleton */}
      <section className="mb-12">
        <div className="relative h-96 rounded-xl overflow-hidden bg-gray-800 animate-pulse" />
      </section>

      {/* Posts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden h-full">
                <div className="h-48 bg-gray-800 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Skeleton */}
        <section>
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="space-y-6 bg-card rounded-xl p-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-800 rounded animate-pulse" />
                <div className="h-5 w-4/5 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
