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
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-8 relative">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-full flex items-center justify-center">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[320px] md:w-[450px] lg:w-[550px] xl:w-[600px] h-[450px] md:h-[600px] lg:h-[700px] xl:h-[750px] z-20">
              <Image
                src="/about/abin-varghese.png"
                alt="Abin Varghese"
                fill
                sizes="(max-width: 768px) 320px, (max-width: 1024px) 450px, (max-width: 1280px) 550px, 600px"
                className="object-contain object-bottom"
                priority
              />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full pt-8">
              <div className="flex items-center justify-center gap-[200px] md:gap-[350px] lg:gap-[450px] xl:gap-[500px]">
                <h1
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl italic font-light"
                  style={{
                    fontFamily: "Times New Roman, serif",
                    color: isLightMode ? "#111827" : "#ffffff",
                  }}
                >
                  I'm
                </h1>

                <h1
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl italic font-light"
                  style={{
                    fontFamily: "Times New Roman, serif",
                    color: isLightMode ? "#111827" : "#ffffff",
                  }}
                >
                  ui/ux
                </h1>
              </div>

              <h2
                className="text-6xl md:text-8xl lg:text-9xl xl:text-[11rem] font-bold uppercase tracking-tight mt-2 md:mt-4 text-center"
                style={{
                  fontFamily: "var(--font-display), Vina, sans-serif",
                  color: "#0020d7",
                }}
              >
                DESIGNER
              </h2>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between mt-auto pt-32 md:pt-48 lg:pt-56 gap-8 px-4 md:px-12">
            <p
              className="text-xs md:text-sm uppercase tracking-wider max-w-[200px] text-left"
              style={{ color: isLightMode ? "#111827" : "#ffffff" }}
            >
              SPECIALIZED IN WEB DESIGN, UX/UI WEBFLOW, AND FRONT END
              DEVELOPMENT.
            </p>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#0020d7] text-white font-medium hover:opacity-90 transition-all text-sm md:text-base z-30"
            >
              LET'S CHAT
            </Link>

            <p
              className="text-xs md:text-sm max-w-[250px] text-right"
              style={{
                color: isLightMode
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(255,255,255,0.6)",
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
