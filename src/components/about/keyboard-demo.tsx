"use client";
import React from "react";
import { Keyboard } from "@/components/ui/keyboard";
import { cn } from "@/lib/utils";

export default function KeyboardDemo({
  className,
  onKeyInteraction,
}: {
  className?: string;
  onKeyInteraction?: (keyCode: string) => void;
}) {
  return (
    <div className={cn("flex min-h-96 w-full items-center justify-center py-10 md:min-h-180", className)}>
      <Keyboard enableSound showPreview onKeyInteraction={onKeyInteraction} />
    </div>
  );
}
