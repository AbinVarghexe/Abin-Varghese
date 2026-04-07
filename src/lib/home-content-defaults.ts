export type HomeContent = {
  scrollingBannerItems: string; // Comma separated items
  scrollingLogos: string[]; // Array of logo URLs
  socialLinks: {
    github: string;
    behance: string;
    linkedin: string;
    instagram: string;
  };
  pageLinks: {
    about: string;
    projects: string;
    services: string;
    contact: string;
  };
};

export const homeContentDefaults: HomeContent = {
  scrollingBannerItems: "Web Developer,Graphic Designer,Video Editor,VFX Artist",
  scrollingLogos: [
    "/uploads/logos/company-1.png",
    "/uploads/logos/company-2.png",
    "/uploads/logos/company-3.png",
  ],
  socialLinks: {
    github: "https://github.com/AbinVarghexe",
    behance: "https://www.behance.net/abinvarghese",
    linkedin: "https://www.linkedin.com/in/abinvarghese",
    instagram: "https://www.instagram.com/abinvarghese",
  },
  pageLinks: {
    about: "/about",
    projects: "/projects",
    services: "/services",
    contact: "/contact",
  },
};
