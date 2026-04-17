import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Media uploads will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export async function uploadToStorage(
  file: File | Blob,
  bucket: string = "projects",
  path?: string
): Promise<{ url: string | null; error: any }> {
  try {
    const fileExt = "jpg"; // Default extension
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error("Storage upload error:", error);
    return { url: null, error };
  }
}
