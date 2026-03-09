import { PLAN_LIMITS, type PlanType } from "@/lib/constants";
import { t } from "@/lib/translations";

const i18n = t();

interface MenuFooterProps {
  plan: string;
}

export function MenuFooter({ plan }: MenuFooterProps) {
  const planLimits = PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.free;

  if (planLimits.removeBranding) return null;

  return (
    <footer className="pb-8 pt-6 text-center">
      <a
        href="/"
        className="text-xs opacity-30 transition-opacity hover:opacity-50"
      >
        {i18n.menuFooter.poweredBy} {process.env.NEXT_PUBLIC_APP_NAME || "menudan.com"}
      </a>
    </footer>
  );
}
