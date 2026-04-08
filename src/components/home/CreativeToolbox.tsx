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

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const tools: Tool[] = [
  // Design Tools
  {
    id: "figma",
    name: "Figma",
    description: "Interface Design & Prototyping",
    icon: "https://skillicons.dev/icons?i=figma",
    category: "design",
  },
  {
    id: "photoshop",
    name: "Photoshop",
    description: "Image Manipulation & Editing",
    icon: "https://skillicons.dev/icons?i=ps",
    category: "design",
  },
  {
    id: "illustrator",
    name: "Illustrator",
    description: "Vector Graphics Software",
    icon: "https://skillicons.dev/icons?i=ai",
    category: "design",
  },

  // Motion/VideoEditing Tools
  {
    id: "aftereffects",
    name: "After Effects",
    description: "VFX & Motion Graphics",
    icon: "https://skillicons.dev/icons?i=ae",
    category: "video",
  },
  {
    id: "premiere",
    name: "Premiere Pro",
    description: "Video Editing Software",
    icon: "https://skillicons.dev/icons?i=pr",
    category: "video",
  },
  {
    id: "blender",
    name: "Blender",
    description: "3D Creation Suite",
    icon: "https://skillicons.dev/icons?i=blender",
    category: "video",
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    description: "Color Correction & Editing",
    icon: "https://cdn.simpleicons.org/davinciresolve",
    category: "video",
  },

  // Development Tools
  {
    id: "react",
    name: "React",
    description: "UI Library",
    icon: "https://skillicons.dev/icons?i=react",
    category: "development",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description: "React Framework",
    icon: "https://skillicons.dev/icons?i=nextjs",
    category: "development",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "Utility-first CSS Framework",
    icon: "https://skillicons.dev/icons?i=tailwind",
    category: "development",
  },
  {
    id: "js",
    name: "JavaScript",
    description: "Programming Language",
    icon: "https://skillicons.dev/icons?i=js",
    category: "development",
  },
];

const categories = [
  { id: "design", name: "Design Tools", description: "UI/UX & Prototyping" },
  {
    id: "video",
    name: "Motion/VideoEditing",
    description: "Motion Graphics & VFX",
  },
  {
    id: "development",
    name: "Development Tools",
    description: "Frontend & Creative Coding",
  },
];

const CreativeToolbox = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1500], [0, 45]);

  const currentCategory =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const filteredTools = tools.filter(
    (tool) => tool.category === selectedCategory,
  );

  return (
    <section className="relative z-20 pt-28 pb-24 md:pb-16 bg-transparent pointer-events-none">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 py-4 relative">
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
          />
        </motion.div>

        <div className="w-full mb-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold pb-2 text-black mt-12 mb-2 tracking-tight">
            My Creative <span className="text-blue-600 font-serif italic font-medium">Toolbox</span>
          </h2>
          <p className="text-black/70">
            A curated collection of tools and technologies I use to bring ideas
            to life,
            <br className="hidden md:block" /> from design to development.
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
                <div
                  key={tool.id}
                  className="flex items-center gap-6 p-4 md:p-6 bg-white rounded-[24px] border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all pointer-events-auto"
                >
                  <div className="w-14 h-14 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0 p-1">
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      className="w-full h-full object-contain"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CreativeToolbox);
