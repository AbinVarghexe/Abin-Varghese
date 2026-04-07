import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PinCard from "@/components/pinterest/PinCard";
import { homeButtonTokens, homePageDesignSystem } from "@/lib/home-page-design-system";
import {
  getPinById,
  getRelatedPins,
  pinterestPins,
  type PinterestPin,
} from "@/lib/pinterest-content";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; workspace?: string }>;
}

export async function generateStaticParams() {
  return pinterestPins.map((pin) => ({ id: pin.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pin = getPinById(id);

  if (!pin) {
    return {
      title: "Pin Not Found | PinLab",
    };
  }

  return {
    title: `${pin.title} | PinLab`,
    description: pin.description,
  };
}

function PinHeroMedia({ pin }: { pin: PinterestPin }) {
  return (
    <div className="relative min-h-96 overflow-hidden rounded-4xl bg-zinc-200">
      {pin.mediaType === "image" && (
        <Image
          src={pin.mediaPath}
          alt={pin.title}
          fill
          sizes="(max-width: 1200px) 100vw, 68vw"
          className="object-cover"
        />
      )}

      {pin.mediaType === "video" && (
        <video
          src={pin.mediaPath}
          autoPlay
          muted
          loop
          controls
          playsInline
          className="h-full w-full object-cover"
        />
      )}

      {pin.mediaType === "model" && (
        <>
          <Image
            src={pin.mediaPath}
            alt={pin.title}
            fill
            sizes="(max-width: 1200px) 100vw, 68vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/15 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            3D Inspiration
          </div>
        </>
      )}
    </div>
  );
}

export default async function PinDetailsPage({ params, searchParams }: PageProps) {
  const design = homePageDesignSystem;
  const secondaryButton = homeButtonTokens("secondary");

  const { id } = await params;
  const { from, workspace } = await searchParams;
  const pin = getPinById(id);

  if (!pin) {
    notFound();
  }

  const related = getRelatedPins(pin, 18);
  const backHref =
    from === "projects" && workspace === "designing"
      ? "/projects?workspace=designing"
      : "/pinterest";
  const relatedHref = (pinId: string) =>
    from === "projects" && workspace === "designing"
      ? `/pinterest/${pinId}?from=projects&workspace=designing`
      : `/pinterest/${pinId}`;

  return (
    <main
      className="home-page-shell min-h-screen pb-14 pt-24 sm:pt-28"
      style={{ background: design.gradients.page }}
    >
      <div className="mx-auto w-[min(100%,1620px)] px-3 sm:px-5 lg:px-8">
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center px-4 py-2 text-sm font-semibold transition"
          style={{
            border: secondaryButton.border,
            borderRadius: secondaryButton.radius,
            background: secondaryButton.background,
            color: secondaryButton.text,
            fontFamily: design.typography.families.sans,
          }}
        >
          Back to Feed
        </Link>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <div>
            <PinHeroMedia pin={pin} />
          </div>

          <article
            className="space-y-5 rounded-3xl border p-5 sm:p-6"
            style={{
              background: design.colors.surfaceSoft,
              borderColor: design.colors.border.card,
              borderRadius: design.radius.card,
              boxShadow: design.shadows.subtle,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: design.colors.text.muted, fontFamily: design.typography.families.sans }}
            >
              {pin.board}
            </p>
            <h1
              className="text-3xl font-semibold sm:text-4xl"
              style={{ color: design.colors.text.primary, fontFamily: design.typography.families.sans }}
            >
              {pin.title}
            </h1>
            <p
              className="max-w-3xl text-sm leading-7 sm:text-base"
              style={{ color: design.colors.text.body, fontFamily: design.typography.families.sans }}
            >
              {pin.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {pin.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: design.colors.canvasSoft,
                    color: design.colors.text.secondary,
                    fontFamily: design.typography.families.sans,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div
              className="grid grid-cols-2 gap-3 p-4 text-sm"
              style={{
                borderRadius: design.radius.xl,
                background: design.colors.canvasSoft,
                color: design.colors.text.body,
                fontFamily: design.typography.families.sans,
              }}
            >
              <span className="font-medium" style={{ color: design.colors.text.muted }}>Creator</span>
              <span className="text-right font-semibold" style={{ color: design.colors.text.primary }}>{pin.author}</span>
              <span className="font-medium" style={{ color: design.colors.text.muted }}>Likes</span>
              <span className="text-right font-semibold" style={{ color: design.colors.text.primary }}>{pin.likes}</span>
              <span className="font-medium" style={{ color: design.colors.text.muted }}>Media</span>
              <span className="text-right font-semibold uppercase" style={{ color: design.colors.text.primary }}>{pin.mediaType}</span>
            </div>
          </article>
        </section>

        <section
          className="mt-10 border-t pt-6"
          style={{ borderColor: design.colors.border.subtle }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-lg font-semibold sm:text-xl"
              style={{ color: design.colors.text.primary, fontFamily: design.typography.families.sans }}
            >
              Related Pins
            </h2>
            <span
              className="text-xs font-medium uppercase tracking-[0.12em]"
              style={{ color: design.colors.text.muted, fontFamily: design.typography.families.sans }}
            >
              Inspired by this pin
            </span>
          </div>
          <div className="columns-2 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {related.map((relatedPin) => (
              <PinCard
                key={relatedPin.id}
                pin={relatedPin}
                href={relatedHref(relatedPin.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
