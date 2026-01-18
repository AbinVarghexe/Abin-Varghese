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
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-12">
        <div className="relative flex flex-col items-center">
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center">
            <div className="flex flex-col md:flex-row items-center justify-center w-full">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl italic font-light"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: isLightMode ? "#111827" : "#ffffff",
                }}
              >
                I'm a
              </h1>

              <div className="relative mx-4 md:mx-8 my-4 md:my-0 w-[280px] md:w-[400px] lg:w-[500px] h-[400px] md:h-[550px] lg:h-[650px] z-10">
                <Image
                  src="/about/abin-varghese.png"
                  alt="Abin Varghese"
                  fill
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 400px, 500px"
                  className="object-contain"
                  priority
                />
              </div>

              <h1
                className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl italic font-light"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: isLightMode ? "#111827" : "#ffffff",
                }}
              >
                Abin
              </h1>
            </div>
          </div>

          <h2
            className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold uppercase tracking-tight -mt-4 md:-mt-8 lg:-mt-12 text-center"
            style={{
              fontFamily: "var(--font-display), Vina, sans-serif",
              color: "#0020d7",
            }}
          >
            DESIGNER
          </h2>

          <div className="w-full flex flex-col md:flex-row items-center justify-between mt-8 md:mt-12 gap-8 px-4 md:px-12">
            <p
              className="text-xs md:text-sm uppercase tracking-wider max-w-[200px] text-left"
              style={{ color: isLightMode ? "#111827" : "#ffffff" }}
            >
              SPECIALIZED IN WEB DESIGN, UX/UI WEBFLOW, AND FRONT END
              DEVELOPMENT.
            </p>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-[#0020d7] text-white font-medium hover:opacity-90 transition-all text-sm md:text-base"
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
