export default function MenuPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
      </div>
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No menus yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first menu.
        </p>
      </div>
    </div>
  );
}
