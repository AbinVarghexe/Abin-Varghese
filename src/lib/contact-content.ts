import prisma from "@/lib/prisma";

export interface ContactSectionSettings {
  introText: string;
  instagramUrl: string;
  linkedinUrl: string;
  contactEmail: string;
  formEnabled: boolean;
}

const CONTACT_SETTINGS_KEY = "contact_section_settings";

const contactSectionDefaults: ContactSectionSettings = {
  introText: "We promise to reply within 24 hours, every time.",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  contactEmail: "toabinvarghes@gmail.com",
  formEnabled: true,
};

export async function getContactSectionSettings(): Promise<ContactSectionSettings> {
  const record = await prisma.siteContent.findUnique({
    where: { key: CONTACT_SETTINGS_KEY },
  });

  if (!record?.value) {
    return contactSectionDefaults;
  }

  try {
    const parsed = JSON.parse(record.value) as Partial<ContactSectionSettings>;

    return {
      introText: parsed.introText || contactSectionDefaults.introText,
      instagramUrl: parsed.instagramUrl || contactSectionDefaults.instagramUrl,
      linkedinUrl: parsed.linkedinUrl || contactSectionDefaults.linkedinUrl,
      contactEmail: parsed.contactEmail || contactSectionDefaults.contactEmail,
      formEnabled:
        typeof parsed.formEnabled === "boolean"
          ? parsed.formEnabled
          : contactSectionDefaults.formEnabled,
    };
  } catch {
    return contactSectionDefaults;
  }
}

export async function upsertContactSectionSettings(settings: ContactSectionSettings) {
  await prisma.siteContent.upsert({
    where: { key: CONTACT_SETTINGS_KEY },
    update: { value: JSON.stringify(settings) },
    create: { key: CONTACT_SETTINGS_KEY, value: JSON.stringify(settings) },
  });
}

export { contactSectionDefaults };
