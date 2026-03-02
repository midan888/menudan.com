import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MobileNav } from "@/components/dashboard/MobileNav";

const navItems = [
  { href: "/menu", label: "Menu", icon: "M4 6h16M4 12h16M4 18h16" },
  { href: "/qr", label: "QR Codes", icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" },
  { href: "/upload", label: "AI Upload", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/languages", label: "Languages", icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" },
  { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/billing", label: "Billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user has a tenant, redirect to onboarding if not
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.ownerId, session.user.id!),
  });

  if (!tenant) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/menu" className="text-lg font-bold text-gray-900">
            {process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev"}
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-64 border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200" />
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-gray-900">
                {session.user.name || session.user.email}
              </p>
              <p className="truncate text-xs text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header + Main content */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <Link href="/menu" className="text-lg font-bold text-gray-900">
            {process.env.NEXT_PUBLIC_APP_NAME || "qarta.dev"}
          </Link>
          <MobileNav items={navItems} />
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
