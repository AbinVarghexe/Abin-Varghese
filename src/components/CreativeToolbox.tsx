'use client';

import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const tools: Tool[] = [
  { id: 'figma', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', icon: '/tools/figma.svg' },
  { id: 'framer', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', icon: '/tools/framer.svg' },
  { id: 'photoshop', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', icon: '/tools/photoshop.svg' },
  { id: 'illustrator', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', icon: '/tools/illustrator.svg' },
  { id: 'aftereffects', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing', icon: '/tools/aftereffects.svg' },
];

const categories = [
  { id: 'design', name: 'Design Tools', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing' },
  { id: 'development', name: 'Development', description: 'Frontend & Creative Coding' },
  { id: 'video', name: 'Video Editing', description: 'Motion Graphics & VFX' },
];

const CreativeToolbox = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  return (
    <div className="pt-[100px] md:pt-[140px] px-4 md:px-8 lg:px-16 xl:px-32 py-4">
      <div className="w-full mb-8">
        <h2 className="text-3xl md:text-4xl font-bold pb-2 text-black">
          My Creative <span className="text-blue">Toolbox</span>
        </h2>
        <p className="text-black/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor
          <br className="hidden md:block" /> incididunt ut labore et dolore magna aliqua.
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
                <span className="block font-semibold text-zinc-900">{currentCategory.name}</span>
                <span className="block text-sm text-zinc-500">{currentCategory.description}</span>
              </div>
              <ChevronDown
                size={20}
                className={`text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                      selectedCategory === category.id ? 'bg-zinc-50' : ''
                    }`}
                  >
                    <span className="block font-semibold text-zinc-900">{category.name}</span>
                    <span className="block text-sm text-zinc-500">{category.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:flex-1">
          <div className="grid grid-cols-1 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-zinc-900">{tool.name}</h4>
                  <p className="text-sm text-zinc-500 truncate">{tool.description}</p>
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
