import Image from "next/image";
import Link from "next/link";
import AboutHeroMusic from "@/components/about/AboutHeroMusic";

import type { AboutContent } from "@/lib/about-content-defaults";

type ScrapbookHeroProps = {
  content: AboutContent;
};

type SideImageCard = {
  imageUrl: string;
  href: string;
  alt: string;
  className: string;
  aspectClassName: string;
  imageClassName: string;
  pinClassName: string;
};

function SideImage({ imageUrl, href, alt, className, aspectClassName, imageClassName, pinClassName }: SideImageCard) {
  const content = (
    <>
      <div className={pinClassName}>
        <div className="absolute top-[3px] left-[3px] w-1 h-1 bg-white/60 rounded-full" />
      </div>
      <div className={`relative w-full ${aspectClassName} bg-[#ddd] overflow-hidden`}>
        <Image src={imageUrl} alt={alt} fill className={imageClassName} unoptimized />
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function ScrapbookHero({ content }: ScrapbookHeroProps) {
  const sideImages: SideImageCard[] = [
    {
      imageUrl: content.aboutInstagramImage1,
      href: content.aboutInstagramLink1,
      alt: "Instagram highlight 1",
      className:
        "group absolute top-[22%] left-[2%] md:left-[10%] z-30 w-24 md:w-32 bg-[#fafafa] p-2 pb-8 shadow-lg transform rotate-[-9deg] border border-black/5 hover:-translate-y-2 transition-transform cursor-pointer",
      aspectClassName: "aspect-[3.5/4]",
      imageClassName: "object-cover grayscale-[0.72] contrast-[1.16] brightness-[0.96] sepia-[0.1] saturate-[0.82] transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100 group-hover:scale-[1.03]",
      pinClassName:
        "absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#b82222] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-40",
    },
    {
      imageUrl: content.aboutInstagramImage2,
      href: content.aboutInstagramLink2,
      alt: "Instagram highlight 2",
      className:
        "group absolute bottom-[28%] md:bottom-[22%] left-[5%] md:left-[18%] z-30 w-28 md:w-40 bg-[#fafafa] p-2 md:p-3 pb-8 md:pb-10 shadow-lg transform rotate-[4deg] border border-black/5 hover:-translate-y-2 transition-transform cursor-pointer",
      aspectClassName: "aspect-[4/3]",
      imageClassName: "object-cover grayscale-[0.78] contrast-[1.2] brightness-[0.97] sepia-[0.12] saturate-[0.8] transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100 group-hover:scale-[1.03]",
      pinClassName:
        "absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-[#b82222] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-40",
    },
    {
      imageUrl: content.aboutInstagramImage3,
      href: content.aboutInstagramLink3,
      alt: "Instagram highlight 3",
      className:
        "group absolute top-[30%] right-[0%] md:right-[10%] z-30 w-20 md:w-28 bg-[#fafafa] p-2 pb-6 md:pb-8 shadow-md transform rotate-[14deg] border border-black/5 hover:-translate-y-2 transition-transform cursor-pointer",
      aspectClassName: "aspect-[3/4]",
      imageClassName: "object-cover grayscale-[0.8] contrast-[1.18] brightness-[0.96] sepia-[0.1] saturate-[0.78] transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100 group-hover:scale-[1.03]",
      pinClassName:
        "absolute -top-2 left-[40%] w-4 h-4 rounded-full bg-[#b82222] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-40",
    },
    {
      imageUrl: content.aboutInstagramImage4,
      href: content.aboutInstagramLink4,
      alt: "Instagram highlight 4",
      className:
        "group absolute bottom-[30%] md:bottom-[26%] right-[2%] md:right-[20%] z-30 w-24 md:w-32 bg-[#fafafa] p-2 pb-8 md:pb-10 shadow-xl transform rotate-[-6deg] border border-black/5 hover:-translate-y-2 transition-transform cursor-pointer",
      aspectClassName: "aspect-square",
      imageClassName: "object-cover grayscale-[0.68] contrast-[1.14] brightness-[0.98] sepia-[0.08] saturate-[0.86] transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:saturate-100 group-hover:scale-[1.03]",
      pinClassName:
        "absolute -top-2 right-[40%] w-4 h-4 rounded-full bg-[#b82222] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] z-40",
    },
  ];

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center text-[#333] px-4 py-20 font-sans">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px, 60px 60px",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      <div className="absolute top-0 right-4 md:right-32 w-48 md:w-56 h-36 bg-[#eadfcd] shadow-md transform rotate-1 p-5 flex flex-col justify-end z-10">
        <p className="text-[#a53f3f] font-mono text-xs md:text-sm uppercase tracking-widest leading-loose font-semibold pr-4 whitespace-nowrap">
          Notes from
          <br />a creative
          <br />to a creative.
        </p>
      </div>

      <AboutHeroMusic />

      <div className="relative w-full max-w-[900px] h-[800px] flex items-center justify-center mt-24">
        <div className="absolute z-10 w-[95%] max-w-[380px] md:max-w-none md:w-[560px] bg-[#fcfcfc] p-3 pb-8 md:p-5 md:pb-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] transform rotate-[-2deg] transition-transform duration-500 hover:rotate-1 border border-black/5">
          <div className="relative w-full aspect-[3.5/4] bg-[#e2e2e2] overflow-hidden border border-black/10">
            <Image src={content.aboutImage} alt="Abin" fill className="object-cover object-center" unoptimized />
          </div>
        </div>

        {sideImages.map((item, index) => (
          <SideImage key={index} {...item} />
        ))}
      </div>

      <div
        className="absolute bottom-10 right-4 md:right-16 lg:right-32 max-w-[280px] md:max-w-[340px] text-[10px] md:text-sm text-[#4a4a4a] leading-[1.8] opacity-80 z-20 font-light"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        <p>
          The world will tell you to be this or that. And sometimes, it&apos;s hard to choose your own path
          with all the pressure, expectations, and &quot;shoulds.&quot;
        </p>
        <p className="mt-4">
          But you&apos;re more than what you think you are. It&apos;s never too late to start, to create, or
          to become the person your younger self dreamed of being.
        </p>
      </div>

      <div className="absolute bottom-10 left-4 md:left-16 text-[9px] md:text-xs font-mono font-bold tracking-widest text-[#222] opacity-70 z-20 uppercase">
        <p>ISSUE NOVEMBER 2025 &nbsp;&nbsp;&nbsp; @THEHYBRIDDESIGNER.NP</p>
      </div>
    </section>
  );
}
