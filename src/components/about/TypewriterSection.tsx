"use client";


import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import MilesStickerBoard from "@/components/about/MilesStickerBoard";


const TypewriterSection = ({ quote }: { quote: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastIndexRef = useRef(0);
  const soundArmedRef = useRef(false);
  const typewriterVideo = "/Typewritter.mp4";
  const typewriterTransparentVideo = "/Typewritter-alpha.webm";
  const animationLoopSeconds = 4;

  // Paper animation and typing effect
  const [typedText, setTypedText] = useState("");
  const fullText = quote;
  const typewriterFont = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
  const paperWidth = 370;
  const paperHeight = 360;
  const paperViewportTop = 130;

  useEffect(() => {
    return () => {
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const playTypewriterSound = useCallback(() => {
    if (!soundArmedRef.current) return;
    if (typeof window === "undefined") return;

    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = audioContextRef.current ?? new AudioCtx();
    audioContextRef.current = ctx;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(980, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.035);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.009, ctx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.04);
  }, []);

  useEffect(() => {
    const loopDurationMs = animationLoopSeconds * 1000;
    const startTime = performance.now();

    const updateLoop = () => {
      const elapsed = (performance.now() - startTime) % loopDurationMs;
      const progress = elapsed / loopDurationMs;
      const nextIndex = Math.floor(progress * (fullText.length + 1));
      setTypedText(fullText.slice(0, nextIndex));
    };

    updateLoop();
    const typingInterval = window.setInterval(updateLoop, 50);
    return () => window.clearInterval(typingInterval);
  }, [fullText]);

  useEffect(() => {
    const currentLength = typedText.length;
    const latestChar = typedText.at(-1) ?? "";
    const shouldPlayClick =
      currentLength > lastIndexRef.current &&
      currentLength < fullText.length &&
      latestChar.trim() !== "" &&
      currentLength % 3 === 0;

    if (shouldPlayClick) {
      playTypewriterSound();
    }

    lastIndexRef.current = currentLength;
  }, [typedText, fullText.length, playTypewriterSound]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlaybackRate = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      video.playbackRate = video.duration / animationLoopSeconds;
    };

    syncPlaybackRate();
    video.addEventListener("loadedmetadata", syncPlaybackRate);

    return () => {
      video.removeEventListener("loadedmetadata", syncPlaybackRate);
    };
  }, []);

  // Paper animation: y position depends on typing progress
  const paperStartY = 110; // px, just inside the roller
  const paperEndY = -65; // Keep the paper reveal inside this section
  const typingProgress = typedText.length / fullText.length;
  const paperY = paperStartY + ((paperEndY - paperStartY) * typingProgress);

  // Aged sand paper stock with warm fiber noise and subtle vintage banding.
  const grainyPaper =
    'data:image/svg+xml;utf8,<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg"><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" seed="11"/><feColorMatrix type="saturate" values="0"/></filter><linearGradient id="tone" x1="0" y1="0" x2="0" y2="1"><stop offset="0%25" stop-color="%23e3d1b0"/><stop offset="52%25" stop-color="%23d4c09a"/><stop offset="100%25" stop-color="%23c2ad84"/></linearGradient><linearGradient id="fade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%25" stop-color="%23f6edd8" stop-opacity="0.34"/><stop offset="100%25" stop-color="%238b7551" stop-opacity="0.14"/></linearGradient><pattern id="bands" width="400" height="42" patternUnits="userSpaceOnUse"><rect width="400" height="1" fill="%23b09567" opacity="0.1"/><rect y="21" width="400" height="1" fill="%23fff8ea" opacity="0.07"/></pattern></defs><rect width="100%25" height="100%25" fill="url(%23tone)"/><rect width="100%25" height="100%25" fill="url(%23fade)"/><rect width="100%25" height="100%25" fill="url(%23bands)"/><rect width="100%25" height="100%25" filter="url(%23grain)" opacity="0.11"/></svg>';

  return (
    <section
      ref={containerRef}
      onPointerEnter={() => {
        soundArmedRef.current = true;
      }}
      onPointerDown={() => {
        soundArmedRef.current = true;
      }}
      className="relative z-20 w-full pt-48 pb-28 flex items-center justify-center overflow-visible bg-[#fdfaf5]"
      style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(139, 90, 43, 0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
        backgroundPosition: 'center center'
      }}
    >
      <MilesStickerBoard />
      <div className="relative w-[850px] h-[760px] flex justify-center items-end">
        {/* Animated Paper */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          style={{
            top: paperViewportTop,
            width: paperWidth,
          }}
        >
          <motion.div
            initial={false}
            animate={{ y: paperY }}
            transition={{ ease: "linear", duration: 0.05 }}
            className="rounded-[2px] shadow-[0_-5px_15px_rgba(0,0,0,0.10),0_0_20px_rgba(0,0,0,0.05)] border-t border-x border-[#bea57c] flex flex-col justify-start items-start px-10 pt-12 pb-8"
            style={{
              width: paperWidth,
              height: paperHeight,
              background: `url('${grainyPaper}') center/cover, #d4c09a`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(250,243,226,0.18)',
            }}
          >
            <span
              className="block text-[1.28rem] text-[#2f2619] leading-8 whitespace-pre-wrap select-none"
              style={{
                fontFamily: typewriterFont,
                letterSpacing: '0.04em',
                textShadow: '0 1px 0 rgba(253,248,239,0.28)',
                userSelect: 'none',
              }}
            >
              {typedText}
              {typedText.length < fullText.length && (
                <span className="inline-block w-2 h-6 bg-black/80 align-middle ml-1 animate-pulse" />
              )}
            </span>
          </motion.div>
        </div>
        
        <div
          className="absolute z-20 left-1/2 -translate-x-1/2 bottom-0 w-[550px] pointer-events-none"
        >
          <video
            ref={videoRef}
            className="w-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] origin-bottom"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Vintage typewriter animation"
            style={{ backgroundColor: "transparent" }}
          >
            <source src={typewriterTransparentVideo} type="video/webm; codecs=vp9" />
            <source src={typewriterVideo} type="video/mp4" />
            Your browser does not support the typewriter video.
          </video>
        </div>
        {/* Shadow on the desk */}
        <div className="absolute bottom-[10%] z-0 left-1/2 -translate-x-1/2 w-[450px] h-[35px] bg-black/40 blur-[25px] rounded-[100%]" />
      </div>
    </section>
  );
};

export default TypewriterSection;
