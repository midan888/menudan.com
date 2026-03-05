import Link from "next/link";

export function CallToAction({ text, href }: { text: string; href: string }) {
  return (
    <div className="my-8 rounded-xl bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-6 text-center">
      <Link
        href={href}
        className="inline-block rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110"
      >
        {text}
      </Link>
    </div>
  );
}
