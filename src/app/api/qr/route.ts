import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/tenant";
import QRCode from "qrcode";

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "png";
    const size = Math.min(Number(searchParams.get("size") || "1024"), 2048);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const menuUrl = tenant.customDomain && tenant.domainVerified
      ? `https://${tenant.customDomain}`
      : `${baseUrl}/r/${tenant.slug}`;

    if (format === "svg") {
      const svg = await QRCode.toString(menuUrl, {
        type: "svg",
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="qr-${tenant.slug}.svg"`,
        },
      });
    }

    // PNG format
    const buffer = await QRCode.toBuffer(menuUrl, {
      type: "png",
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="qr-${tenant.slug}.png"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
