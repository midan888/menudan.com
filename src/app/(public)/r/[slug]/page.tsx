export default function PublicMenuPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Menu</h1>
        <p className="mt-2 text-gray-600">
          Public menu page for &quot;{params.slug}&quot; will be built in Phase 3.
        </p>
      </div>
    </div>
  );
}
