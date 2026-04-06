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
}

export const services: Service[] = [
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Breathe life into your brand with dynamic, smooth, and engaging animations.",
    detailedDescription: "Motion graphics are a powerful way to communicate complex ideas quickly and memorably. We combine graphic design principles with cinematic movement to create stunning animations that capture your audience's attention and keep them engaged.",
    accentColor: "#7048e8",
    providedServices: [
      "Logo Animation",
      "Explainer Videos",
      "Social Media Content",
      "UI/App Animations",
      "Title Sequences",
      "Animated Infographics"
    ],
    contents: [
      {
        type: "project",
        title: "Animax Studio",
        description: "A high-end motion design system for a creative production house. Focused on fluidity and brand impact.",
        url: "https://www.behance.net/search/projects?search=motion+graphics",
        date: "Sept 2025",
        duration: "4 Weeks",
        role: "Motion Director",
        projectIcon: "Zap",
        mockupImage: "/services/motion-showcase.png",
        bgColor: "#f3f0ff"
      },
      {
        type: "project",
        title: "Vortex Media",
        description: "A high-energy, 3D broadcast identity for a global sports network. Focused on dynamic particle simulations and cinematic rendering.",
        url: "https://www.behance.net/search/projects?search=broadcast+design",
        date: "Oct 2025",
        duration: "6 Weeks",
        role: "VFX Lead",
        projectIcon: "Zap",
        mockupImage: "/services/vortex-showcase.png",
        bgColor: "#eef2ff"
      },
      {
        type: "project",
        title: "Cyberpunk Identity",
        description: "A neon-infused, futuristic brand identity for an e-sports tournament. Focused on glitches, high-speed camera movements, and toxic-vibe motion design.",
        url: "https://www.behance.net/search/projects?search=cyberpunk+motion+design",
        date: "Feb 2026",
        duration: "3 Weeks",
        role: "Motion Lead",
        projectIcon: "Cpu",
        mockupImage: "/services/cyberpunk-showcase.png",
        bgColor: "#18181b"
      },
      {
        type: "project",
        title: "Lumina 3D Logo",
        description: "A premium, high-fidelity 3D logo animation with fluid dynamics and glassmorphism. Designed to feel elegant and tech-forward.",
        url: "https://www.behance.net/search/projects?search=3d+logo+animation",
        date: "Jan 2026",
        duration: "2 Weeks",
        role: "3D Artist",
        projectIcon: "Box",
        mockupImage: "/services/lumina-showcase.png",
        bgColor: "#fef2f2"
      }
    ]
  },
  {
    id: "video-editing",
    title: "Video Editing",
    description: "Professional storytelling through seamless cuts and high-impact results.",
    detailedDescription: "Great editing is about more than just cutting clips—it's about finding the rhythm and pacing that tells a compelling story. We offer professional post-production services that elevate your raw footage into a polished, impactful masterpiece.",
    accentColor: "#f59e0b",
    providedServices: [
      "Commercial Editing",
      "YouTube Content Editing",
      "Color Grading",
      "Sound Design & Mixing",
      "Corporate Presentations",
      "Event Highlights"
    ],
    contents: [
      {
        type: "project",
        title: "Vlog Series",
        description: "Consistency across a multi-episode travel series with cinematic pacing and color grading.",
        date: "Aug 2025",
        duration: "Ongoing",
        role: "Lead Editor",
        projectIcon: "Film",
        mockupImage: "/services/video-showcase.png",
        bgColor: "#fffbeb"
      }
    ]
  },
  {
    id: "graphics-design",
    title: "Graphics Design",
    description: "Striking visual identities that resonate with your audience.",
    detailedDescription: "Visual identity is the first impression your brand makes. We create thoughtful, strategic designs that communicate your values and distinguish you from the competition. From logos to marketing collateral, we build designs that last.",
    accentColor: "#be4bdb",
    providedServices: [
      "Brand Identity & Logo Design",
      "Print Media & Posters",
      "Social Media Graphics",
      "Marketing Collateral",
      "Illustration & Iconography",
      "Packaging Design"
    ],
    contents: [
      {
        type: "project",
        title: "Nordic Coffee",
        description: "Minimalist brand identity and packaging design for a premium sustainable coffee roastery.",
        date: "Oct 2025",
        duration: "3 Weeks",
        role: "Brand Identity",
        projectIcon: "Palette",
        mockupImage: "/services/graphics-showcase.png",
        bgColor: "#f8f0fc"
      }
    ]
  },
  {
    id: "ui-ux-design",
    title: "UI UX Design",
    description: "User-centric design systems that balance beauty with intuitive functionality.",
    detailedDescription: "We design digital experiences that are as functional as they are beautiful. By focusing on the user's journey, we create intuitive interfaces that solve problems and drive results for your business.",
    accentColor: "#3b5bdb",
    providedServices: [
      "User Interface Design",
      "User Experience Research",
      "Wireframing & Prototyping",
      "Design Systems",
      "Responsive Web Design",
      "Mobile App Design"
    ],
    contents: [
      {
        type: "project",
        title: "SkillShift",
        description: "A peer-to-peer platform enabling users to exchange skills without money. Empowering communities.",
        date: "July 2025",
        duration: "2-3 Weeks",
        role: "Solo Designer",
        projectIcon: "Globe",
        mockupImage: "/services/skillshift-mockup.png",
        bgColor: "#edeffa"
      }
    ]
  },
  {
    id: "web-design",
    title: "Web Design",
    description: "High-performance, responsive websites built for the modern web.",
    detailedDescription: "Your website is your global storefront. We build high-performance, responsive websites that not only look incredible but are optimized for speed, SEO, and conversion—turning visitors into loyal customers.",
    accentColor: "#0d9488",
    providedServices: [
      "Custom Website Design",
      "Landing Page Optimization",
      "E-commerce Experiences",
      "Portfolio & Personal Sites",
      "CMS Development",
      "Interactive Web Experiences"
    ],
    contents: [
      {
        type: "project",
        title: "AgroTech Hub",
        description: "A modern, high-conversion landing page for an agricultural technology startup.",
        date: "Nov 2025",
        duration: "2 Weeks",
        role: "Full Stack UI",
        projectIcon: "Cpu",
        mockupImage: "/services/web-showcase.png",
        bgColor: "#f0fdfa"
      }
    ]
  },
  {
    id: "visual-effects",
    title: "Visual Effects",
    description: "High-end cinematic compositing and digital effects.",
    detailedDescription: "Visual effects allow you to create worlds and scenes that are impossible to capture on camera. We provide professional VFX services that seamlessly blend digital elements with live-action footage to create cinematic results.",
    accentColor: "#e03131",
    providedServices: [
      "Digital Compositing",
      "Green Screen Removal",
      "3D Asset Integration",
      "Particle & Fluid Simulations",
      "Cleanup & Retouching",
      "Matte Painting"
    ],
    contents: [
      {
        type: "project",
        title: "Void Realm",
        description: "Complex digital environments and seamless integration for a sci-fi short film project.",
        date: "Dec 2025",
        duration: "5 Weeks",
        role: "VFX Artist",
        projectIcon: "Eye",
        mockupImage: "/services/vfx-showcase.png",
        bgColor: "#fef2f2"
      }
    ]
  },
  {
    id: "three-d-designing",
    title: "3D Designing",
    description: "Immersive 3D environments and realistic product visualizations.",
    detailedDescription: "3D design brings depth and immersion to your visual projects. Whether it's realistic product renders, architectural visualizations, or character design, we create high-quality 3D assets that provide a unique perspective.",
    accentColor: "#0c8599",
    providedServices: [
      "3D Modeling",
      "Product Visualization",
      "Architectural Rendering",
      "Character Design",
      "3D Animation",
      "Texturing & Lighting"
    ],
    contents: [
      {
        type: "project",
        title: "Lumina Watch",
        description: "Photorealistic 3D product visualization for a premium watch brand, focusing on materials and lighting.",
        date: "Jan 2026",
        duration: "2 Weeks",
        role: "3D Specialist",
        projectIcon: "Box",
        mockupImage: "/services/3d-showcase.png",
        bgColor: "#f0f9ff"
      },
      {
        type: "image",
        title: "3D Abstract",
        description: "A complex 3D scene.",
        url: "/3d_model/cube_cascade.glb"
      }
    ]
  }
];

export function getServiceById(id: string): Service | undefined {
  return services.find(service => service.id === id);
}
