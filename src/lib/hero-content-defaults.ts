export type HeroContent = {
  heroGreeting: string;
  heroName: string;
  heroSubcopy: string;
  heroAudienceTags: string; // Comma separated, e.g. "AV,UI,UX,FD,NX"
  heroAvailabilityText: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryUrl: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryUrl: string;
};

export const heroContentDefaults: HeroContent = {
  heroGreeting: "Hi, Guys 👋 I'm",
  heroName: "Abin Varghese.",
  heroSubcopy: "I design with purpose and build with precision every pixel and every line of code is intentional. Currently studying CS, already creating work that goes beyond the classroom.",
  heroAudienceTags: "AV,UI,UX,FD,NX",
  heroAvailabilityText: "Full-Stack Developer · UI/UX Designer · Kerala, IN.",
  heroCtaPrimaryLabel: "View Projects",
  heroCtaPrimaryUrl: "/projects",
  heroCtaSecondaryLabel: "Book a Call",
  heroCtaSecondaryUrl: "https://cal.com/abinvarghexe",
};
