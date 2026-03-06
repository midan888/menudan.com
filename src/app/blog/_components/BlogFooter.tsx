import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "qarta.app";

export function BlogFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-bold">
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-gray-700">
              Blog
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <span>
              &copy; {new Date().getFullYear()} {APP_NAME}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
