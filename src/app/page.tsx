import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            {process.env.NEXT_PUBLIC_APP_NAME || "MenuForYou"}
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Your restaurant menu,
          <br />
          online in 5 minutes
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Upload a photo of your paper menu — AI extracts items automatically.
          Choose a beautiful theme, get a QR code, and you&apos;re live.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800"
          >
            Create Your Menu — Free
          </Link>
        </div>
      </main>
    </div>
  );
}
