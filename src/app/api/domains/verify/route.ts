import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { resolve } from "dns/promises";

// POST /api/domains/verify — verify DNS for custom domain (authenticated)
export async function POST() {
  try {
    const tenant = await requireTenant();

    if (!tenant.customDomain) {
      return NextResponse.json(
        { error: "No custom domain configured" },
        { status: 400 }
      );
    }

    if (tenant.domainVerified) {
      return NextResponse.json({
        verified: true,
        domain: tenant.customDomain,
      });
    }

    // Check DNS resolution
    const isValid = await checkDNS(tenant.customDomain);

    if (isValid) {
      await db
        .update(tenants)
        .set({ domainVerified: true, updatedAt: new Date() })
        .where(eq(tenants.id, tenant.id));

      return NextResponse.json({
        verified: true,
        domain: tenant.customDomain,
      });
    }

    return NextResponse.json({
      verified: false,
      domain: tenant.customDomain,
      message:
        "DNS record not found yet. It can take up to 48 hours to propagate. Make sure you have a CNAME record pointing to our server.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NO_TENANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/domains/verify?domain=x — Caddy on-demand TLS ask endpoint (public)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return new NextResponse(null, { status: 400 });
  }

  // Check if this domain is registered and verified in our database
  const tenant = await db.query.tenants.findFirst({
    where: and(
      eq(tenants.customDomain, domain),
      eq(tenants.domainVerified, true)
    ),
  });

  if (tenant) {
    // Domain is valid — allow Caddy to provision TLS
    return new NextResponse(null, { status: 200 });
  }

  // Domain not found or not verified — reject
  return new NextResponse(null, { status: 404 });
}

async function checkDNS(domain: string): Promise<boolean> {
  const appHost = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
    : null;

  try {
    // Check CNAME records
    const cnames = await resolve(domain, "CNAME");
    if (appHost && cnames.some((cname) => cname.replace(/\.$/, "") === appHost)) {
      return true;
    }
  } catch {
    // CNAME lookup failed, try A record
  }

  try {
    // Check A records — resolve both the custom domain and our domain
    const [customIPs, ourIPs] = await Promise.all([
      resolve(domain, "A"),
      appHost ? resolve(appHost, "A") : Promise.resolve([]),
    ]);

    // Check if any IP matches
    if (customIPs.some((ip) => ourIPs.includes(ip))) {
      return true;
    }
  } catch {
    // A record lookup failed
  }

  return false;
}
