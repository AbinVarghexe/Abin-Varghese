import type { HomeContent } from "@/lib/home-content-defaults";
import type { ContactSectionSettings } from "./contact";

export interface SiteCopyReviewItem {
  id: string;
  name: string;
  content: string;
  designation?: string;
  rating: number;
}

export interface SiteCopyCreativeCategory {
  title: string;
  description: string;
  image: string;
  lottieUrl?: string;
}

export interface SiteCopyTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  url?: string;
}

export interface SiteCopyTimelineEntry {
  role: string;
  organization: string;
  duration: string;
  copy: string;
}

export interface SiteCopyComparisonFeature {
  label: string;
  others: boolean;
  me: boolean;
}

export interface SiteCopyFaqItem {
  question: string;
  answer: string;
}

export interface SiteCopyContent {
  heroStatusLine: string;
  homeAboutHeading: string;
  homeAboutBody: string;
  homeAboutCtaLabel: string;
  homeAboutCtaUrl: string;
  homeToolboxHeading: string;
  homeToolboxIntro: string;
  homeToolCategories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  homeTools: SiteCopyTool[];
  homeRecentHeading: string;
  homeRecentIntro: string;
  homeRecentWebTitle: string;
  homeRecentWebCopy: string;
  homeRecentWebCtaLabel: string;
  homeRecentWebProjectIds: string[];
  homeSlidingRoles: string;
  homeCreativeTitle: string;
  homeCreativeCopy: string;
  homeCreativeCtaLabel: string;
  homeCreativeCategories: SiteCopyCreativeCategory[];
  homeServicesHeading: string;
  homeServicesIntro: string;
  homeReviewsHeading: string;
  homeReviewsIntro: string;
  homeReviewsItems: SiteCopyReviewItem[];
  aboutStickyNote: string;
  aboutLowerRightNote: string;
  aboutFooterTag: string;
  aboutIntroTitle: string;
  aboutIntroBody: string;
  aboutBookImage: string;
  aboutTimelineTitle: string;
  aboutTimelineEntries: SiteCopyTimelineEntry[];
  aboutTypewriterQuote: string;
  servicesHeroTitle: string;
  servicesWhyEyebrow: string;
  servicesWhyHeading: string;
  servicesWhyIntro: string;
  servicesWhyCtaLabel: string;
  servicesWhyCtaUrl: string;
  servicesWhyFeatures: SiteCopyComparisonFeature[];
  servicesFaqEyebrow: string;
  servicesFaqHeading: string;
  servicesFaqIntro: string;
  servicesFaqItems: SiteCopyFaqItem[];
  servicesFaqCtaText: string;
  servicesFaqCtaLabel: string;
  contactEyebrow: string;
  contactHeading: string;
  contactSupportLine: string;
  contactGiantText: string;
  footerBrandEyebrow: string;
  footerSupportCopy: string;
  footerEmail: string;
  footerCtaHeading: string;
  footerCtaCopy: string;
  footerCopyright: string;
  footerCredit: string;
  aboutResumeUrl: string;
  aboutDesignResumeUrl: string;
}

