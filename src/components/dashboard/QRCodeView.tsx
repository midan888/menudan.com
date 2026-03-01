"use client";

import { useState, useEffect, useRef } from "react";

interface QRCodeViewProps {
  menuUrl: string;
  slug: string;
}

export function QRCodeView({ menuUrl, slug }: QRCodeViewProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamically import qrcode to generate preview client-side
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(menuUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#000000", light: "#FFFFFF" },
      }).then((url: string) => {
        setQrDataUrl(url);
        setLoading(false);
      });
    });
  }, [menuUrl]);

  function downloadPNG() {
    window.open(`/api/qr?format=png&size=1024`, "_blank");
  }

  function downloadSVG() {
    window.open(`/api/qr?format=svg&size=1024`, "_blank");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
      <p className="mt-2 text-sm text-gray-500">
        Print this QR code and place it on tables for guests to scan.
      </p>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        {/* QR Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {loading ? (
            <div className="flex h-64 w-64 items-center justify-center">
              <svg
                className="h-8 w-8 animate-spin text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <img
              src={qrDataUrl || ""}
              alt="QR Code"
              className="h-64 w-64"
            />
          )}
          <p className="mt-4 text-center text-xs text-gray-400">
            Scan to view menu
          </p>
        </div>

        {/* Info + Download buttons */}
        <div className="flex-1 space-y-6">
          {/* Menu URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Menu URL
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={menuUrl}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              />
              <button
                onClick={() => navigator.clipboard.writeText(menuUrl)}
                className="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Download options */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Download
            </label>
            <div className="mt-2 flex gap-3">
              <button
                onClick={downloadPNG}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PNG (1024px)
              </button>
              <button
                onClick={downloadSVG}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                SVG (Vector)
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-900">Tips</h3>
            <ul className="mt-2 space-y-1 text-xs text-gray-500">
              <li>Use PNG for printing on paper or stickers</li>
              <li>Use SVG for professional printing at any size</li>
              <li>Place QR codes on each table, at the entrance, or in the window</li>
              <li>Test by scanning with your phone before printing</li>
            </ul>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
