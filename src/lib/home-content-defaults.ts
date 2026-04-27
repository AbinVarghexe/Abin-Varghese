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
    "/uploads/logos/1775313043262-incial.png",
    "/uploads/logos/1775314295868-voltant.png",
    "/uploads/logos/1775314641812-blaupunkt.png",
    "/uploads/logos/1775314941462-manna.png",
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
