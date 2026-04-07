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
