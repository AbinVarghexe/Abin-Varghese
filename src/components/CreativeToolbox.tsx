
'use client';

import { memo } from 'react';
import { Palette, Code, Figma, PenTool, Video, Box } from 'lucide-react';
import ToolCard from './common/ToolCard';
import ToolToggleCard from './common/ToolToggleCard';

const CreativeToolbox = () => {
  const designSections = [
    {
      id: 'ui-ux',
      name: 'UI/UX',
      tools: [
        { id: 'figma', name: 'Figma', icon: Figma },
        { id: 'xd', name: 'Adobe XD', icon: Palette },
        { id: 'sketch', name: 'Sketch', icon: PenTool },
      ]
    },
    {
      id: 'motion',
      name: 'Motion',
      tools: [
        { id: 'ae', name: 'After Effects', icon: Video },
        { id: 'premiere', name: 'Premiere Pro', icon: Video },
        { id: 'lottie', name: 'Lottie', icon: Code },
      ]
    },
    {
      id: '3d',
      name: '3D Design',
      tools: [
        { id: 'blender', name: 'Blender', icon: Box },
        { id: 'spline', name: 'Spline', icon: Box },
        { id: 'c4d', name: 'Cinema 4D', icon: Box },
      ]
    }
  ];

  return (
    <div className="pt-[100px] md:pt-[140px] px-4 md:px-8 lg:px-48 py-4">
      <div className="w-full mb-8 p-6">
        <h2 className="text-4xl font-bold pb-2 text-black">My Creative <span className="text-blue">Toolbox</span></h2>
        <p className="text-black/80">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo tempor incididunt <br className="hidden md:block" /> ut labore et dolore magna aliqua.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 px-6">
        <div className="w-full">
          <ToolToggleCard
            title="Design"
            description="UI/UX, Motion, & 3D"
            sections={designSections}
          />
        </div>
        <div className="w-full">
          <ToolCard
            title="Development"
            description="Frontend & Creative Coding"
            icon={Code}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CreativeToolbox);