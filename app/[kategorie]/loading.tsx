export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-primaryWhite pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-5 w-96 bg-gray-200 rounded" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 h-64" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
