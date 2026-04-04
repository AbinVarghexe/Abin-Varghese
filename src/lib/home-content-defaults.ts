export type HomeContent = {
  scrollingBannerItems: string; // Comma separated items
  scrollingLogos: string[]; // Array of logo URLs
};

export const homeContentDefaults: HomeContent = {
  scrollingBannerItems: "Web Developer,Graphic Designer,Video Editor,VFX Artist",
  scrollingLogos: [
    "/uploads/logos/company-1.png",
    "/uploads/logos/company-2.png",
    "/uploads/logos/company-3.png",
  ],
};
