"use client";

import { memo, useState } from "react";
import { ChevronDown } from "lucide-react";

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
    id: "framer",
    name: "Framer",
    description: "Interactive Website Builder",
    icon: "https://skillicons.dev/icons?i=framer",
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

  // Development Tools
  {
    id: "react",
    name: "React",
    description: "UI Library",
    icon: "https://skillicons.dev/icons?i=react",
    category: "development",
  },
  {
    id: "vite",
    name: "Vite",
    description: "Frontend Build Tool",
    icon: "https://skillicons.dev/icons?i=vite",
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

  // Video Tools
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
];

const categories = [
  { id: "design", name: "Design Tools", description: "UI/UX & Prototyping" },
  {
    id: "development",
    name: "Development",
    description: "Frontend & Creative Coding",
  },
  { id: "video", name: "Video Editing", description: "Motion Graphics & VFX" },
];

const CreativeToolbox = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentCategory =
    categories.find((c) => c.id === selectedCategory) || categories[0];
  const filteredTools = tools.filter(
    (tool) => tool.category === selectedCategory,
  );

  return (
    <div className="pt-[140px] md:pt-[180px] px-4 md:px-8 lg:px-16 xl:px-32 py-4">
      <div className="w-full mb-8">
        <h2 className="text-3xl md:text-4xl font-bold pb-2 text-black mt-12">
          My Creative <span className="text-blue">Toolbox</span>
        </h2>
        <p className="text-black/70">
          A curated collection of tools and technologies I use to bring ideas to
          life,
          <br className="hidden md:block" /> from design to development.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:flex-1">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-colors"
            >
              <div className="text-left">
                <span className="block font-semibold text-zinc-900">
                  {currentCategory.name}
                </span>
                <span className="block text-sm text-zinc-500">
                  {currentCategory.description}
                </span>
              </div>
              <ChevronDown
                size={20}
                className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-zinc-200 shadow-lg z-10 overflow-hidden">
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
                    <span className="block font-semibold text-zinc-900">
                      {category.name}
                    </span>
                    <span className="block text-sm text-zinc-500">
                      {category.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:flex-1">
          <div className="grid grid-cols-1 gap-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0 p-2">
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-zinc-900">{tool.name}</h4>
                  <p className="text-sm text-zinc-500 truncate">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CreativeToolbox);
