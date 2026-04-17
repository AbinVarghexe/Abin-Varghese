export interface ContactSectionSettings {
  introText: string;
  instagramUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  formEnabled: boolean;
}

export const contactSectionDefaults: ContactSectionSettings = {
  introText: "We promise to reply within 24 hours, every time.",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "toabinvarghese@gmail.com",
  formEnabled: true,
};
