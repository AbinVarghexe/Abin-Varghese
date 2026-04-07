"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { homePageDesignSystem } from "@/lib/home-page-design-system";
import { PinterestPin } from "@/lib/pinterest-content";

interface PinCardProps {
  pin: PinterestPin;
  href: string;
  compact?: boolean;
  fixedHeight?: number;
}

export default function PinCard({
  pin,
  href,
  compact = false,
  fixedHeight,
}: PinCardProps) {
  const design = homePageDesignSystem;
  const cardRadius = "14px";

  const [measuredMedia, setMeasuredMedia] = useState<{
    path: string;
    ratio: number;
  } | null>(null);

  const fallbackAspectRatio = useMemo(() => {
    const estimatedRatio = 320 / Math.max(pin.previewHeight, 1);
    return Math.min(1.8, Math.max(0.56, Number(estimatedRatio.toFixed(2))));
  }, [pin.previewHeight]);

  const activeMeasuredRatio =
    measuredMedia && measuredMedia.path === pin.mediaPath ? measuredMedia.ratio : null;

  const mediaStyle = fixedHeight
    ? { minHeight: fixedHeight }
    : { aspectRatio: activeMeasuredRatio ?? fallbackAspectRatio };

  return (
    <article className="mb-4 break-inside-avoid">
      <Link
        href={href}
        className="group block shadow-[0_18px_45px_-38px_rgba(0,0,0,0.62)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-36px_rgba(0,0,0,0.68)]"
        style={{
          background: design.colors.surface,
          border: `1px solid ${design.colors.border.card}`,
          borderRadius: cardRadius,
          boxShadow: design.shadows.card,
        }}
      >
        <div className="relative w-full overflow-hidden" style={{ ...mediaStyle, borderRadius: cardRadius }}>
          {pin.mediaType === "image" && (
            <Image
              src={pin.mediaPath}
              alt={pin.title}
              fill
              sizes={compact ? "(max-width: 1280px) 100vw, 20vw" : "(max-width: 1280px) 100vw, 30vw"}
              className="object-cover"
              onLoadingComplete={(image) => {
                if (!fixedHeight && image.naturalWidth && image.naturalHeight) {
                  setMeasuredMedia({
                    path: pin.mediaPath,
                    ratio: image.naturalWidth / image.naturalHeight,
                  });
                }
              }}
            />
          )}

          {pin.mediaType === "video" && (
            <video
              src={pin.mediaPath}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              onLoadedMetadata={(event) => {
                if (!fixedHeight && event.currentTarget.videoWidth && event.currentTarget.videoHeight) {
                  setMeasuredMedia({
                    path: pin.mediaPath,
                    ratio: event.currentTarget.videoWidth / event.currentTarget.videoHeight,
                  });
                }
              }}
            />
          )}

          {pin.mediaType === "model" && (
            <>
              <Image
                src={pin.mediaPath}
                alt={pin.title}
                fill
                sizes={compact ? "(max-width: 1280px) 100vw, 20vw" : "(max-width: 1280px) 100vw, 30vw"}
                className="object-cover"
                onLoadingComplete={(image) => {
                  if (!fixedHeight && image.naturalWidth && image.naturalHeight) {
                    setMeasuredMedia({
                      path: pin.mediaPath,
                      ratio: image.naturalWidth / image.naturalHeight,
                    });
                  }
                }}
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/65 via-black/15 to-transparent" />
              <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                3D Preview
              </div>
            </>
          )}

          <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute right-3 top-3 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg"
              style={{
                background: design.gradients.primaryAction,
                fontFamily: design.typography.families.sans,
              }}
            >
              Visit
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-4 pb-4 pt-12">
              <p
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90"
                style={{ fontFamily: design.typography.families.sans }}
              >
                {pin.board}
              </p>
              {!compact && (
                <p
                  className="mt-1 line-clamp-1 text-sm font-semibold text-white"
                  style={{ fontFamily: design.typography.families.sans }}
                >
                  Related to #{pin.tags[0] ?? "design"}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
