import type { Metadata } from "next";
import ScrapbookHero from "@/components/about/ScrapbookHero";
import DeskBookSection from "@/components/about/DeskBookSection";
import TypewriterSection from "@/components/about/TypewriterSection";
import { getAboutContent } from "@/lib/site-content";
import { getSiteCopyContent } from "@/lib/site-copy-content";
import { createPageMetadata } from "@/seo/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About Me | Abin Varghese",
  description:
    "Learn about Abin Varghese's journey, education, and experience as a front-end developer and UI/UX designer. Discover skills, achievements, and background.",
  path: "/about",
});

export default async function AboutPage() {
  const aboutContent = await getAboutContent();
  const siteCopy = await getSiteCopyContent();

  return (
    <main
      id="about-page-audio-root"
      className="relative min-h-screen overflow-hidden bg-[#f4f1eb]"
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.06\'/%3E%3C/svg%3E")', backgroundSize: '100px 100px' }}
    >
      <ScrapbookHero
        content={aboutContent}
        copy={{
          aboutStickyNote: siteCopy.aboutStickyNote,
          aboutLowerRightNote: siteCopy.aboutLowerRightNote,
          aboutFooterTag: siteCopy.aboutFooterTag,
        }}
      />
      <DeskBookSection
        copy={{
          aboutIntroTitle: siteCopy.aboutIntroTitle,
          aboutIntroBody: siteCopy.aboutIntroBody,
          aboutBookImage: siteCopy.aboutBookImage,
          aboutTimelineTitle: siteCopy.aboutTimelineTitle,
          aboutTimelineEntries: siteCopy.aboutTimelineEntries,
        }}
      />
      <div className="relative z-20 -mt-28">
        <TypewriterSection quote={siteCopy.aboutTypewriterQuote} />
      </div>
    </main>
  );
}
