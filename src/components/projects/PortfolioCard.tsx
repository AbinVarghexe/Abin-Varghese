"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { homePageDesignSystem } from "@/lib/home-page-design-system";

interface PortfolioCardProps {
  title: string;
  category: string;
  image: string;
  link: string;
  className?: string;
}

export default function PortfolioCard({ title, category, image, link, className }: PortfolioCardProps) {
  const design = homePageDesignSystem;

  return (
    <div className={`flex flex-col w-full ${className || ""}`}>
      {/* Screenshot / Preview Image */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative aspect-[4/3] w-full overflow-hidden mb-6 bg-zinc-100"
        style={{
          borderRadius: "1.25rem",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
      </motion.div>

      {/* Info Row: Left (Title/Sub) | Right (Preview Button) */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h3 
            className="text-[22px] font-bold tracking-tight text-[#111111]"
            style={{ fontFamily: design.typography.families.sans }}
          >
            {title}
          </h3>
          <p 
            className="text-[15px] text-[#666666] font-medium mt-0.5"
            style={{ fontFamily: design.typography.families.sans }}
          >
            {category}
          </p>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-200 bg-white text-[13px] font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300"
        >
          Preview
          <Eye size={16} className="text-zinc-500" />
        </a>
      </div>
    </div>
  );
}
