export const siteConfig = {
  name: "Abin Varghese",
  siteName: "Abin Varghese Portfolio",
  defaultTitle: "Abin Varghese | Front-End Developer & UI/UX Designer",
  description:
    "Portfolio of Abin Varghese, a front-end developer and UI/UX designer building performant Next.js experiences, modern interfaces, and conversion-focused digital products.",
  locale: "en_IN",
  creator: "Abin Varghese",
  twitterHandle: "@abin_varghese",
  navigation: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ],
} as const;

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (configuredSiteUrl && configuredSiteUrl.length > 0
  ? configuredSiteUrl
  : "https://abinvarghese.me"
).replace(/\/+$/, "");

export const defaultOgImage = `${siteUrl}/profile.jpg`;

export function getAbsoluteUrl(path = "/") {
  return new URL(path.startsWith("/") ? path : `/${path}`, siteUrl).toString();
}
