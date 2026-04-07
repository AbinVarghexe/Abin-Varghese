import type { Metadata } from "next";
import Image from "next/image";
import PinCard from "@/components/pinterest/PinCard";
import { homePageDesignSystem } from "@/lib/home-page-design-system";
import { pinterestPins } from "@/lib/pinterest-content";

export const metadata: Metadata = {
  title: "Pinterest Clone | Abin",
  description:
    "Pinterest-inspired board experience featuring images, videos, and 3D concepts in a masonry feed.",
};

const boardTags: Array<{ label: string; preview: string }> = [
  { label: "Creative", preview: "/about/Abin_1.png" },
  { label: "Inspiration", preview: "/about/Abin_2.png" },
  { label: "Creative ideas", preview: "/projects/blog-cms.jpg" },
  { label: "Inspiration portfolio", preview: "/projects/ecommerce.jpg" },
  { label: "Ideas", preview: "/projects/task-app.jpg" },
  { label: "Inspiration layout", preview: "/about/Abin_3.png" },
  { label: "Layout", preview: "/about/keyboard-realistic.png" },
  { label: "Modern", preview: "/mockups/hand_held_phone.png" },
  { label: "Inspo", preview: "/projects/weather.jpg" },
];

export default function PinterestClonePage() {
  const design = homePageDesignSystem;

  return (
    <main
      className="home-page-shell min-h-screen pb-16 pt-8"
      style={{
        background: design.gradients.page,
        color: design.colors.text.primary,
      }}
    >
      <div className="mx-auto w-[min(100%,1660px)] px-3 pb-6 pt-4 sm:px-4 lg:px-6">
        <section>
          <div className="mb-4 px-1">
            <h2
              className="text-xl font-semibold tracking-tight sm:text-2xl"
              style={{
                color: design.colors.text.primary,
                fontFamily: design.typography.families.sans,
              }}
            >
              Curated Design Boards
            </h2>
            <p
              className="mt-1 text-sm"
              style={{
                color: design.colors.text.body,
                fontFamily: design.typography.families.sans,
              }}
            >
              Explore UI/UX, web, graphic, and visual inspirations from the current board set.
            </p>
          </div>

          <div
            className="rounded-2xl border px-3 py-3 sm:px-4"
            style={{
              borderColor: design.colors.border.card,
              background: design.colors.surface,
              boxShadow: design.shadows.subtle,
              borderRadius: design.radius.card,
            }}
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {boardTags.map((tag, index) => {
                return (
                  <button
                    key={tag.label}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border px-2 py-1 pr-4 text-sm font-semibold transition"
                    style={{
                      borderColor: design.colors.border.subtle,
                      background: index === 1 ? design.gradients.primaryAction : design.colors.surfaceSoft,
                      color: index === 1 ? "#ffffff" : design.colors.text.secondary,
                      fontFamily: design.typography.families.sans,
                    }}
                  >
                    <span className="relative h-7 w-10 overflow-hidden rounded-lg border border-black/10 bg-white/50">
                      <Image src={tag.preview} alt={tag.label} fill sizes="28px" className="object-cover" />
                    </span>
                    <span className="whitespace-nowrap">{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="mt-4 rounded-2xl border px-3 py-4 sm:px-4"
            style={{
              borderColor: design.colors.border.card,
              background: design.colors.surface,
              boxShadow: design.shadows.subtle,
              borderRadius: design.radius.card,
            }}
          >
            <div className="columns-2 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {pinterestPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} href={`/pinterest/${pin.id}`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
