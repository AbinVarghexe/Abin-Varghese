"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";

const brands = [
  { name: "BLAUPUNKT", logo: "●" },
  { name: "Incial", logo: "🦅" },
  { name: "VOLTANT", logo: "⚡" },
  { name: "BLAUPUNKT", logo: "●" },
  { name: "Incial", logo: "🦅" },
];

const BrandsSection = () => {
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
    <section className="w-full px-4 md:px-8 lg:px-16 py-8">
      <div
        className="relative w-full rounded-[32px] px-6 md:px-12 py-20 md:py-32 overflow-hidden z-20"
        style={{
          background: "linear-gradient(180deg, rgba(125,163,246,0.85) 0%, rgba(0,32,215,0.85) 100%)",
          backdropFilter: 'blur(8px)',
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

        <div className="text-center mb-8 md:mb-10 relative z-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white flex items-center justify-center gap-2">
            <span className="text-sm">◇</span>
            Brands & <span className="text-[#0a0a23] font-bold">Companies</span>
            <span className="text-sm">◇</span>
          </h2>
          <p className="text-white/70 text-xs md:text-sm mt-2 max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmo tempor incididunt ut labore
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 md:gap-10 lg:gap-16 flex-wrap relative z-10">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-[#0a0a23] font-bold text-base md:text-lg lg:text-xl"
            >
              <span className="text-lg md:text-xl">{brand.logo}</span>
              <span style={{ fontFamily: "sans-serif" }}>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BrandsSection);
