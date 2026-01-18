"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AboutHero = () => {
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
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      {/* 1. Background Text: DESIGNER - Centered behind everything */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <h2
          className="text-[20vw] md:text-[22vw] font-bold uppercase tracking-tighter leading-none text-center opacity-90 select-none translate-y-[20%]"
          style={{
            fontFamily: "var(--font-display), Vina, sans-serif",
            color: "#0020d7",
          }}
        >
          DESIGNER
        </h2>
      </div>

      {/* 2. Top Text: I'm ui/ux - Positioned high up */}
      <div className="absolute top-[18%] md:top-[22%] w-full z-10 pointer-events-none">
        <div className="container mx-auto px-4 md:px-16 flex justify-between items-center max-w-[95%] md:max-w-7xl">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] italic font-light"
            style={{
              fontFamily: "Vina, sans-serif",
              color: isLightMode ? "#111827" : "#ffffff",
            }}
          >
            I'm
          </h1>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] italic font-light"
            style={{
              fontFamily: "Vina, sans-serif",
              color: isLightMode ? "#111827" : "#ffffff",
            }}
          >
            Abin
          </h1>
        </div>
      </div>

      {/* 3. Image - Anchored to bottom, in front of text, behind footer */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px] h-[80vh] md:h-[88vh] z-20 pointer-events-none">
        <Image
          src="/about/abin-varghese.png"
          alt="Abin Varghese"
          fill
          className="object-contain object-bottom"
          priority
        />
      </div>

      {/* 4. Footer Content - Overlaying image */}
      <div className="absolute bottom-8 w-full z-30">
        <div className="container mx-auto px-4 md:px-12 flex flex-row items-end justify-between gap-4">
          <div className="hidden md:flex flex-col gap-4">
            <div className="w-12 h-[1px] bg-current opacity-30" />
            <p
              className="text-xs uppercase tracking-wider max-w-[180px] text-left leading-relaxed font-medium"
              style={{ color: isLightMode ? "#111827" : "#ffffff" }}
            >
              SPECIALIZED IN WEB DESIGN, UX/UI WEBFLOW, AND FRONT END
              DEVELOPMENT.
            </p>
          </div>

          {/* Button - Centered relative to screen mostly, but part of flex */}
          <div className="mx-auto md:mx-0">
            <Link
              href="/contact"
              className="group relative px-10 py-5 rounded-full bg-[#0020d7] text-white font-bold hover:scale-105 transition-all text-sm md:text-lg whitespace-nowrap overflow-hidden inline-block shadow-xl"
            >
              <span className="relative z-10">LET'S CHAT</span>
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          <div className="hidden md:block">
            <p
              className="text-xs max-w-[220px] text-right leading-relaxed font-medium"
              style={{
                color: isLightMode
                  ? "rgba(0,0,0,0.7)"
                  : "rgba(255,255,255,0.7)",
              }}
            >
              Build a credible, conversion-focused website that shows your ideal
              client exactly how you can help them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutHero);
