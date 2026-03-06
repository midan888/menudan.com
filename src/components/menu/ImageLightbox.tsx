"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface LightboxState {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
}

let openLightbox: ((state: LightboxState) => void) | null = null;

export function LightboxPortal() {
  const [image, setImage] = useState<LightboxState | null>(null);

  useEffect(() => {
    openLightbox = setImage;
    return () => {
      openLightbox = null;
    };
  }, []);

  const close = useCallback(() => setImage(null), []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [image, close]);

  if (!image) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        cursor: "zoom-out",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={close}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          maxHeight: "calc(100vh - 32px)",
          aspectRatio: "1",
        }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="480px"
          style={{ objectFit: "contain", borderRadius: 8 }}
          priority
        />
      </div>
      <button
        onClick={close}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

interface TappableDivProps {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TappableDiv({ src, alt, children, className, style }: TappableDivProps) {
  const handleTap = useCallback(() => {
    openLightbox?.({ src, alt });
  }, [src, alt]);

  return (
    <div
      className={className}
      style={{ ...style, cursor: "zoom-in" }}
      onClick={handleTap}
    >
      {children}
    </div>
  );
}

export function TappableImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  sizes,
}: ImageLightboxProps) {
  const handleTap = useCallback(() => {
    openLightbox?.({ src, alt });
  }, [src, alt]);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ ...style, cursor: "zoom-in" }}
      sizes={sizes}
      onClick={handleTap}
    />
  );
}
