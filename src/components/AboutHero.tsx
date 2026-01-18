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
      className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] xl:min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-24 pb-8 relative h-full flex flex-col justify-between">
        <div className="relative flex flex-col items-center justify-center flex-grow">
          {/* Main Content Area */}
          <div className="relative w-full flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
            {/* Background Text: DESIGNER */}
            <h2
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[20vw] md:text-[18vw] font-bold uppercase tracking-tighter leading-none text-center z-10 select-none opacity-90"
              style={{
                fontFamily: "var(--font-display), Vina, sans-serif",
                color: "#0020d7",
                width: "120%",
              }}
            >
              DESIGNER
            </h2>

            {/* Image: Centered and Overlapping */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10%] md:bottom-[-5%] w-[300px] md:w-[450px] lg:w-[600px] xl:w-[700px] h-[450px] md:h-[650px] lg:h-[800px] xl:h-[900px] z-20 pointer-events-none">
              <Image
                src="/about/abin-varghese.png"
                alt="Abin Varghese"
                fill
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 450px, (max-width: 1280px) 600px, 700px"
                className="object-contain object-bottom"
                priority
              />
            </div>

            {/* Foreground Text: I'm and ui/ux */}
            <div className="relative z-30 flex items-center justify-between w-full max-w-6xl px-4 pointer-events-none">
              <h1
                className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] italic font-light whitespace-nowrap"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: isLightMode ? "#111827" : "#ffffff",
                }}
              >
                I'm
              </h1>

              <h1
                className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] italic font-light whitespace-nowrap"
                style={{
                  fontFamily: "Times New Roman, serif",
                  color: isLightMode ? "#111827" : "#ffffff",
                }}
              >
                ui/ux
              </h1>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="w-full flex flex-col md:flex-row items-end justify-between mt-auto gap-8 px-4 md:px-12 z-40 pb-4">
          <div className="flex flex-col gap-4">
            <div className="w-12 h-[1px] bg-current opacity-30" />
            <p
              className="text-[10px] md:text-xs uppercase tracking-wider max-w-[180px] text-left leading-relaxed font-medium"
              style={{ color: isLightMode ? "#111827" : "#ffffff" }}
            >
              SPECIALIZED IN WEB DESIGN, UX/UI WEBFLOW, AND FRONT END
              DEVELOPMENT.
            </p>
          </div>

          <Link
            href="/contact"
            className="group relative px-10 py-4 rounded-full bg-[#0020d7] text-white font-bold hover:scale-105 transition-all text-sm md:text-base whitespace-nowrap overflow-hidden"
          >
            <span className="relative z-10">LET'S CHAT</span>
            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <p
            className="text-[10px] md:text-xs max-w-[220px] text-right leading-relaxed font-medium"
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
    </section>
  );
};

export default memo(AboutHero);
