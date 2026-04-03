import { getAboutContent, getHeroContent } from "@/lib/site-content";
import prisma from "@/lib/prisma";

export type AssistantIntent = "about" | "projects" | "skills" | "contact" | "none";

export interface JarvisResponse {
  text: string;
  intent: AssistantIntent;
}

export async function generateJarvisResponse(query: string): Promise<JarvisResponse> {
  const normalizedQuery = query.toLowerCase();
  
  // 1. Fetch Context
  const [about, hero, projects] = await Promise.all([
    getAboutContent(),
    getHeroContent(),
    prisma.project.findMany({ select: { title: true, description: true, imageUrl: true, demoUrl: true, tags: true } }),
  ]);

  // 2. Intent Matching Logic (The Virtual Self Brain)
  
  // Who am I / About
  if (normalizedQuery.includes("who are you") || normalizedQuery.includes("about you") || normalizedQuery.includes("who is abin")) {
    return {
      text: `I am the Virtual Self of Abin Varghese. He is a passionate Front-end Developer specializing in React, Next.js, and creating immersive 3D web experiences! Currently, ${about.aboutInstagramLink1 ? "he is active on Instagram" : "he is focused on building next-gen web apps"}.`,
      intent: "about"
    };
  }

  // Projects
  if (normalizedQuery.includes("project") || normalizedQuery.includes("work") || normalizedQuery.includes("portfolio")) {
    return {
      text: `Abin has worked on several exciting projects including ${projects[0]?.title || "high-end portfolios"} and ${projects[1]?.title || "3D web experiences"}. Each project focuses on high-performance UI and pixel-perfect design.`,
      intent: "projects"
    };
  }

  // Skills
  if (normalizedQuery.includes("skill") || normalizedQuery.includes("tech") || normalizedQuery.includes("use")) {
    return {
      text: `Abin's core stack includes React, Next.js, TypeScript, and Three.js for 3D graphics. He also uses Tailwind CSS for styling and Prisma for database management.`,
      intent: "skills"
    };
  }

  // Availability / Contact
  if (normalizedQuery.includes("hire") || normalizedQuery.includes("contact") || normalizedQuery.includes("available")) {
    return {
      text: `Abin is currently ${hero.heroAvailabilityText.toLowerCase()}. You can reach out to him via the contact section or find him on LinkedIn. He's always open for freelance or full-time opportunities!`,
      intent: "contact"
    };
  }

  // Default
  return {
    text: "That's an interesting question, sir. Based on my current data, Abin focuses on creating stunning digital experiences. Could you be more specific about what you'd like to know?",
    intent: "none"
  };
}
