"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface InteractiveDotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  dotColor?: string;
  activeDotColor?: string;
  hoverRadius?: number;
}

export function InteractiveDotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1.5,
  className,
  dotColor = "rgba(0, 0, 0, 0.1)",
  activeDotColor = "rgba(0, 0, 0, 0.4)",
  hoverRadius = 60,
  ...props
}: InteractiveDotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} fill={dotColor} />
        </pattern>
        
        <pattern
          id={`${id}-active`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle cx={cx} cy={cy} r={cr * 1.5} fill={activeDotColor} />
        </pattern>

        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill="black" />
          <circle r={hoverRadius} fill="white" filter={`blur(${hoverRadius / 2}px)`}>
            <animate attributeName="cx" values="0%;100%;50%;0%" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="0%;50%;100%;0%" dur="17s" repeatCount="indefinite" />
          </circle>
          <circle r={hoverRadius * 1.2} fill="white" filter={`blur(${hoverRadius / 2}px)`}>
            <animate attributeName="cx" values="100%;0%;50%;100%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="100%;50%;0%;100%" dur="22s" repeatCount="indefinite" />
          </circle>
          <circle r={hoverRadius * 0.8} fill="white" filter={`blur(${hoverRadius / 2}px)`}>
            <animate attributeName="cx" values="50%;100%;0%;50%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="100%;0%;50%;100%" dur="13s" repeatCount="indefinite" />
          </circle>
          <circle r={hoverRadius} fill="white" filter={`blur(${hoverRadius / 2}px)`}>
            <animate attributeName="cx" values="20%;80%;20%" dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values="80%;20%;80%" dur="14s" repeatCount="indefinite" />
          </circle>
        </mask>
      </defs>

      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${id}-active)`}
        mask={`url(#${id}-mask)`}
      />
    </svg>
  );
}
