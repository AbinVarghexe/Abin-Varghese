"use client";

import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { splitAccentHeading } from "@/lib/accent-heading";
import type { SiteCopyContent } from "@/types/site-copy";

type CreativeToolboxProps = {
  heading: string;
  intro: string;
  categories: SiteCopyContent["homeToolCategories"];
  tools: SiteCopyContent["homeTools"];
};

const CreativeToolbox = ({ heading, intro, categories, tools }: CreativeToolboxProps) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "design");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1500], [0, 45]);
  const headingParts = splitAccentHeading(heading);

  const currentCategory =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const filteredTools = tools.filter(
    (tool) => tool.category === selectedCategory,
  );

  return (
    <section className="relative z-20 pt-12 md:pt-28 pb-24 md:pb-16 bg-transparent">
      <div className="px-6 md:px-8 lg:px-16 xl:px-32 py-4 relative">
        {/* Background Element */}
        <motion.div
          style={{ rotate }}
          className="absolute left-[-30%] top-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-70 blur-sm z-0 pointer-events-none"
        >
          <Image
            src="/Home/icon.svg"
            alt="Background Element"
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 1000px"
          />
        </motion.div>

        <div className="w-full mb-8 px-4 lg:px-0 relative z-10 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold pb-2 text-black mt-4 md:mt-12 mb-2 tracking-tight">
            {headingParts.before}
            {headingParts.accent ? (
              <span className="text-blue-600 font-serif italic font-medium">{headingParts.accent}</span>
            ) : null}
            {headingParts.after}
          </h2>
          <p 
            className="text-black/70 text-base md:text-lg text-justify [text-align-last:center] lg:text-left lg:[text-align-last:left]"
          >
            {intro}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          <div className="w-full lg:flex-1">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between p-4 md:p-6 bg-white rounded-[24px] border border-zinc-200 hover:border-zinc-300 transition-colors relative z-20 pointer-events-auto"
              >
                <div className="text-left">
                  <span className="block text-xl font-semibold text-zinc-900">
                    {currentCategory.name}
                  </span>
                  <span className="block text-base text-zinc-500">
                    {currentCategory.description}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-full left-0 right-0 mt-2 p-2 md:p-4 bg-white rounded-[24px] border border-zinc-200 shadow-lg z-10 overflow-hidden pointer-events-auto"
                  >
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full p-4 text-left hover:bg-zinc-50 transition-colors ${
                          selectedCategory === category.id ? "bg-zinc-50" : ""
                        }`}
                      >
                        <span className="block text-lg font-semibold text-zinc-900">
                          {category.name}
                        </span>
                        <span className="block text-base text-zinc-500">
                          {category.description}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full lg:flex-1">
            <div className="grid grid-cols-1 gap-4">
              {filteredTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url || undefined}
                  target={tool.url?.startsWith("http") ? "_blank" : undefined}
                  rel={tool.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-6 p-4 md:p-6 bg-white rounded-[24px] border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all pointer-events-auto no-underline"
                >
                  <div className="w-14 h-14 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0 p-1">
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl font-bold text-zinc-900">
                      {tool.name}
                    </h4>
                    <p className="text-base text-zinc-500 truncate">
                      {tool.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CreativeToolbox);