export const siteCopyDefaults: SiteCopyContent = {
  heroStatusLine: "Available for freelance projects, collaborations.",
  homeAboutHeading: "About [Me]",
  homeAboutBody:
    "I started out being drawn to visuals, layout systems, and design tools. Over time that pulled me deeper into frontend development and product building, and now I enjoy working on projects where I can shape both the interface and the implementation.",
  homeAboutCtaLabel: "More about",
  homeAboutCtaUrl: "/about",
  homeToolboxHeading: "My Creative [Toolbox]",
  homeToolboxIntro:
    "The tools I use reflect how I work. Some help me design, some help me build, and some help me present ideas more clearly from rough concept to finished product.",
  homeToolCategories: [
    { id: "design", name: "Design Tools", description: "UI, branding, and prototyping" },
    { id: "video", name: "Motion and Video", description: "Motion graphics, editing, and 3D" },
    { id: "development", name: "Development Tools", description: "Frontend engineering and creative coding" },
  ],
  homeTools: [
    { id: "figma", name: "Figma", description: "Interface Design & Prototyping", icon: "https://skillicons.dev/icons?i=figma", category: "design", url: "" },
    { id: "photoshop", name: "Photoshop", description: "Image Manipulation & Editing", icon: "https://skillicons.dev/icons?i=ps", category: "design", url: "" },
    { id: "illustrator", name: "Illustrator", description: "Vector Graphics Software", icon: "https://skillicons.dev/icons?i=ai", category: "design", url: "" },
    { id: "aftereffects", name: "After Effects", description: "VFX & Motion Graphics", icon: "https://skillicons.dev/icons?i=ae", category: "video", url: "" },
    { id: "premiere", name: "Premiere Pro", description: "Video Editing Software", icon: "https://skillicons.dev/icons?i=pr", category: "video", url: "" },
    { id: "blender", name: "Blender", description: "3D Creation Suite", icon: "https://skillicons.dev/icons?i=blender", category: "video", url: "" },
    { id: "davinci", name: "DaVinci Resolve", description: "Color Correction & Editing", icon: "https://cdn.simpleicons.org/davinciresolve", category: "video", url: "" },
    { id: "react", name: "React", description: "UI Library", icon: "https://skillicons.dev/icons?i=react", category: "development", url: "" },
    { id: "nextjs", name: "Next.js", description: "React Framework", icon: "https://skillicons.dev/icons?i=nextjs", category: "development", url: "" },
    { id: "tailwind", name: "Tailwind CSS", description: "Utility-first CSS Framework", icon: "https://skillicons.dev/icons?i=tailwind", category: "development", url: "" },
    { id: "js", name: "JavaScript", description: "Programming Language", icon: "https://skillicons.dev/icons?i=js", category: "development", url: "" },
  ],
  homeRecentHeading: "My Recent [Project's]",
  homeRecentIntro:
    "Exploring the intersection of high-performance engineering and creative visual storytelling across multiple digital disciplines.",
  homeRecentWebTitle: "Web Development",
  homeRecentWebCopy:
    "Building highly-performant, responsive web applications using modern technologies like React, Next.js, and Tailwind CSS. I specialize in turning complex requirements into seamless digital experiences.",
  homeRecentWebCtaLabel: "View Projects",
  homeRecentWebProjectIds: [],
  homeSlidingRoles:
    "Creative Director, UI Designer, Motion Graphics artist, Frontend Engineer, UX Researcher",
  homeCreativeTitle: "Creative [Stuff]",
  homeCreativeCopy:
    "Beyond engineering, I dive deep into visual aesthetics and digital artistry. From cinematic motion graphics to immersive 3D environments, these pieces represent my passion for pushing the boundaries of creative storytelling.",
  homeCreativeCtaLabel: "Contact me",
  homeCreativeCategories: [
    {
      title: "Motion Graphics",
      description: "Bringing static designs to life with fluid animations and cinematic storytelling that captivates audiences.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/5f/13/31/5f1331c04272eb0210b7f42997bc4c5f_720w.mp4"
    },
    {
      title: "UI/UX Design",
      description: "Crafting intuitive, user-centered interfaces that blend aesthetic beauty with seamless functional experiences.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/9d/1f/1f/9d1f1fb1b6004da53df6ae2aa320aeea_720w.mp4"
    },
    {
      title: "Video Production",
      description: "High-quality video editing and direction, focusing on rhythm, color grading, and impactful visual narratives.",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/05/a9/ca/05a9ca456daeb936b7715aaa52477cb2_720w.mp4"
    },
    {
      title: "VFX Animation",
      description: "Creating mind-bending visual effects and high-fidelity animations for a truly immersive digital experience.",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/48/e7/83/48e783773884e91eb65eb4a8bfbeee2c_720w.mp4"
    },
    {
      title: "3D Modeling",
      description: "Developing detailed 3D assets and environments with realistic textures, lighting, and spatial depth.",
      image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/99/25/c4/9925c401f8eaa36ac99d6472df701a84_720w.mp4"
    },
    {
      title: "Visual Branding",
      description: "Designing cohesive brand identities that tell a unique story through color, typography, and iconography.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/bf/1c/a1/bf1ca126169bd06a802f17b1c218416d_720w.mp4"
    },
    {
      title: "Character Design",
      description: "Giving personality to digital entities through expressive character concepts and detailed illustrations.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
      lottieUrl: "https://v1.pinimg.com/videos/iht/expMp4/68/3f/7b/683f7bd1a42b8ac5dd38110fe29ac0e9_720w.mp4"
    }
  ],
  homeServicesHeading: "My [Services]",
  homeServicesIntro:
    "I work with founders, teams, and growing brands on websites, interfaces, brand visuals, and creative assets that need both good design and careful execution.",
  homeReviewsHeading: "Highlights and [Achievements]",
  homeReviewsIntro:
    "This section can hold achievements, recognitions, or real client feedback. It is now fully editable from the admin panel.",
  homeReviewsItems: [
    {
      id: "nasa-space-apps",
      name: "NASA Space Apps",
      content:
        "Best Mission Concept Award in the senior category at NASA Space Apps Challenge 2025, Kanjirappally Local Chapter.",
      designation: "Achievement",
      rating: 0,
    },
    {
      id: "acm-hackathon",
      name: "ACM AJCE",
      content: "Won 1st place out of 150 teams in the UI/UX Hackathon.",
      designation: "Hackathon Result",
      rating: 0,
    },
    {
      id: "kochi-hackathon",
      name: "Kochi Hackathon 2025",
      content: "Shortlisted from 900+ participants in the 36-hour challenge with the AJCE team.",
      designation: "Shortlist",
      rating: 0,
    },
  ],
  aboutStickyNote: "Still learning.\nStill building.",
  aboutLowerRightNote:
    "Most of the work I am proud of started with a simple question: how can this be clearer, better, or more useful? That is still how I approach projects now.",
  aboutFooterTag: "Issue 2026 · Abin Varghese Archive",
  aboutIntroTitle: "Prologue",
  aboutIntroBody:
    "I am Abin, a full-stack developer and UI/UX designer dedicated to building clear, useful products with refined interfaces. My path began with a fascination for typography, layouts, and brand identity, which naturally evolved from pure design into frontend engineering and comprehensive product development.\n\nCurrently, I'm a pre-final year B.Tech student in Computer Science and Engineering with a Minor in VLSI at Amal Jyothi College of Engineering (2023–Present). I approach every project as a real-world product rather than a simple exercise, focusing on solving complex problems and transforming rough concepts into polished, intuitive systems that add genuine value to the user experience.",
  aboutBookImage: "/about/abin-varghese.png",
  aboutTimelineTitle: "Chronicles of Work",
  aboutTimelineEntries: [
    {
      role: "B.Tech Computer Science and Engineering (Minor in VLSI)",
      organization: "Amal Jyothi College of Engineering",
      duration: "2023 to Present",
      copy:
        "Pre-final year student with a 7.19 CGPA, building a strong foundation in software engineering while actively working on real product and design projects.",
    },
    {
      role: "Full Stack Developer and UI/UX Designer",
      organization: "INCIAL",
      duration: "Jan 2024 to Present",
      copy:
        "Working across product design and development for client projects, with a focus on clean interfaces, usable systems, and solid frontend execution.",
    },
    {
      role: "Freelance Full Stack Web Developer",
      organization: "Independent",
      duration: "Mar 2023 to Present",
      copy:
        "Building websites and web apps from planning and design to development, deployment, and handoff.",
    },
    {
      role: "Data Science and Deep Learning Intern",
      organization: "Luminar Technolab, Kochi",
      duration: "Jun 2025",
      copy:
        "Worked on TensorFlow-based models for image classification and explored end-to-end deep learning workflows.",
    },
    {
      role: "Machine Learning Intern",
      organization: "Cognifyz Technologies",
      duration: "Apr 2025 to May 2025",
      copy:
        "Applied machine learning concepts in practical assignments and strengthened hands-on workflow knowledge.",
    },
    {
      role: "DevOps with AI Industry Immersion",
      organization: "NeST Digital Academy, Kochi",
      duration: "Feb 2026",
      copy:
        "Learned AWS, Docker, and AI-assisted DevOps workflows with a focus on deployment pipelines and CI/CD.",
    },
  ],
  aboutTypewriterQuote: "\"Good design gets attention. Good product design keeps it.\"",
  servicesHeroTitle: "Services",
  servicesWhyEyebrow: "Why work with me",
  servicesWhyHeading: "Why work [with me]",
  servicesWhyIntro:
    "I work across both design and development, which means less handoff friction, clearer execution, and better alignment between the original idea and the final product.",
  servicesWhyCtaLabel: "Get Started",
  servicesWhyCtaUrl: "/contact",
  servicesWhyFeatures: [
    { label: "Design and development in one workflow", others: false, me: true },
    { label: "Cleaner handoff between idea and build", others: false, me: true },
    { label: "Strong visual polish", others: true, me: true },
    { label: "Product-minded execution", others: true, me: true },
    { label: "Flexible across creative and technical work", others: false, me: true },
  ],
  servicesFaqEyebrow: "FAQs",
  servicesFaqHeading: "Common [Questions]",
  servicesFaqIntro:
    "A few quick answers about the kind of work I take on and how I usually approach a project.",
  servicesFaqItems: [
    {
      question: "What kind of projects do you usually take on?",
      answer:
        "I usually work on portfolio sites, business websites, admin dashboards, frontend-heavy products, and design-led digital experiences.",
    },
    {
      question: "Do you only design, or do you also build?",
      answer:
        "I do both. One of my strengths is being able to move from interface design into frontend and full-stack implementation without losing the original direction of the work.",
    },
    {
      question: "Are you available for freelance work?",
      answer:
        "Yes. I am open to freelance work, collaborations, and selected longer-term opportunities depending on the scope.",
    },
    {
      question: "Do you work with startups and student-led teams?",
      answer:
        "Yes. I am comfortable working with early-stage ideas and helping shape them into something clearer and more ready to build.",
    },
    {
      question: "How do you usually start a project?",
      answer:
        "I usually start by understanding the goal, audience, required features, and the overall visual direction. After that, I move into structure, design, and implementation in a practical order.",
    },
    {
      question: "Can you help improve an existing product or site?",
      answer:
        "Yes. I can step into an existing product or site to improve the UI, clean up the frontend, refine flows, or make the overall experience feel more consistent.",
    },
  ],
  servicesFaqCtaText: "Could not find the answer you were looking for?",
  servicesFaqCtaLabel: "Contact Me",
  contactEyebrow: "Let's Connect",
  contactHeading: "Let's talk.",
  contactSupportLine:
    "The easiest way to start is with a simple message about what you are working on and where you need help.",
  contactGiantText: "Contact Me",
  footerBrandEyebrow: "Design-led digital work by Abin Varghese.",
  footerSupportCopy:
    "Full-stack development, UI/UX design, branding, and creative visual work from Idukki, Kerala.",
  footerEmail: "toabinvarghese@gmail.com",
  footerCtaHeading: "Have something in mind?",
  footerCtaCopy: "Let's talk.",
  footerCopyright: "ABIN VARGHESE 2026 ©",
  footerCredit: "",
  aboutResumeUrl: "/resume/Abin_Varghese_Resume.pdf",
  aboutDesignResumeUrl: "/resume-designer.pdf",
};

export interface PublicSiteShellContent {
  siteCopy: SiteCopyContent;
  socialLinks: HomeContent["socialLinks"];
  contactSettings: ContactSectionSettings;
}
