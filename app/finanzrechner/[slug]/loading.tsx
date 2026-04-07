export default function CalculatorLoading() {
  return (
    <div className="min-h-screen bg-primaryWhite pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-10 w-2/3 bg-gray-200 rounded" />
          <div className="h-5 w-1/2 bg-gray-200 rounded" />
          <div className="bg-gray-100 rounded-2xl h-96 mt-8" />
        </div>
      </div>
    </div>
  );
}
