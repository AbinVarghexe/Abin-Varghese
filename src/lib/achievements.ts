import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export interface Achievement {
  id?: string;
  title: string;
  description: string;
  date: string | null;
  category: string;
  imageUrl: string;
  externalLink: string;
  featured: boolean;
  orderIndex: number;
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("order_index", { ascending: true })
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    category: item.category,
    imageUrl: item.image_url,
    externalLink: item.external_link,
    featured: item.featured,
    orderIndex: item.order_index,
  }));
}

export async function upsertAchievement(achievement: Achievement): Promise<void> {
  const supabase = createAdminClient();
  
  const payload = {
    ...(achievement.id ? { id: achievement.id } : {}),
    title: achievement.title,
    description: achievement.description,
    date: achievement.date,
    category: achievement.category,
    image_url: achievement.imageUrl,
    external_link: achievement.externalLink,
    featured: achievement.featured,
    order_index: achievement.orderIndex,
  };

  if (achievement.id) {
    const { error } = await supabase
      .from("achievements")
      .upsert(payload, { onConflict: "id" });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("achievements")
      .insert([payload]);
    if (error) throw error;
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw error;
}
