export interface ContactSectionSettings {
  introText: string;
  instagramUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  formEnabled: boolean;
}

export const contactSectionDefaults: ContactSectionSettings = {
  introText: "I promise to reply within 24 hours, every time.",
  instagramUrl: "https://www.instagram.com/abeeeein/",
  linkedinUrl: "https://www.linkedin.com/in/toabinvarghese/",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "toabinvarghese@gmail.com",
  formEnabled: true,
};
