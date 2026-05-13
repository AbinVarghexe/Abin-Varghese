"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import MilesStickerBoard from "@/components/about/MilesStickerBoard";

const TelevisionSection = ({ quote }: { quote: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isOn, setIsOn] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const fullText = quote;

  // TV turn-on sequence
  useEffect(() => {
    const staticTimer = setTimeout(() => setShowStatic(true), 400);
    const onTimer = setTimeout(() => {
      setShowStatic(false);
      setIsOn(true);
    }, 1200);
    return () => {
      clearTimeout(staticTimer);
      clearTimeout(onTimer);
    };
  }, []);

  // Typing effect loop
  useEffect(() => {
    if (!isOn) return;
    
    let currentIndex = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    let delayTimeout: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      currentIndex = 0;
      setTypedText("");
      
      typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Wait 3.5 seconds, then clear and restart
          delayTimeout = setTimeout(() => {
            startTyping();
          }, 3500);
        }
      }, 65);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(delayTimeout);
    };
  }, [isOn, fullText]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Static noise canvas
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!showStatic) return;
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const drawNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 200;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(drawNoise);
    };
    drawNoise();
    return () => cancelAnimationFrame(animId);
  }, [showStatic]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 w-full pt-16 md:pt-48 pb-16 md:pb-28 flex items-center justify-center overflow-visible bg-[#fdfaf5]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(139, 90, 43, 0.15) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        backgroundPosition: "center center",
      }}
    >
      <MilesStickerBoard />

      <div className="relative w-[800px] max-w-[100%] sm:max-w-[95%] md:max-w-full flex justify-center items-center">
        {/* Television image */}
        <div className="relative w-full select-none leading-none flex justify-center">
          {/* Ambient glow behind the TV when on */}
          <AnimatePresence>
            {isOn && (
              <motion.div
                className="absolute pointer-events-none -z-20"
                style={{
                  top: "32.6%",
                  left: "32.3%",
                  width: "31.8%",
                  height: "15.7%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(51,255,51,0.15) 0%, transparent 70%)",
                  filter: "blur(45px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            )}
          </AnimatePresence>

          {/* CRT Screen overlay — placed behind the TV bezel */}
          <div
            className="absolute z-0 overflow-hidden"
            style={{
              top: "32.6%",
              left: "32.3%",
              width: "31.8%",
              height: "15.7%",
              borderRadius: "8px / 10px",
            }}
          >
            {/* Screen background glow */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOn || showStatic ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: isOn
                  ? "radial-gradient(ellipse at center, #1a2a1a 0%, #0a140a 60%, #050a05 100%)"
                  : "#111",
              }}
            />

            {/* Static noise */}
            <AnimatePresence>
              {showStatic && (
                <motion.canvas
                  ref={staticCanvasRef}
                  width={260}
                  height={200}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {/* CRT power-on flash */}
            <AnimatePresence>
              {isOn && (
                <motion.div
                  className="absolute inset-0"
                  initial={{
                    opacity: 1,
                    background:
                      "radial-gradient(ellipse at center, #ffffff 0%, #88ff88 40%, transparent 70%)",
                  }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Quote text */}
            {isOn && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 md:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <p
                  className="text-[0.6rem] sm:text-[0.65rem] md:text-[1.1rem] leading-[1.4] md:leading-[1.6] tracking-wide text-center select-none"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
                    color: "#33ff33",
                    textShadow:
                      "0 0 8px rgba(51,255,51,0.6), 0 0 20px rgba(51,255,51,0.2)",
                  }}
                >
                  {typedText}
                  {typedText.length < fullText.length && showCursor && (
                    <span className="inline-block w-[4px] h-[9px] md:w-[10px] md:h-[22px] bg-[#33ff33] align-middle ml-[2px] shadow-[0_0_4px_rgba(51,255,51,0.6)] md:shadow-[0_0_8px_rgba(51,255,51,0.8)]" />
                  )}
                </p>
              </motion.div>
            )}

            {/* CRT Scanlines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                mixBlendMode: "multiply",
              }}
            />

            {/* CRT curvature vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            {/* Screen reflection / glare */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
              }}
            />

            {/* Subtle flicker animation */}
            {isOn && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0, 0.03, 0, 0.02, 0, 0.04, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ background: "rgba(255,255,255,1)" }}
              />
            )}
          </div>

          {/* Television image */}
          <Image
            src="/Televison.png"
            alt="Retro television set"
            width={1181}
            height={1831}
            className="relative z-10 w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] pointer-events-none block"
            priority
          />

        </div>

        {/* Shadow beneath the TV cabinet */}
        <div className="absolute bottom-[4%] z-0 left-1/2 -translate-x-1/2 w-[70%] h-[4%] bg-black/35 blur-[22px] rounded-[100%]" />
      </div>
    </section>
  );
};

export default TelevisionSection;
