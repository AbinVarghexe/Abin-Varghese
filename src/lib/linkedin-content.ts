import { createClient } from "@/utils/supabase/server";

export interface LinkedinSyncData {
  profileUrl: string;
  connectionsCount: string;
  currentRole: string;
  company: string;
  aboutText: string;
  lastSyncDate: string;
}

export const linkedinSyncDefaults: LinkedinSyncData = {
  profileUrl: "",
  connectionsCount: "500+",
  currentRole: "Software Engineer",
  company: "",
  aboutText: "",
  lastSyncDate: new Date().toISOString(),
};

export async function getLinkedinSyncData(): Promise<LinkedinSyncData> {
  const supabase = await createClient();
  const { data: record, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "linkedin_sync_data")
    .single();

  if (error || !record) {
    return linkedinSyncDefaults;
  }

  try {
    const parsed = JSON.parse(record.value) as Partial<LinkedinSyncData>;
    return {
      profileUrl: parsed.profileUrl || linkedinSyncDefaults.profileUrl,
      connectionsCount: parsed.connectionsCount || linkedinSyncDefaults.connectionsCount,
      currentRole: parsed.currentRole || linkedinSyncDefaults.currentRole,
      company: parsed.company || linkedinSyncDefaults.company,
      aboutText: parsed.aboutText || linkedinSyncDefaults.aboutText,
      lastSyncDate: parsed.lastSyncDate || linkedinSyncDefaults.lastSyncDate,
    };
  } catch {
    return linkedinSyncDefaults;
  }
}

export async function upsertLinkedinSyncData(content: LinkedinSyncData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert([{ key: "linkedin_sync_data", value: JSON.stringify(content) }], { onConflict: "key" });

  if (error) throw error;
}
