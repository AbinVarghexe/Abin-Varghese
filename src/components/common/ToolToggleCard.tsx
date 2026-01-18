'use client';

import { memo, useState } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface Section {
  id: string;
  name: string;
  tools: Tool[];
}

interface ToolToggleCardProps {
  title: string;
  description: string;
  sections: Section[];
  className?: string;
}

const ToolToggleCard = ({
  title,
  description,
  sections,
  className = '',
}: ToolToggleCardProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id || null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div
      className={`
        group relative w-full bg-[#E5E5E5] dark:bg-zinc-800/50 
        rounded-xl border border-zinc-200/50 dark:border-zinc-700/50
        p-4 transition-all duration-300 hover:shadow-md
        ${className}
      `}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-0.5">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
          {description}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="border border-zinc-300/50 dark:border-zinc-600/50 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-700/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{section.name}</span>
              <ChevronDown
                size={18}
                className={`text-zinc-500 transition-transform duration-200 ${
                  expandedSection === section.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedSection === section.id && (
              <div className="p-3 bg-white dark:bg-zinc-800/30">
                <div className="flex flex-wrap gap-2">
                  {section.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-700/50 rounded-lg"
                      >
                        <ToolIcon size={16} className="text-zinc-600 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{tool.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ToolToggleCard);
