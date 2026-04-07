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
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Breathe life into your brand with dynamic, smooth, and engaging animations.",
    detailedDescription: "Motion graphics are a powerful way to communicate complex ideas quickly and memorably.",
    accentColor: "#7048e8",
    projectsUrl: "/projects#motion-graphics",
    projectsLabel: "View More",
    providedServices: ["Logo Animation", "Explainer Videos", "Social Media Content", "UI Animations"],
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
      },
      {
        type: "project",
        title: "Vortex Ident",
        description: "Dynamic logo animation with liquid simulations.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bright-neon-lights-of-a-club-dance-floor-41006-large.mp4",
        bgColor: "#eef2ff",
        techStack: ["Cinema 4D", "X-Particles"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Lumina Motion",
        description: "Clean, minimalist identity for a tech startup.",
        projectIcon: "Sparkles",
        mockupImage: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-light-beams-in-a-dark-room-41007-large.mp4",
        bgColor: "#f8fafc",
        techStack: ["After Effects", "Framer"],
        projectLinks: [{ label: "Dribbble", url: "#", icon: "Dribbble" }]
      },
      {
        type: "project",
        title: "Cyberpunk Pack",
        description: "Streamer overlay and transition package.",
        projectIcon: "Cpu",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-scifi-city-at-night-with-flying-vehicles-41014-large.mp4",
        bgColor: "#18181b",
        techStack: ["OBS", "After Effects"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      },
      {
        type: "project",
        title: "Pulse UI",
        description: "Interactive dashboard animations for FinTech.",
        projectIcon: "Activity",
        mockupImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-financial-data-analysis-41011-large.mp4",
        techStack: ["Next.js", "Framer Motion"],
        projectLinks: [{ label: "Live", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "Fluid Reveal",
        description: "Logo animation using smoke and fluid simulations.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-set-of-ink-strokes-black-on-white-background-412-large.mp4",
        techStack: ["Blender", "After Effects"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Sci-Fi HUD",
        description: "Advanced interface animations for cinematic sci-fi shorts.",
        projectIcon: "Eye",
        mockupImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
        techStack: ["C4D", "Octane"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Abstract Loops",
        description: "Set of 50+ background loops for live performances.",
        projectIcon: "Sparkles",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ink-smoke-spreading-in-water-433-large.mp4",
        techStack: ["Resolume", "VFX"],
        projectLinks: [{ label: "Gumroad", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Typography Blast",
        description: "Expressive kinetic typography for music labels.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-white-smoke-on-black-background-434-large.mp4",
        techStack: ["After Effects", "Type"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Neon Nights",
        description: "Retro-futuristic style frame animations.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1543128939-66ec96b02660?auto=format&fit=crop&q=80&w=800",
        techStack: ["VHS", "Retrowave"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      }
    ]
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Professional storytelling through seamless cuts and high-impact results.",
    detailedDescription: "Great editing is about more than just cutting clips—it's about finding the rhythm.",
    accentColor: "#f59e0b",
    projectsUrl: "/projects#video-editing",
    projectsLabel: "View More",
    providedServices: ["Commercial Editing", "YouTube Content", "Color Grading"],
    contents: [
      {
        type: "project",
        title: "CineVlog",
        description: "Travel series with cinematic pacing and color grading.",
        projectIcon: "Film",
        mockupImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-clipping-together-a-video-on-a-computer-screen-41012-large.mp4",
        bgColor: "#fffbeb",
        techStack: ["Premiere Pro", "Lut Pack"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Adrenaline",
        description: "High-impact editing for extreme sports campaigns.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-person-surfing-in-the-ocean-at-sunset-2451-large.mp4",
        bgColor: "#0f172a",
        techStack: ["DaVinci Resolve", "Speed Ramp"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      },
      {
        type: "project",
        title: "Corporate Reel",
        description: "Narrative-driven editing for tech firm reports.",
        projectIcon: "Film",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-professional-video-editing-software-41008-large.mp4",
        bgColor: "#f8fafc",
        techStack: ["FCPX", "Audio FX"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Food Travel",
        description: "Fast-paced editing for culinary destination guides.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-video-editor-at-work-41005-large.mp4",
        techStack: ["Premiere", "After Effects"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Wedding Cinematic",
        description: "Emotional storytelling with deep color grading.",
        projectIcon: "Film",
        mockupImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800",
        techStack: ["Color Grade", "Storytelling"],
        projectLinks: [{ label: "Vimeo", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Gaming Recap",
        description: "High-energy montages for e-sports events.",
        projectIcon: "Cpu",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-playing-a-video-game-on-a-computer-screen-41013-large.mp4",
        techStack: ["NLE", "Audio Design"],
        projectLinks: [{ label: "Twitch", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Tech Review",
        description: "Clean, professional editing for gadget unboxings.",
        projectIcon: "Monitor",
        mockupImage: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800",
        techStack: ["Overlay", "4K"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Documentary",
        description: "Pacing and narrative focus for impact stories.",
        projectIcon: "Film",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-outside-41010-large.mp4",
        techStack: ["Story", "Subtitles"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Music Video",
        description: "Rhythm-based editing with experimental effects.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
        techStack: ["VFX", "Rhythm"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Fashion Film",
        description: "High-stylized editing for apparel brand launches.",
        projectIcon: "Palette",
        mockupImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        techStack: ["Vogue", "Cinematic"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      }
    ]
  },
  {
    id: "graphics-design",
    title: "Graphics Design",
    description: "Striking visual identities and marketing materials.",
    detailedDescription: "Visual storytelling through professional graphic design.",
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
      },
      {
        type: "project",
        title: "Product Packaging",
        description: "Eco-friendly packaging for organic skincare line.",
        projectIcon: "Package",
        mockupImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800",
        techStack: ["Packaging", "3D"],
        projectLinks: [{ label: "Dribbble", url: "#", icon: "Dribbble" }]
      },
      {
        type: "project",
        title: "Social Media Kit",
        description: "Complete template set for influencers and brands.",
        projectIcon: "Instagram",
        mockupImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
        techStack: ["Figma", "Social"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "Minimalist Poster",
        description: "Award-winning geometric poster series.",
        projectIcon: "Layers",
        mockupImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
        techStack: ["InDesign", "Print"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Editorial Design",
        description: "Layout design for a premium fashion magazine.",
        projectIcon: "Book",
        mockupImage: "https://images.unsplash.com/photo-1544434153-f8121d740561?auto=format&fit=crop&q=80&w=800",
        techStack: ["Layout", "Typography"],
        projectLinks: [{ label: "MagCloud", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Typographic ID",
        description: "Custom font-driven identity for a gallery.",
        projectIcon: "PenTool",
        mockupImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        techStack: ["Glyphs", "AI"],
        projectLinks: [{ label: "Typekit", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Illustrative Pack",
        description: "Set of 2D characters for a mobile game.",
        projectIcon: "Image",
        mockupImage: "https://images.unsplash.com/photo-1456086272160-b28b0645b729?auto=format&fit=crop&q=80&w=800",
        techStack: ["Procreate", "SVG"],
        projectLinks: [{ label: "Lottie", url: "#", icon: "Zap" }]
      },
      {
        type: "project",
        title: "UX Illustrations",
        description: "Story-driven assets for onboarding flows.",
        projectIcon: "Sparkles",
        mockupImage: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&q=80&w=800",
        techStack: ["Humaans", "UnDraw"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      },
      {
        type: "project",
        title: "Iconography Set",
        description: "200+ specialized technical vector icons.",
        projectIcon: "Layout",
        mockupImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
        techStack: ["Vector", "Icon"],
        projectLinks: [{ label: "Icons", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Brand Book",
        description: "100-page comprehensive guidelines for a bank.",
        projectIcon: "FileText",
        mockupImage: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=800",
        techStack: ["Guidelines", "PDF"],
        projectLinks: [{ label: "PDF Viewer", url: "#", icon: "ExternalLink" }]
      }
    ]
  },
  {
    id: "web-design",
    title: "Web Design",
    description: "High-performance websites and interactive web applications.",
    detailedDescription: "We build modern web solutions focused on performance and UX.",
    accentColor: "#0d9488",
    projectsUrl: "/projects#web",
    projectsLabel: "View More",
    providedServices: ["Full Stack Apps", "Landing Pages", "CMS Development"],
    contents: [
      {
        type: "project",
        title: "FinFlow Dashboard",
        description: "Real-time crypto and fiat management platform.",
        projectIcon: "Activity",
        mockupImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        techStack: ["TypeScript", "Recharts"],
        projectLinks: [{ label: "Demo", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "AgroTech Hub",
        description: "Smart farming dashboard with satellite integration.",
        mockupImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
        projectIcon: "Cpu",
        bgColor: "#f0fdfa",
        techStack: ["React", "Go"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      },
      {
        type: "project",
        title: "E-Shop Pro",
        description: "High-performance headless commerce storefront.",
        projectIcon: "ShoppingBag",
        mockupImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
        techStack: ["Next.js", "Shopify"],
        projectLinks: [{ label: "Store", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "DevPortfolio",
        description: "Modern architectural portfolio for a lead dev.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        techStack: ["Three.js", "GSAP"],
        projectLinks: [{ label: "Live", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "SaaS Landing",
        description: "Conversion-optimized page for a task tool.",
        projectIcon: "Mouse",
        mockupImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        techStack: ["Tailwind", "React"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "Health Portal",
        description: "Secure patient management and appointment system.",
        projectIcon: "ShieldCheck",
        mockupImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
        techStack: ["Auth", "Node"],
        projectLinks: [{ label: "Portal", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "PropTech Hub",
        description: "Real estate listing platform with 3D tours.",
        projectIcon: "Home",
        mockupImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
        techStack: ["Maps", "Firebase"],
        projectLinks: [{ label: "App", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "LMS Connect",
        description: "Scalable e-learning platform for schools.",
        projectIcon: "Book",
        mockupImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
        techStack: ["MongoDB", "Redux"],
        projectLinks: [{ label: "Demo", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "Crypto Explorer",
        description: "Blockchain node analyzer and wallet visualizer.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
        techStack: ["Web3", "API"],
        projectLinks: [{ label: "Docs", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Automate UI",
        description: "Visual workflow builder and automation engine.",
        projectIcon: "Settings",
        mockupImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
        techStack: ["Zustand", "DND"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      }
    ]
  },
  {
    id: "application",
    title: "Application",
    description: "Mobile-first experiences designed for the palm of your hand.",
    detailedDescription: "Developing native and hybrid mobile applications with a focus on user engagement.",
    accentColor: "#f43f5e",
    projectsUrl: "/projects#apps",
    projectsLabel: "View More",
    providedServices: ["iOS Development", "Android Development", "React Native"],
    contents: [
      {
        type: "project",
        title: "HealthTrack",
        description: "Comprehensive wellness monitoring app.",
        mockupImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
        projectIcon: "Heart",
        bgColor: "#fff1f2",
        techStack: ["React Native", "Firebase"],
        projectLinks: [{ label: "App Store", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Foodie Finder",
        description: "Social platform for food lovers and reviews.",
        projectIcon: "MapPin",
        mockupImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
        techStack: ["Flutter", "GraphQL"],
        projectLinks: [{ label: "Play Store", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Swift Pay",
        description: "Contactless payment and expense tracker.",
        projectIcon: "CreditCard",
        mockupImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
        techStack: ["Swift", "NFC"],
        projectLinks: [{ label: "Case Study", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "GymGenius",
        description: "AI-powered personal trainer in your pocket.",
        projectIcon: "Cpu",
        mockupImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
        techStack: ["MLKit", "React Native"],
        projectLinks: [{ label: "Expo", url: "#", icon: "Zap" }]
      },
      {
        type: "project",
        title: "TravelLog",
        description: "Offline-first travel journal with map pinning.",
        projectIcon: "Navigation",
        mockupImage: "https://images.unsplash.com/photo-1503220452604-b61a15324029?auto=format&fit=crop&q=80&w=800",
        techStack: ["PWA", "SQLite"],
        projectLinks: [{ label: "Demo", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "Market Master",
        description: "Stock market alerts and portfolio tracker.",
        projectIcon: "TrendingUp",
        mockupImage: "https://images.unsplash.com/photo-1611974717482-aa8a29f8ebde?auto=format&fit=crop&q=80&w=800",
        techStack: ["Next.js", "Vercel"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      },
      {
        type: "project",
        title: "Chat Sphere",
        description: "Encrypted messaging app with voice rooms.",
        projectIcon: "MessageSquare",
        mockupImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        techStack: ["WebRTC", "Socket.io"],
        projectLinks: [{ label: "Open Beta", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "EduQuest",
        description: "Gamified learning platform for middle schoolers.",
        projectIcon: "Book",
        mockupImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
        techStack: ["Unity", "C#"],
        projectLinks: [{ label: "Play", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Eco Scanner",
        description: "Scan products to see their environmental impact.",
        projectIcon: "Target",
        mockupImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=800",
        techStack: ["Vision AI", "Dart"],
        projectLinks: [{ label: "App Store", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Home Hub",
        description: "Centralized control for all smart home devices.",
        projectIcon: "Home",
        mockupImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
        techStack: ["MQTT", "Flutter"],
        projectLinks: [{ label: "GitHub", url: "#", icon: "Github" }]
      }
    ]
  },
  {
    id: "ui-ux-design",
    title: "UI UX Design",
    description: "User-centric design systems that balance beauty with simplicity.",
    detailedDescription: "Human-centered design that converts and scales.",
    accentColor: "#3b5bdb",
    projectsUrl: "/projects#uiux",
    projectsLabel: "View More",
    providedServices: ["User Research", "Wireframing", "Prototypes"],
    contents: [
      {
        type: "project",
        title: "Solaris Design",
        description: "Enterprise design system for a global energy firm.",
        projectIcon: "Sun",
        mockupImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        techStack: ["Figma", "Design Ops"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "SkillShift",
        description: "Peer-to-peer skill exchange platform.",
        mockupImage: "https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&q=80&w=800",
        projectIcon: "Globe",
        bgColor: "#edeffa",
        techStack: ["UX", "Product"],
        projectLinks: [{ label: "Dribbble", url: "#", icon: "Dribbble" }]
      },
      {
        type: "project",
        title: "AquaFlow",
        description: "Mobile app for water tracking and hydration goals.",
        projectIcon: "Droplets",
        mockupImage: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80&w=800",
        techStack: ["UI", "Visual Design"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Marketplace UI",
        description: "Modern e-commerce UI kit for luxury brands.",
        projectIcon: "ShoppingBag",
        mockupImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
        techStack: ["Components", "Style Guide"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "Dashboard Pro",
        description: "Custom admin interface for SaaS management.",
        projectIcon: "Layout",
        mockupImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        techStack: ["UX Writing", "Wireframing"],
        projectLinks: [{ label: "Case Study", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Eventify",
        description: "End-to-end event planning and ticketing mobile UX.",
        projectIcon: "Calendar",
        mockupImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
        techStack: ["User Flows", "Prototyping"],
        projectLinks: [{ label: "Dribbble", url: "#", icon: "Dribbble" }]
      },
      {
        type: "project",
        title: "Crypto Pro",
        description: "Simplified crypto wallet UX for non-tech users.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800",
        techStack: ["FinTech", "UI"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "Wellness App",
        description: "Interface design for a mental health therapy app.",
        projectIcon: "Heart",
        mockupImage: "https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&q=80&w=800",
        techStack: ["Research", "Design"],
        projectLinks: [{ label: "Case Study", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Orbit Design",
        description: "Aerospace monitoring dashboard UI kit.",
        projectIcon: "Navigation",
        mockupImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
        techStack: ["High-Fi", "Dark Mode"],
        projectLinks: [{ label: "Figma", url: "#", icon: "Figma" }]
      },
      {
        type: "project",
        title: "Loom UI",
        description: "Creative workspace layout for digital weavers.",
        projectIcon: "Layers",
        mockupImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
        techStack: ["Interaction", "Design"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      }
    ]
  },
  {
    id: "visual-effects",
    title: "Visual Effects",
    description: "High-end cinematic compositing and digital effects.",
    detailedDescription: "Bringing the impossible to life through advanced VFX techniques.",
    accentColor: "#e03131",
    projectsUrl: "/projects#vfx",
    projectsLabel: "View More",
    providedServices: ["Compositing", "Matchmoving", "Cleanup"],
    contents: [
      {
        type: "project",
        title: "Void Realm",
        description: "Sci-fi environment integration and compositing.",
        projectIcon: "Eye",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-star-field-background-913-large.mp4",
        bgColor: "#fef2f2",
        techStack: ["Nuke", "Houdini"],
        projectLinks: [{ label: "Showreel", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Cyber City",
        description: "Atmospheric neon city projection mapping.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-scifi-city-at-night-with-flying-vehicles-41014-large.mp4",
        techStack: ["Unreal Engine", "VFX"],
        projectLinks: [{ label: "Breakdown", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Fluid Dynamics",
        description: "High-speed liquid splash simulation for commercials.",
        projectIcon: "Droplets",
        mockupImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
        techStack: ["Houdini", "Mantra"],
        projectLinks: [{ label: "Vimeo", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Fire Storm",
        description: "Realistic pyrotechnic effects for action sequences.",
        projectIcon: "Flame",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fire-at-night-in-slow-motion-429-large.mp4",
        techStack: ["PhoenixFD", "Nuke"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      },
      {
        type: "project",
        title: "Magic Portal",
        description: "Particle-based portal effect with light integration.",
        projectIcon: "Zap",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bright-neon-lights-of-a-club-dance-floor-41006-large.mp4",
        techStack: ["After Effects", "VFX"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Robot Head",
        description: "Hard surface modeling and CGI integration in live action.",
        projectIcon: "Cpu",
        mockupImage: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800",
        techStack: ["Maya", "Arnold"],
        projectLinks: [{ label: "Breakdown", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Stormy Sea",
        description: "Large scale ocean simulation and foam generation.",
        projectIcon: "CloudRain",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ocean-waves-crashing-on-rocks-435-large.mp4",
        techStack: ["Houdini", "Redshift"],
        projectLinks: [{ label: "Vimeo", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Time Warp",
        description: "Chrono-visual effect using pixel motion and warping.",
        projectIcon: "Clock",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-curves-of-blue-and-purple-colors-27371-large.mp4",
        techStack: ["Twixtor", "VFX"],
        projectLinks: [{ label: "Showreel", url: "#", icon: "Youtube" }]
      },
      {
        type: "project",
        title: "Ghostly App",
        description: "Apparition effects for horror short film.",
        projectIcon: "Eye",
        mockupImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
        techStack: ["ZBrush", "Nuke"],
        projectLinks: [{ label: "Case Study", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Space Jump",
        description: "Zero-G environment and suit compositing.",
        projectIcon: "Star",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-star-field-background-913-large.mp4",
        techStack: ["Cinema 4D", "VFX"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      }
    ]
  },
  {
    id: "three-d-designing",
    title: "3D Designing",
    description: "Immersive 3D environments and realistic product visualizations.",
    detailedDescription: "Depth and immersion through high-fidelity 3D assets.",
    accentColor: "#0c8599",
    projectsUrl: "/projects#3d",
    projectsLabel: "View More",
    providedServices: ["3D Modeling", "Texturing", "Animation"],
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
      },
      {
        type: "project",
        title: "Bottle 3D",
        description: "Photorealistic product render for health drink.",
        projectIcon: "Package",
        mockupImage: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
        techStack: ["Blender", "Octane"],
        projectLinks: [{ label: "Behance", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Futuristic Chair",
        description: "Industrial design concept with complex geometry.",
        projectIcon: "Layout",
        mockupImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800",
        techStack: ["Rhino", "Keyshot"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      },
      {
        type: "project",
        title: "Terrain Lab",
        description: "Procedural terrain generation for game assets.",
        projectIcon: "Mountain",
        mockupImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
        techStack: ["Gaea", "Unity"],
        projectLinks: [{ label: "Unity Asset", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Watch Mech",
        description: "Anatomical breakdown of a mechanical watch.",
        projectIcon: "Clock",
        mockupImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        techStack: ["CAD", "Rendering"],
        projectLinks: [{ label: "Case Study", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Neon Sneakers",
        description: "E-commerce 3D visualizer for shoe customization.",
        projectIcon: "Zap",
        mockupImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        techStack: ["Three.js", "WebGL"],
        projectLinks: [{ label: "Live", url: "#", icon: "Globe" }]
      },
      {
        type: "project",
        title: "Sci-Fi Vessel",
        description: "Detailed spacecraft model for film production.",
        projectIcon: "Send",
        mockupImage: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
        techStack: ["Substance", "Maya"],
        projectLinks: [{ label: "ArtStation", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Glass Abstract",
        description: "Refractive material study and lighting setup.",
        projectIcon: "Layers",
        mockupImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
        techStack: ["Cycles", "Blender"],
        projectLinks: [{ label: "Instagram", url: "#", icon: "Instagram" }]
      },
      {
        type: "project",
        title: "Eco Architecture",
        description: "3D visualization of sustainable living modules.",
        projectIcon: "Home",
        mockupImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
        techStack: ["V-Ray", "Max"],
        projectLinks: [{ label: "Portfolio", url: "#", icon: "ExternalLink" }]
      },
      {
        type: "project",
        title: "Character Rig",
        description: "Fully rigged and weighted stylized character.",
        projectIcon: "User",
        mockupImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
        techStack: ["Rigging", "Maya"],
        projectLinks: [{ label: "YouTube", url: "#", icon: "Youtube" }]
      }
    ]
  }
];

export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id);
}
