"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ElasticVolumeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ElasticVolumeSlider({
  value,
  onChange,
  disabled = false,
  className,
  min = 0,
  max = 100,
}: ElasticVolumeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const progress = ((value - min) / (max - min)) * 100;

  const updateFromClientY = (clientY: number) => {
    const track = trackRef.current;
    if (!track || disabled) return;

    const rect = track.getBoundingClientRect();
    const relative = clamp((rect.bottom - clientY) / rect.height, 0, 1);
    const nextValue = Math.round(min + relative * (max - min));
    onChange(nextValue);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updateFromClientY(event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;
    updateFromClientY(event.clientY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    const step = event.shiftKey ? 10 : 5;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      onChange(clamp(value + step, min, max));
    }

    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      onChange(clamp(value - step, min, max));
    }

    if (event.key === "Home") {
      event.preventDefault();
      onChange(min);
    }

    if (event.key === "End") {
      event.preventDefault();
      onChange(max);
    }
  };

  return (
    <div
      className={cn(
        "flex h-24 w-4 items-center justify-center",
        disabled && "opacity-50",
        className,
      )}
    >
      <div
        ref={trackRef}
        role="slider"
        aria-label="Background music volume"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        aria-orientation="vertical"
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex h-22 w-2.5 cursor-pointer items-end overflow-hidden rounded-full border border-[#a17b59]/65 bg-[linear-gradient(180deg,#eee0cb,#ccb08e)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-6px_12px_rgba(113,73,42,0.16)] transition",
          !disabled && "hover:border-[#8a6040]",
        )}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-full bg-[linear-gradient(180deg,#8f6948,#5b3d28)]"
          animate={{
            height: `${Math.max(progress, 6)}%`,
            filter: isDragging ? "saturate(1.08)" : "saturate(1)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        />
      </div>
    </div>
  );
}
