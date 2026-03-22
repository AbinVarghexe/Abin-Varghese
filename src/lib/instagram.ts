function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMetaContent(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]);
    }
  }

  return null;
}

export function isInstagramUrl(value: string) {
  return /https?:\/\/(www\.)?instagram\.com\//i.test(value);
}

export function normalizeInstagramPostUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";

    let pathname = parsed.pathname;
    if (!pathname.endsWith("/")) {
      pathname += "/";
    }

    parsed.pathname = pathname;
    return parsed.toString();
  } catch {
    return url;
  }
}

export function getInstagramMediaUrl(url: string) {
  const normalized = normalizeInstagramPostUrl(url);
  if (!isInstagramUrl(normalized)) {
    return null;
  }

  try {
    const parsed = new URL(normalized);
    parsed.pathname = `${parsed.pathname}media/`;
    parsed.search = "size=l";
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function resolveInstagramPreview(url: string) {
  if (!isInstagramUrl(url)) {
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    return (
      extractMetaContent(html, "og:image") ||
      extractMetaContent(html, "og:image:url") ||
      extractMetaContent(html, "twitter:image")
    );
  } catch (error) {
    console.error("Failed to resolve Instagram preview:", error);
    return null;
  }
}
