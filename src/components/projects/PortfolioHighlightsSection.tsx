"use client";

import React from "react";
import { motion } from "framer-motion";
import PortfolioCard from "./PortfolioCard";
import { homePageDesignSystem, homePageContainerClass } from "@/lib/home-page-design-system";

const PROJECTS = [
  {
    title: "Lay's wafer",
    category: "E-Commerce Website",
    image: "https://images.unsplash.com/photo-1599490659223-e153c0710f86?q=80&w=800",
    link: "#",
  },
  {
    title: "Just Website",
    category: "SaaS Product Website",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    link: "#",
  },
  {
    title: "Astro AI",
    category: "AI Website",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800",
    link: "#",
  },
  {
    title: "John Doe",
    category: "Portfolio Website",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
    link: "#",
  },
];

export default function PortfolioHighlightsSection() {
  const design = homePageDesignSystem;

  return (
    <section className="relative w-full pt-16 pb-32 overflow-hidden bg-white">
      <div className={homePageContainerClass("relative z-10 mx-auto px-6")}>
        {/* Projects Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 lg:gap-x-20 lg:gap-y-24">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] 
              }}
            >
              <PortfolioCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
