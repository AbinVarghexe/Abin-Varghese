"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectGalleryCard from "./ProjectGalleryCard";

const ALL_PROJECTS = [
  {
    title: "Engaging Blog Series",
    category: "Content Creation",
    // UI dashboard mockup image
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    link: "#",
    tag: "Branding",
  },
  {
    title: "Website Revamp",
    category: "UI/UX",
    // Person with phone orange background
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800",
    link: "#",
    tag: "Design",
  },
  {
    title: "SEO Strategy",
    category: "SEO",
    // App interface yellow background
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800",
    link: "#",
    tag: "Marketing",
  },
  {
    title: "Social Media Campaign",
    category: "Content Creation",
    // Dashboard light theme
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=800",
    link: "#",
    tag: "Marketing",
  },
  {
    title: "Digital Marketing",
    category: "Marketing",
    // Dark laptop dashboard
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    link: "#",
    tag: "Marketing",
  },
  {
    title: "eCommerce Platform",
    category: "App Development",
    // Blue mobile UI
    image: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=800",
    link: "#",
    tag: "Development",
  },
];

const TABS = ["All Projects", "Branding", "Design", "Marketing", "Development"];

export default function ProjectGallerySection() {
  const [activeTab, setActiveTab] = useState("All Projects");

  const filteredProjects = ALL_PROJECTS.filter((project) => 
    activeTab === "All Projects" || project.tag === activeTab
  );

  return (
    <section className="w-full py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Pre-title */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-900 mb-4">
            OUR PORTFOLIO
          </span>
          
          {/* Main Title */}
          <h2 className="text-[2.75rem] leading-tight md:text-5xl lg:text-[3.25rem] font-bold text-zinc-900 mb-6 tracking-tight">
            Our{" "}
            <span className="relative inline-block">
              Recent
              {/* Straight black underline */}
              <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-zinc-900"></span>
            </span>{" "}
            Projects
          </h2>
          
          {/* Description */}
          <p className="max-w-[46rem] text-zinc-500 text-lg leading-relaxed mix-blend-multiply">
            Welcome to our portfolio! Here, you will find a curated selection of our innovative applications and projects that showcase our commitment to quality, creativity, and user-centric design.
          </p>
        </div>

        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-1 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-2.5 text-[15px] font-medium rounded-full transition-all duration-300 ease-out ${
                  activeTab === tab 
                    ? "bg-gradient-to-br from-zinc-900 to-zinc-600 text-white shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 md:gap-y-32">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ProjectGalleryCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
