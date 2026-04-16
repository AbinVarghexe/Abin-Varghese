export type PinMediaType = "image" | "video" | "model";

export interface PinterestPin {
  id: string;
  title: string;
  description: string;
  mediaType: PinMediaType;
  mediaPath: string;
  modelPath?: string;
  board: string;
  author: string;
  tags: string[];
  dominantColor: string;
  previewHeight: number;
  likes: number;
}

const MODEL_PREVIEW_IMAGES = [
  "/about/Abin_1.png",
  "/about/Abin_2.png",
  "/about/Abin_3.png",
  "/about/Abin_4.png",
  "/about/keyboard-realistic.png",
  "/mockups/hand_held_phone.png",
  "/projects/ecommerce.jpg",
  "/projects/weather.jpg",
];

function getDeterministicIndex(seed: string, mod: number) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % mod;
}

function getModelPreviewImage(seed: string) {
  return MODEL_PREVIEW_IMAGES[getDeterministicIndex(seed, MODEL_PREVIEW_IMAGES.length)];
}

export const pinterestPins: PinterestPin[] = [
  {
    id: "floating-drone-concept",
    title: "Floating drone concept build",
    description:
      "A visual study that combines mechanical forms, atmospheric color, and product storytelling.",
    mediaType: "model",
    mediaPath: getModelPreviewImage("floating-drone-concept"),
    modelPath: "/3d_model/mech_drone.glb",
    board: "3D Boards",
    author: "Abin",
    tags: ["3d", "mech", "concept", "cinematic"],
    dominantColor: "#1f2937",
    previewHeight: 420,
    likes: 824,
  },
  {
    id: "typewriter-atmosphere",
    title: "Typewriter atmosphere reel",
    description:
      "A moody motion loop used in a hero section with textured overlays and grain.",
    mediaType: "video",
    mediaPath: "/Typewritter.mp4",
    board: "Motion Moodboard",
    author: "Abin",
    tags: ["video", "typewriter", "hero", "motion"],
    dominantColor: "#312e81",
    previewHeight: 360,
    likes: 1023,
  },
  {
    id: "keyboard-render-study",
    title: "Keyboard render study",
    description:
      "A high-contrast keyboard composition used for hardware-inspired UI stories.",
    mediaType: "image",
    mediaPath: "/about/keyboard-realistic.png",
    board: "Visual Language",
    author: "Abin",
    tags: ["image", "keyboard", "render", "product"],
    dominantColor: "#111827",
    previewHeight: 470,
    likes: 542,
  },
  {
    id: "blog-cms-showcase",
    title: "Blog CMS showcase card",
    description:
      "Project thumbnail presenting a clean editorial experience for dashboard UIs.",
    mediaType: "image",
    mediaPath: "/projects/blog-cms.jpg",
    board: "Product Case Studies",
    author: "Abin",
    tags: ["image", "web", "dashboard", "content"],
    dominantColor: "#0f172a",
    previewHeight: 390,
    likes: 691,
  },
  {
    id: "ecommerce-campaign",
    title: "E-commerce campaign panel",
    description:
      "Lifestyle-focused storefront composition balancing product and utility.",
    mediaType: "image",
    mediaPath: "/projects/ecommerce.jpg",
    board: "Product Case Studies",
    author: "Abin",
    tags: ["image", "commerce", "ui", "campaign"],
    dominantColor: "#1e293b",
    previewHeight: 340,
    likes: 776,
  },
  {
    id: "flying-bot-model",
    title: "Flying bot model preview",
    description:
      "Exploration pin for lightweight robotic movement and playful hard-surface styling.",
    mediaType: "model",
    mediaPath: getModelPreviewImage("flying-bot-model"),
    modelPath: "/3d_model/flying_bot.glb",
    board: "3D Boards",
    author: "Abin",
    tags: ["3d", "bot", "prototype", "motion"],
    dominantColor: "#374151",
    previewHeight: 410,
    likes: 934,
  },
  {
    id: "butterfly-motion-loop",
    title: "Butterfly motion loop",
    description:
      "A fluid particle-like video sequence that works as an ambient visual anchor.",
    mediaType: "video",
    mediaPath: "/services/butterfly_gs.mp4",
    board: "Motion Moodboard",
    author: "Abin",
    tags: ["video", "butterfly", "ambient", "loop"],
    dominantColor: "#14532d",
    previewHeight: 430,
    likes: 618,
  },
  {
    id: "abin-portrait-note",
    title: "Portrait note collage",
    description:
      "Warm portrait treatment with scrapbook framing for personal storytelling pages.",
    mediaType: "image",
    mediaPath: "/about/abin-varghese.png",
    board: "Profile Story",
    author: "Abin",
    tags: ["image", "portrait", "collage", "story"],
    dominantColor: "#6b7280",
    previewHeight: 500,
    likes: 458,
  },
  {
    id: "task-app-mobile",
    title: "Task app mobile card",
    description:
      "Compact project card focused on utility-first interactions and sticky priorities.",
    mediaType: "image",
    mediaPath: "/projects/task-app.jpg",
    board: "Product Case Studies",
    author: "Abin",
    tags: ["image", "mobile", "task", "productivity"],
    dominantColor: "#1e1b4b",
    previewHeight: 370,
    likes: 337,
  },
  {
    id: "cloud-environment",
    title: "Cloud environment plate",
    description:
      "A soft atmospheric plate used as a base for text overlays and motion graphics.",
    mediaType: "image",
    mediaPath: "/Home/cloud.jpg",
    board: "Background Ideas",
    author: "Abin",
    tags: ["image", "sky", "background", "atmosphere"],
    dominantColor: "#0ea5e9",
    previewHeight: 320,
    likes: 512,
  },
  {
    id: "cube-cascade-object",
    title: "Cube cascade object",
    description:
      "Modular 3D object for abstract hero experiments and tool launchers.",
    mediaType: "model",
    mediaPath: getModelPreviewImage("cube-cascade-object"),
    modelPath: "/3d_model/cube_cascade.glb",
    board: "3D Boards",
    author: "Abin",
    tags: ["3d", "abstract", "geometry", "hero"],
    dominantColor: "#111827",
    previewHeight: 450,
    likes: 880,
  },
  {
    id: "typewriter-alpha-pass",
    title: "Typewriter alpha pass",
    description:
      "Transparent cutout loop intended for compositing over patterned backgrounds.",
    mediaType: "video",
    mediaPath: "/Typewritter-alpha.webm",
    board: "Motion Moodboard",
    author: "Abin",
    tags: ["video", "alpha", "typewriter", "compositing"],
    dominantColor: "#312e81",
    previewHeight: 395,
    likes: 267,
  },
  {
    id: "phone-mockup-shot",
    title: "Phone mockup shot",
    description:
      "Device-centric storytelling card built for launch pages and app reveals.",
    mediaType: "image",
    mediaPath: "/mockups/hand_held_phone.png",
    board: "Launch Concepts",
    author: "Abin",
    tags: ["image", "mockup", "phone", "launch"],
    dominantColor: "#0f172a",
    previewHeight: 480,
    likes: 743,
  },
  {
    id: "weather-dashboard-preview",
    title: "Weather dashboard preview",
    description:
      "A crisp weather interface pin with quick-glance components and card rhythm.",
    mediaType: "image",
    mediaPath: "/projects/weather.jpg",
    board: "Product Case Studies",
    author: "Abin",
    tags: ["image", "weather", "dashboard", "widgets"],
    dominantColor: "#0369a1",
    previewHeight: 350,
    likes: 402,
  },
  {
    id: "abin-frame-stack",
    title: "Abin frame stack",
    description:
      "A portrait stack used for timeline-style layouts and profile-driven sections.",
    mediaType: "image",
    mediaPath: "/about/Abin_3.png",
    board: "Profile Story",
    author: "Abin",
    tags: ["image", "portrait", "profile", "timeline"],
    dominantColor: "#4b5563",
    previewHeight: 440,
    likes: 291,
  },
  // --- Augmented Graphic Design Pins ---
  {
    id: "minimalist-branding-study",
    title: "Minimalist Branding Study",
    description: "Exploration of negative space and clean sans-serif typography for modern brand identities.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1586717799252-bd134300364e?auto=format&fit=crop&q=80",
    board: "Visual Language",
    author: "Design Curator",
    tags: ["graphic", "branding", "minimalist", "typography"],
    dominantColor: "#f3f4f6",
    previewHeight: 520,
    likes: 1240,
  },
  {
    id: "neo-swiss-poster",
    title: "Neo-Swiss Poster Series",
    description: "A tribute to mid-century Swiss design with a contemporary grid and bold primary colors.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80",
    board: "Graphic Archives",
    author: "Poster Lab",
    tags: ["poster", "graphic", "grid", "swiss"],
    dominantColor: "#e11d48",
    previewHeight: 640,
    likes: 856,
  },
  {
    id: "kinetic-type-exploration",
    title: "Kinetic Type Exploration",
    description: "Experimental typography that plays with perspective and fluid movement.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80",
    board: "Typography WIP",
    author: "Abin",
    tags: ["typography", "graphic", "experimental", "type"],
    dominantColor: "#18181b",
    previewHeight: 480,
    likes: 2100,
  },
  {
    id: "organic-logo-marks",
    title: "Organic Logo Marks",
    description: "Set of hand-drawn logos inspired by nature and sustainable brand values.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1541462608141-ad603d335f08?auto=format&fit=crop&q=80",
    board: "Branding Kit",
    author: "Logo Studio",
    tags: ["logo", "branding", "graphic", "organic"],
    dominantColor: "#064e3b",
    previewHeight: 380,
    likes: 432,
  },
  {
    id: "abstract-collage-study",
    title: "Abstract Collage Study",
    description: "Mixed media composition blending vintage textures with digital geometric overlays.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&q=80",
    board: "Visual Language",
    author: "Collage Master",
    tags: ["collage", "graphic", "texture", "abstract"],
    dominantColor: "#44403c",
    previewHeight: 560,
    likes: 912,
  },
  {
    id: "bold-editorial-layout",
    title: "Bold Editorial Layout",
    description: "Magazine spread design featuring asymmetric grids and large scale typography.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1493421419110-74f4e85911ce?auto=format&fit=crop&q=80",
    board: "Editorial Design",
    author: "Print Lab",
    tags: ["graphic", "editorial", "layout", "print"],
    dominantColor: "#ffffff",
    previewHeight: 410,
    likes: 745,
  },
  {
    id: "color-palette-generator",
    title: "Color Palette Harmony",
    description: "Exploration of vibrant gradients and their application in digital UI components.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&q=80",
    board: "Color Theory",
    author: "UI Labs",
    tags: ["graphic", "color", "gradient", "palette"],
    dominantColor: "#3b82f6",
    previewHeight: 320,
    likes: 1890,
  },
  {
    id: "geometric-branding-kit",
    title: "Geometric Branding Kit",
    description: "A cohesive brand identity built entirely on primitive geometric construction.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1603504342261-f3b174826f0f?auto=format&fit=crop&q=80",
    board: "Identity Systems",
    author: "Abin",
    tags: ["branding", "graphic", "geometry", "logo"],
    dominantColor: "#0f172a",
    previewHeight: 490,
    likes: 678,
  },
  {
    id: "urban-poster-vibe",
    title: "Urban Poster Vibe",
    description: "Gritty, texture-heavy poster design for local music events and underground scenes.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1502139270701-f2f2ac6a73c9?auto=format&fit=crop&q=80",
    board: "Graphic Archives",
    author: "Street Art Co.",
    tags: ["poster", "graphic", "texture", "urban"],
    dominantColor: "#1c1917",
    previewHeight: 610,
    likes: 1104,
  },
  {
    id: "glassmorphism-ui-kit",
    title: "Glassmorphism UI Elements",
    description: "Testing frosted glass effects for high-end dashboard and mobile app interfaces.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80",
    board: "Visual Language",
    author: "Interface Lab",
    tags: ["graphic", "ui", "glassmorphism", "design system"],
    dominantColor: "#dbeafe",
    previewHeight: 370,
    likes: 567,
  },
  {
    id: "minimal-line-art-identity",
    title: "Minimal Line Art Identity",
    description: "Single-line illustrations used as a primary brand element for a lifestyle startup.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80",
    board: "Visual Language",
    author: "Illustrate Co.",
    tags: ["graphic", "illustration", "lineart", "branding"],
    dominantColor: "#f5f5f4",
    previewHeight: 450,
    likes: 823,
  },
  {
    id: "vibrant-typography-poster",
    title: "Vibrant Typography Poster",
    description: "High-contrast color play with oversized serif fonts for a bold visual statement.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1551334787-21e6bd3ab135?auto=format&fit=crop&q=80",
    board: "Graphic Archives",
    author: "Type Studio",
    tags: ["poster", "graphic", "typography", "vibrant"],
    dominantColor: "#fde047",
    previewHeight: 580,
    likes: 2450,
  },
  {
    id: "brand-identity-stationery",
    title: "Brand Identity Stationery",
    description: "Physical mockup of a complete brand system on premium paper stock.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80",
    board: "Branding Kit",
    author: "Mockup Lab",
    tags: ["branding", "graphic", "mockup", "stationery"],
    dominantColor: "#e5e7eb",
    previewHeight: 430,
    likes: 789,
  },
  {
    id: "vaporwave-vibe-graphic",
    title: "Vaporwave Aesthetic Graphic",
    description: "80s-inspired digital art project using neon gradients and retro-grid elements.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80",
    board: "Visual Language",
    author: "Retro Lab",
    tags: ["graphic", "abstract", "gradient", "retro"],
    dominantColor: "#c084fc",
    previewHeight: 540,
    likes: 1560,
  },
  {
    id: "bauhaus-influence-poster",
    title: "Bauhaus Influence Poster",
    description: "Modern reinterpretation of Bauhaus principles using simple forms and balance.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80",
    board: "Graphic Archives",
    author: "Abin",
    tags: ["poster", "graphic", "bauhaus", "balance"],
    dominantColor: "#ea580c",
    previewHeight: 470,
    likes: 934,
  },
  {
    id: "environmental-branding-shot",
    title: "Environmental Branding",
    description: "Visualizing a brand within a physical retail space through signage and interiors.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80",
    board: "Branding Kit",
    author: "Space Design",
    tags: ["branding", "graphic", "environment", "signage"],
    dominantColor: "#d4d4d8",
    previewHeight: 510,
    likes: 621,
  },
  {
    id: "minimalist-book-cover",
    title: "Minimalist Book Cover",
    description: "Editorial study for a series of technical books using symbols and high contrast.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1557264305-7e2764da873b?auto=format&fit=crop&q=80",
    board: "Editorial Design",
    author: "Abin",
    tags: ["graphic", "editorial", "book", "minimal"],
    dominantColor: "#09090b",
    previewHeight: 620,
    likes: 345,
  },
  {
    id: "abstract-design-system-map",
    title: "Design System Mapping",
    description: "Visualizing the components and connections within a complex multi-platform system.",
    mediaType: "image",
    mediaPath: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80",
    board: "Product Case Studies",
    author: "System Lab",
    tags: ["graphic", "design system", "abstract", "mapping"],
    dominantColor: "#a78bfa",
    previewHeight: 400,
    likes: 876,
  },
];

export function getPinById(id: string) {
  return pinterestPins.find((pin) => pin.id === id);
}

export function getRelatedPins(targetPin: PinterestPin, limit = 8) {
  return pinterestPins
    .filter((pin) => pin.id !== targetPin.id)
    .map((pin) => {
      const overlap = pin.tags.filter((tag) => targetPin.tags.includes(tag)).length;
      const sameBoard = pin.board === targetPin.board ? 2 : 0;
      const score = overlap * 3 + sameBoard;
      return { pin, score };
    })
    .sort((a, b) => b.score - a.score || b.pin.likes - a.pin.likes)
    .slice(0, limit)
    .map((entry) => entry.pin);
}
