import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a URL from an HTML embed code (like a Vimeo or YouTube iframe).
 * If the input is already a URL, it returns it as is.
 */
export function extractUrlFromEmbed(text: string | null | undefined): string {
  if (!text) return "";
  
  const trimmed = text.trim();
  
  // If it's already a clean URL, return it
  if (trimmed.startsWith('http') && !trimmed.includes('<')) return trimmed;
  
  // Look for src attribute in an iframe tag
  const iframeSrcMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    return iframeSrcMatch[1].replace(/&amp;/g, '&');
  }

  // Look for any src attribute if iframe match failed (fallback)
  const anySrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (anySrcMatch && anySrcMatch[1]) {
    return anySrcMatch[1].replace(/&amp;/g, '&');
  }
  
  return trimmed;
}
