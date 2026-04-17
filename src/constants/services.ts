export interface ProjectLink {
  label: string;
  url: string;
  icon?: 'Figma' | 'Github' | 'Globe' | 'ExternalLink' | 'Code2' | 'Zap' | 'Instagram' | 'Youtube' | 'Dribbble' | 'Box';
}

export interface ServiceContent {
  type: 'image' | 'video' | 'text' | 'project';
  url?: string;
  title: string;
  description: string;
  // New fields for project showcase
  date?: string;
  duration?: string;
  role?: string;
  projectIcon?: string; // Icon identifier or URL
  mockupImage?: string; // Device mockup URL
  threeDModel?: string; // Path to .glb file
  videoUrl?: string; // Path to .mp4 or similar
  projectLinks?: ProjectLink[]; // Contextual links (Figma, GitHub, etc.)
  techStack?: string[]; // Technology tags
  bgColor?: string; // Suggestion for right-side card background
}

export interface Service {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  accentColor: string;
  providedServices: string[];
  contents?: ServiceContent[];
  projectsUrl?: string; // New: Redirect link for 'View More'
  projectsLabel?: string; // New: Dynamic label for 'View More'
}

export const services: Service[] = [
  {
    id: "web",
    title: "Web Design",
    description: "User-centric design systems that balance beauty with simplicity for the modern web.",
    detailedDescription: "High-performance, responsive websites and design systems focused on beauty and functionality.",
    accentColor: "#3b5bdb",
    projectsUrl: "/projects#web",
    projectsLabel: "View More",
    providedServices: ["Full Stack Apps", "Landing Pages", "CMS Development", "UI/UX Design"],
    contents: [
      {
        type: "project",
        title: "FinFlow Dashboard",
        description: "Real-time crypto and fiat management platform.",
        projectIcon: "Activity",
        mockupImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        techStack: ["TypeScript", "Recharts"],
        projectLinks: [{ label: "Demo", url: "#", icon: "Globe" }]
      }
    ]
  },
  {
    id: "motion-video-editing",
    title: "Motion Graphics and Video Editing",
    description: "Breathe life into your brand with dynamic animations and professional storytelling through seamless cuts.",
    detailedDescription: "Motion graphics and professional video editing are powerful ways to communicate complex ideas and engage your audience through visual storytelling.",
    accentColor: "#7048e8",
    projectsUrl: "/projects#motion-video",
    projectsLabel: "View More",
    providedServices: ["Logo Animation", "Explainer Videos", "Commercial Editing", "YouTube Content", "Color Grading"],
    contents: [
      {
        type: "project",
        title: "Animax Studio",
        description: "High-end motion design system for a creative production house.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-curves-of-blue-and-purple-colors-27371-large.mp4",
        bgColor: "#f3f0ff",
        techStack: ["After Effects", "Rive"],
        projectLinks: [
          { label: "Behance", url: "https://behance.net", icon: "ExternalLink" },
          { label: "Instagram", url: "https://instagram.com", icon: "Instagram" }
        ],
        date: "Sept 2025",
        duration: "4-6 Weeks",
        role: "Lead Motion Designer"
      }
    ]
  },
  {
    id: "graphics-design",
    title: "Graphics Design",
    description: "Striking visual identities and marketing materials that resonate with your audience.",
    detailedDescription: "Visual storytelling through professional graphic design and cohesive branding.",
    accentColor: "#be4bdb",
    projectsUrl: "/projects#graphics",
    projectsLabel: "View More",
    providedServices: ["Branding", "Social Media Graphics", "Print Design"],
    contents: [
      {
        type: "project",
        title: "Brand Identity",
        description: "Cohesive branding for a modern tech startup.",
        projectIcon: "Palette",
        mockupImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
        bgColor: "#f8f0fc",
        techStack: ["Branding", "Logo"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      }
    ]
  },
  {
    id: "3d-vfx",
    title: "3D Designing and VFX",
    description: "Immersive 3D environments and high-end cinematic compositing.",
    detailedDescription: "Bringing the impossible to life through advanced 3D modeling and visual effects techniques.",
    accentColor: "#0c8599",
    projectsUrl: "/projects#3d-vfx",
    projectsLabel: "View More",
    providedServices: ["3D Modeling", "Animation", "Compositing", "VFX Cleanup"],
    contents: [
      {
        type: "project",
        title: "Cascade Cube",
        description: "Physics-driven abstract sculpture.",
        projectIcon: "Box",
        mockupImage: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800",
        threeDModel: "/3d_model/cube_cascade.glb",
        bgColor: "#f0f9ff",
        techStack: ["GLTF", "R3F"],
        projectLinks: [{ label: "View Live", url: "#", icon: "Box" }]
      }
    ]
  }
];
