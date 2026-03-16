import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-sm" },
  md: { icon: 28, text: "text-lg" },
  lg: { icon: 32, text: "text-xl" },
};

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "menudan";

export function Logo({ href = "/", size = "md", showText = true, className = "" }: LogoProps) {
  const s = sizes[size];

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo-icon.svg"
        alt={APP_NAME}
        width={s.icon}
        height={s.icon}
        className="shrink-0"
        priority
      />
      {showText && (
        <span className={`${s.text} font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent`}>
          {APP_NAME}
        </span>
      )}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
