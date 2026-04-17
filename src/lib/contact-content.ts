import { createClient } from "@/utils/supabase/server";
import { 
  type ContactSectionSettings, 
  contactSectionDefaults 
} from "@/types/contact";

const CONTACT_SETTINGS_KEY = "contact_section_settings";


export async function getContactSectionSettings(): Promise<ContactSectionSettings> {
  const supabase = await createClient();
  const { data: record, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", CONTACT_SETTINGS_KEY)
    .single();

  if (error || !record?.value) {
    if (error && error.code !== "PGRST116") { // PGRST116 is code for 'no rows found'
       console.error("Error fetching contact settings:", error);
    }
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: CONTACT_SETTINGS_KEY, value: JSON.stringify(settings) },
      { onConflict: "key" }
    );

  if (error) throw error;
}

export { contactSectionDefaults };
