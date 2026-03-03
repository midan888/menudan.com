import { MenuTable } from '@/components/admin/MenuTable';

export default function AdminMenusPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menus</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all created menus and their public links.
        </p>
      </div>
      <MenuTable />
    </div>
  );
}
