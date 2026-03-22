"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";

type KeyDef = {
  label: string;
  width?: string;
};

const keyboardRows: KeyDef[][] = [
  [
    { label: "esc", width: "w-12" },
    { label: "F1" },
    { label: "F2" },
    { label: "F3" },
    { label: "F4" },
    { label: "F5" },
    { label: "F6" },
    { label: "F7" },
    { label: "F8" },
    { label: "F9" },
    { label: "F10" },
    { label: "F11" },
    { label: "F12" },
  ],
  [
    { label: "~" },
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "0" },
    { label: "-" },
    { label: "=" },
    { label: "delete", width: "w-16" },
  ],
  [
    { label: "tab", width: "w-14" },
    { label: "Q" },
    { label: "W" },
    { label: "E" },
    { label: "R" },
    { label: "T" },
    { label: "Y" },
    { label: "U" },
    { label: "I" },
    { label: "O" },
    { label: "P" },
    { label: "[" },
    { label: "]" },
    { label: "\\", width: "w-14" },
  ],
  [
    { label: "caps", width: "w-[4.4rem]" },
    { label: "A" },
    { label: "S" },
    { label: "D" },
    { label: "F" },
    { label: "G" },
    { label: "H" },
    { label: "J" },
    { label: "K" },
    { label: "L" },
    { label: ";" },
    { label: "'" },
    { label: "return", width: "w-[4.8rem]" },
  ],
  [
    { label: "shift", width: "w-[5.2rem]" },
    { label: "Z" },
    { label: "X" },
    { label: "C" },
    { label: "V" },
    { label: "B" },
    { label: "N" },
    { label: "M" },
    { label: "," },
    { label: "." },
    { label: "/" },
    { label: "shift", width: "w-[5.8rem]" },
  ],
  [
    { label: "fn", width: "w-12" },
    { label: "control", width: "w-14" },
    { label: "option", width: "w-14" },
    { label: "command", width: "w-16" },
    { label: "", width: "w-[15rem]" },
    { label: "command", width: "w-16" },
    { label: "option", width: "w-14" },
    { label: "◀" },
    { label: "▼" },
    { label: "▶" },
  ],
];

export default function InteractiveKeyboard() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);

  const displayValue = useMemo(() => {
    if (typedText.trim().length > 0) {
      return typedText.slice(-18);
    }

    return activeKey || "type";
  }, [activeKey, typedText]);

  const playKeySound = () => {
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

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(920, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.07);
  };

  const handleKeyPress = (label: string) => {
    setActiveKey(label);
    playKeySound();

    if (label === "delete") {
      setTypedText((current) => current.slice(0, -1));
      return;
    }

    if (label === "") {
      setTypedText((current) => `${current} `);
      return;
    }

    const ignoredKeys = new Set([
      "esc",
      "tab",
      "caps",
      "shift",
      "fn",
      "control",
      "option",
      "command",
      "return",
      "◀",
      "▼",
      "▶",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
    ]);

    if (ignoredKeys.has(label)) {
      return;
    }

    setTypedText((current) => `${current}${label}`);
  };

  return (
    <div className="relative flex w-full items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={displayValue}
          initial={{ opacity: 0, y: -10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.94 }}
          transition={{ duration: 0.18 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-2xl border border-white/70 bg-white/90 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6a645d] shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm"
        >
          {displayValue || "type"}
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-[920px] rounded-[2rem] border border-[#c7c7c5] bg-[linear-gradient(180deg,#f6f6f3_0%,#deded9_100%)] p-5 shadow-[0_28px_50px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#8b8781]">
            mac keyboard
          </div>
          <div className="h-2.5 w-24 rounded-full bg-[linear-gradient(180deg,#d8d8d4_0%,#f7f7f5_100%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]" />
        </div>

        <div className="space-y-2.5">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((keyDef, keyIndex) => {
                const isSpace = keyDef.label === "";
                const isActive = activeKey === keyDef.label && !isSpace;
                const displayLabel = isSpace ? "space" : keyDef.label;

                return (
                  <motion.button
                    key={`${rowIndex}-${keyIndex}-${keyDef.label || "space"}`}
                    type="button"
                    whileTap={{ y: 2, scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    onMouseEnter={() => !isSpace && setActiveKey(keyDef.label)}
                    onMouseLeave={() => !isSpace && setActiveKey(null)}
                    onClick={() => handleKeyPress(keyDef.label)}
                    className={[
                      "h-12 rounded-[0.95rem] border text-[#66615b] shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.92)] transition-colors duration-200",
                      keyDef.width || "w-11",
                      isSpace
                        ? "bg-[linear-gradient(180deg,#fefefc_0%,#ecebe7_100%)] border-[#d2d2ce]"
                        : isActive
                          ? "bg-[linear-gradient(180deg,#d8d8d3_0%,#f4f4f1_100%)] border-[#bcbcb8]"
                          : "bg-[linear-gradient(180deg,#ffffff_0%,#ecebe7_100%)] border-[#d2d2ce] hover:border-[#bebeb9]",
                      rowIndex === 0 ? "text-[10px]" : "text-[11px]",
                      keyDef.label.length > 3 ? "px-3 text-left" : "",
                    ].join(" ")}
                    >
                      <span
                        className={[
                          "block truncate",
                          displayLabel.length > 3 ? "text-[10px] tracking-[0.08em]" : "text-[12px]",
                          isSpace ? "opacity-45" : "opacity-100",
                        ].join(" ")}
                      >
                        {displayLabel}
                      </span>
                    </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
