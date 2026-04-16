"use client";

import React from "react";
import Image from "next/image";

interface ProjectGalleryCardProps {
  title: string;
  category: string;
  image: string;
  link: string;
  className?: string;
}

export default function ProjectGalleryCard({
  title,
  category,
  image,
  link,
  className = "",
}: ProjectGalleryCardProps) {
  return (
    <div className={`relative flex flex-col items-center w-full group ${className}`}>
      {/* Main Image Container */}
      <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-zinc-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Overlapping Content Box */}
      <div className="w-[90%] bg-white rounded-lg p-6 md:p-8 flex flex-col items-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.03] -mt-16 md:-mt-20 z-10 transition-transform duration-300 group-hover:-translate-y-2">
        <span className="text-zinc-700 text-sm font-medium mb-3">{category}</span>
        <h3 className="text-xl font-bold text-zinc-900 mb-6 text-center">{title}</h3>
        <a 
          href={link}
          className="bg-zinc-200/80 hover:bg-zinc-300 transition-colors text-zinc-800 px-6 py-2 rounded-md text-sm font-semibold"
        >
          View Details
        </a>
      </div>
    </div>
  );
}
