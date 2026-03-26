"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LOGO_PATH =
  "M193.92,184.68c-.48.05-.98.07-1.49.07h-38.56c-30.04-.82-47.29-55.05-47.57-78.89v-.06c.51-3.5,2.07-7.41,4.68-11.71,1.71-2.81,3.91-5.49,6.6-8.04,2.7-2.56,5.62-4.78,8.76-6.69,3.19-1.9,6.32-3.18,9.37-3.82l-.05-3.45c-4.55-.91-9.01-2.87-13.37-5.87-2.87-2.03-5.5-4.31-7.88-6.85-2.39-2.58-4.37-5.29-5.94-8.11-1.52-2.82-2.54-5.61-3.08-8.39l-3.44.05c-.75,4.38-2.57,8.69-5.46,12.94-2.89,4.2-6.45,7.83-10.66,10.9-4.22,3.06-8.59,5.15-13.11,6.25l.05,3.45c4.5.8,9.17,3,14.03,6.59,4.81,3.54,8.53,7.34,11.15,11.4,2.68,4.06,4.33,7.86,4.92,11.4h0c-.3,23.86-18.29,78.08-48.31,78.9H16c-.51,0-1.01-.02-1.49-.07-11.42-1.02-18.24-13.69-12.34-23.91l1.33-2.29,2.53-4.38,61.54-106.6,3.97-6.88,18.83-32.61c3.08-5.32,8.46-8.01,13.84-8.01s10.77,2.69,13.85,8.01l18.83,32.61,3.97,6.88,61.54,106.6,2.53,4.38,1.32,2.29c5.91,10.22-.91,22.89-12.33,23.91Z";

const dotPositions = [
  "10% 16%",
  "21% 38%",
  "36% 22%",
  "62% 28%",
  "74% 14%",
  "84% 40%",
  "15% 72%",
  "32% 84%",
  "54% 76%",
  "69% 88%",
  "88% 68%",
];

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      return;
    }

    const restoreTimer = window.setTimeout(() => {
      document.body.style.overflow = "";
    }, 500);

    return () => window.clearTimeout(restoreTimer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="site-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(129, 167, 255, 0.22), transparent 28%),
                radial-gradient(circle at 80% 25%, rgba(74, 113, 255, 0.26), transparent 30%),
                radial-gradient(circle at 50% 78%, rgba(16, 52, 212, 0.34), transparent 36%),
                linear-gradient(145deg, #0a1fb8 0%, #1234e3 42%, #08126d 100%)
              `,
            }}
          />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)
              `,
              backgroundSize: "42px 42px",
            }}
          />

          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: dotPositions
                .map((position) => `radial-gradient(circle at ${position}, rgba(255,255,255,0.85) 0 1.5px, transparent 2.5px)`)
                .join(", "),
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.16),_transparent_38%)]" />

          <div className="relative flex h-full items-center justify-center px-6">
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute inset-[-34px] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.22),_transparent_62%)] blur-3xl" />
                <motion.svg
                  viewBox="0 0 208.42 184.75"
                  className="relative h-28 w-28 md:h-36 md:w-36"
                  fill="none"
                >
                  <motion.path
                    d={LOGO_PATH}
                    stroke="#ffffff"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
                    animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
                    transition={{
                      pathLength: { duration: 1.45, ease: "easeInOut" },
                      fillOpacity: { delay: 0.95, duration: 0.6, ease: "easeOut" },
                      strokeOpacity: { delay: 1.15, duration: 0.32, ease: "easeOut" },
                    }}
                    fill="#ffffff"
                  />
                </motion.svg>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.65 }}
                className="space-y-4 text-center"
              >
                <p className="text-xs font-medium uppercase tracking-[0.6em] text-white/70">
                  Abin Varghese
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[0, 1, 2].map((index) => (
                    <motion.span
                      key={index}
                      className="h-2.5 w-2.5 rounded-full bg-white"
                      animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }}
                      transition={{
                        duration: 0.9,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.12,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
