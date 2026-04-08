"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import LogoCarousel from "./LogoCarousel";

const partnerLogos = [
  "/uploads/logos/1775313043262-incial.png",
  "/uploads/logos/1775314295868-voltant.png",
  "/uploads/logos/1775314641812-blaupunkt.png",
  "/uploads/logos/1775314941462-manna.png",
];

// Brands array kept for legacy or other uses if needed, but carousel uses partnerLogos
const brands = [
  { name: "BLAUPUNKT", logo: "●" },
  { name: "Incial", logo: "🦅" },
  { name: "VOLTANT", logo: "⚡" },
  { name: "BLAUPUNKT", logo: "●" },
  { name: "Incial", logo: "🦅" },
];

interface BrandsSectionProps {
  logos?: string[];
}

const BrandsSection = ({ logos }: BrandsSectionProps) => {
  const displayLogos = logos && logos.length > 0 ? logos : partnerLogos;
  const [isLightMode, setIsLightMode] = useState<boolean>(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(!document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-20 w-full px-4 md:px-8 lg:px-16 py-8">
      <div
        className="relative w-full rounded-[32px] px-6 md:px-12 pt-8 md:pt-16 pb-12 md:pb-20 overflow-hidden z-20"
        style={{
          background: "linear-gradient(180deg, rgba(125,163,246,0.85) 0%, rgba(0,32,215,0.85) 100%)",
          backdropFilter: 'blur(8px)',
          border: '5px solid #C4C4C4',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.5) 1.5px, transparent 2px),
              linear-gradient(to bottom, rgba(255,255,255,0.5) 1.5px, transparent 2px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="absolute -top-40 -left-35 w-32 h-32 md:w-100 md:h-100 pointer-events-none opacity-40 blur-xs">
          <Image
            src="/Home/icon.svg"
            alt="Decorative Icon"
            fill
            className="object-contain blur-[2px] brightness-0"
          />
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 pointer-events-none opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M50 0 C50 30, 30 50, 0 50 C30 50, 50 70, 50 100 C50 70, 70 50, 100 50 C70 50, 50 30, 50 0"
              fill="currentColor"
              className="text-black/20"
            />
          </svg>
        </div>

        <div className="absolute -bottom-50 -right-40 w-32 h-32 md:w-130 md:h-125 pointer-events-none opacity-70 blur-xs">
          <Image
            src="/Home/icon.svg"
            alt="Decorative Icon"
            fill
            className="object-contain blur-[1px] brightness-0 invert"
          />
        </div>

        <div className="text-center mb-12 relative z-10">
          <h2 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-white flex items-center justify-center gap-6">
            <span className="text-3xl md:text-5xl lg:text-6xl font-light">✧</span>
            <div className="flex items-center gap-2">
              <span className="text-white">Brands &</span>
              <span className="text-black">Companies</span>
            </div>
            <span className="text-3xl md:text-5xl lg:text-6xl font-light">✧</span>
          </h2>
          <p className="text-white/80 text-sm md:text-base mt-4 max-w-lg mx-auto font-normal leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmo tempor incididunt ut labore
          </p>
        </div>

        <div className="relative z-10 mt-8 md:mt-12">
          <LogoCarousel logos={displayLogos} showTitle={false} />
        </div>
      </div>
    </section>
  );
};

export default memo(BrandsSection);
