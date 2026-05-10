import { createClient } from "./client";

/**
 * Uploads a file to Supabase Storage and returns the public URL
 */
export async function uploadToStorage(
  file: File | Blob,
  bucket: string = "projects",
  path?: string
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = createClient();
  
  try {
    // Extract real extension if it's a File object, otherwise fallback to generic
    let fileExt = "png";
    if (file instanceof File) {
      const parts = file.name.split(".");
      if (parts.length > 1) {
        fileExt = parts.pop()?.toLowerCase() || "png";
      }
    } else if (file.type) {
      // Try to get extension from mime type
      const mimeExt = file.type.split("/")[1];
      if (mimeExt) fileExt = mimeExt;
    }

    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(`[Supabase Storage] Upload failed for bucket "${bucket}":`, uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Storage upload error details:", {
      message: error?.message || "Unknown error",
      error: error,
      bucket
    });
    return { url: null, error };
  }
}
