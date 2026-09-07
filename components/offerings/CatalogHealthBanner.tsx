export default function CatalogHealthBanner() {
  return (
    <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 flex items-center justify-between shadow-lg">
      {/* Left: Icon and Text */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Catalog Health: Optimized
          </h3>
          <p className="text-sm text-gray-300 max-w-2xl">
            Your inventory margins are currently averaging 54.8%. We've identified 12 items with low stock
            that require immediate attention.
          </p>
        </div>
      </div>

      {/* Right: Button */}
      <div className="flex-shrink-0">
        <button className="bg-white text-gray-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-md">
          Review Inventory
        </button>
      </div>
    </div>
  );
}
