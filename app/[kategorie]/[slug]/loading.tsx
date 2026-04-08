export default function GuideArticleLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <section className="pt-24 md:pt-32 pb-10 md:pb-14 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 animate-pulse">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
          {/* Badges */}
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          {/* Title */}
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4" />
          {/* Excerpt */}
          <div className="h-5 w-full bg-gray-200 rounded mb-2" />
          <div className="h-5 w-2/3 bg-gray-200 rounded mb-6" />
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
      {/* Content skeleton */}
      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
            {/* Main content */}
            <div className="space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-1/2 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
