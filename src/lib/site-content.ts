import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";
import { heroContentDefaults, type HeroContent } from "@/lib/hero-content-defaults";
import { homeContentDefaults, type HomeContent } from "@/lib/home-content-defaults";

export type BehanceShowcaseEmbed = {
  id: string;
  src: string;
  title: string;
};

const BEHANCE_SHOWCASE_KEY = "behance_showcase_embeds";

export const siteContentDefaults = {
  ...aboutContentDefaults,
  ...heroContentDefaults,
  ...homeContentDefaults,
};

const aboutKeyMap = {
  aboutImage: "about_image",
  homeAboutImage1: "home_about_image_1",
  homeAboutImage2: "home_about_image_2",
  homeAboutImage3: "home_about_image_3",
  aboutInstagramImage1: "about_instagram_image_1",
  aboutInstagramImage2: "about_instagram_image_2",
  aboutInstagramImage3: "about_instagram_image_3",
  aboutInstagramImage4: "about_instagram_image_4",
  aboutInstagramLink1: "about_instagram_link_1",
  aboutInstagramLink2: "about_instagram_link_2",
  aboutInstagramLink3: "about_instagram_link_3",
  aboutInstagramLink4: "about_instagram_link_4",
} as const;

const heroKeyMap = {
  heroGreeting: "hero_greeting",
  heroName: "hero_name",
  heroSubcopy: "hero_subcopy",
  heroAudienceTags: "hero_audience_tags",
  heroAvailabilityText: "hero_availability_text",
  heroCtaPrimaryLabel: "hero_cta_primary_label",
  heroCtaPrimaryUrl: "hero_cta_primary_url",
  heroCtaSecondaryLabel: "hero_cta_secondary_label",
  heroCtaSecondaryUrl: "hero_cta_secondary_url",
} as const;

const homeKeyMap = {
  scrollingBannerItems: "home_scrolling_banner_items",
  scrollingLogos: "home_scrolling_logos",
  socialLinks: "home_social_links",
  otherSocialLinks: "home_other_social_links",
  pageLinks: "home_page_links",
} as const;

export async function getAboutContent(): Promise<AboutContent> {
  const supabase = await createClient();
  const keys = Object.values(aboutKeyMap);
  
  const { data: records, error } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys);

  if (error) {
    console.error("Error fetching about content:", error);
    return siteContentDefaults;
  }

  const values = new Map(records?.map((record) => [record.key, record.value]));

  return {
    aboutImage: values.get(aboutKeyMap.aboutImage) || siteContentDefaults.aboutImage,
    homeAboutImage1: values.get(aboutKeyMap.homeAboutImage1) || siteContentDefaults.homeAboutImage1,
    homeAboutImage2: values.get(aboutKeyMap.homeAboutImage2) || siteContentDefaults.homeAboutImage2,
    homeAboutImage3: values.get(aboutKeyMap.homeAboutImage3) || siteContentDefaults.homeAboutImage3,
    aboutInstagramImage1: values.get(aboutKeyMap.aboutInstagramImage1) || siteContentDefaults.aboutInstagramImage1,
    aboutInstagramImage2: values.get(aboutKeyMap.aboutInstagramImage2) || siteContentDefaults.aboutInstagramImage2,
    aboutInstagramImage3: values.get(aboutKeyMap.aboutInstagramImage3) || siteContentDefaults.aboutInstagramImage3,
    aboutInstagramImage4: values.get(aboutKeyMap.aboutInstagramImage4) || siteContentDefaults.aboutInstagramImage4,
    aboutInstagramLink1: values.get(aboutKeyMap.aboutInstagramLink1) || siteContentDefaults.aboutInstagramLink1,
    aboutInstagramLink2: values.get(aboutKeyMap.aboutInstagramLink2) || siteContentDefaults.aboutInstagramLink2,
    aboutInstagramLink3: values.get(aboutKeyMap.aboutInstagramLink3) || siteContentDefaults.aboutInstagramLink3,
    aboutInstagramLink4: values.get(aboutKeyMap.aboutInstagramLink4) || siteContentDefaults.aboutInstagramLink4,
  };
}

export async function getHeroContent(): Promise<HeroContent> {
  const supabase = await createClient();
  const keys = Object.values(heroKeyMap);
  
  const { data: records, error } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys);

  if (error) {
    console.error("Error fetching hero content:", error);
    return siteContentDefaults;
  }

  const values = new Map(records?.map((record) => [record.key, record.value]));

  return {
    heroGreeting: values.get(heroKeyMap.heroGreeting) || siteContentDefaults.heroGreeting,
    heroName: values.get(heroKeyMap.heroName) || siteContentDefaults.heroName,
    heroSubcopy: values.get(heroKeyMap.heroSubcopy) || siteContentDefaults.heroSubcopy,
    heroAudienceTags: values.get(heroKeyMap.heroAudienceTags) || siteContentDefaults.heroAudienceTags,
    heroAvailabilityText: values.get(heroKeyMap.heroAvailabilityText) || siteContentDefaults.heroAvailabilityText,
    heroCtaPrimaryLabel: values.get(heroKeyMap.heroCtaPrimaryLabel) || siteContentDefaults.heroCtaPrimaryLabel,
    heroCtaPrimaryUrl: values.get(heroKeyMap.heroCtaPrimaryUrl) || siteContentDefaults.heroCtaPrimaryUrl,
    heroCtaSecondaryLabel: values.get(heroKeyMap.heroCtaSecondaryLabel) || siteContentDefaults.heroCtaSecondaryLabel,
    heroCtaSecondaryUrl: values.get(heroKeyMap.heroCtaSecondaryUrl) || siteContentDefaults.heroCtaSecondaryUrl,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const supabase = await createClient();
  const keys = Object.values(homeKeyMap);
  
  const { data: records, error } = await supabase
    .from("site_content")
    .select("key, value")
    .in("key", keys);

  if (error) {
    console.error("Error fetching home content:", error);
    return siteContentDefaults;
  }

  const values = new Map(records?.map((record) => [record.key, record.value]));

  return {
    scrollingBannerItems: values.get(homeKeyMap.scrollingBannerItems) || siteContentDefaults.scrollingBannerItems,
    scrollingLogos: (() => {
      const val = values.get(homeKeyMap.scrollingLogos);
      if (!val) return siteContentDefaults.scrollingLogos;
      try { return JSON.parse(val); } catch { return siteContentDefaults.scrollingLogos; }
    })(),
    socialLinks: (() => {
      const val = values.get(homeKeyMap.socialLinks);
      if (!val) return siteContentDefaults.socialLinks;
      try {
        const parsed = JSON.parse(val) as Partial<HomeContent["socialLinks"]>;
        return {
          github: parsed.github || siteContentDefaults.socialLinks.github,
          behance: parsed.behance || siteContentDefaults.socialLinks.behance,
          linkedin: parsed.linkedin || siteContentDefaults.socialLinks.linkedin,
          instagram: parsed.instagram || siteContentDefaults.socialLinks.instagram,
        };
      } catch {
        return siteContentDefaults.socialLinks;
      }
    })(),
    otherSocialLinks: (() => {
      const val = values.get(homeKeyMap.otherSocialLinks);
      if (!val) return siteContentDefaults.otherSocialLinks;
      try {
        const parsed = JSON.parse(val);
        if (!Array.isArray(parsed)) return siteContentDefaults.otherSocialLinks;
        return parsed
          .map((item) => ({
            id: typeof item?.id === "string" ? item.id : "",
            label: typeof item?.label === "string" ? item.label : "",
            url: typeof item?.url === "string" ? item.url : "",
          }))
          .filter((item) => item.id && item.label);
      } catch {
        return siteContentDefaults.otherSocialLinks;
      }
    })(),
    pageLinks: (() => {
      const val = values.get(homeKeyMap.pageLinks);
      if (!val) return siteContentDefaults.pageLinks;
      try {
        const parsed = JSON.parse(val) as Partial<HomeContent["pageLinks"]>;
        return {
          about: parsed.about || siteContentDefaults.pageLinks.about,
          projects: parsed.projects || siteContentDefaults.pageLinks.projects,
          services: parsed.services || siteContentDefaults.pageLinks.services,
          contact: parsed.contact || siteContentDefaults.pageLinks.contact,
        };
      } catch {
        return siteContentDefaults.pageLinks;
      }
    })(),
  };
}

export async function upsertAboutContent(content: AboutContent) {
  const supabase = createAdminClient();
  const entries = Object.entries(aboutKeyMap).map(([field, key]) => ({
    key,
    value: content[field as keyof AboutContent],
  }));

  const { error } = await supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });

  if (error) throw error;
}

export async function upsertHeroContent(content: HeroContent) {
  const supabase = createAdminClient();
  const entries = Object.entries(heroKeyMap).map(([field, key]) => ({
    key,
    value: (content[field as keyof HeroContent] as string) || "",
  }));

  const { error } = await supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });

  if (error) throw error;
}

export async function upsertHomeContent(content: HomeContent) {
  const supabase = createAdminClient();
  const entries = Object.entries(homeKeyMap).map(([field, key]) => {
    const rawValue = content[field as keyof HomeContent];
    const value =
      field === "scrollingLogos" || field === "socialLinks" || field === "otherSocialLinks" || field === "pageLinks"
        ? JSON.stringify(rawValue)
        : rawValue;
      
    return {
      key,
      value: (value as string) || "",
    };
  });

  const { error } = await supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });

  if (error) throw error;
}

export async function getBehanceShowcaseEmbeds(): Promise<BehanceShowcaseEmbed[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", BEHANCE_SHOWCASE_KEY)
    .maybeSingle();

  if (error) {
    console.error("Error fetching Behance showcase embeds:", error);
    return [];
  }

  if (!data?.value) return [];

  try {
    const parsed = JSON.parse(data.value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item: any) =>
          typeof item?.id === "string" &&
          typeof item?.src === "string" &&
          typeof item?.title === "string"
      )
      .map((item: any) => ({
        id: item.id,
        src: item.src,
        title: item.title,
      }));
  } catch {
    return [];
  }
}

export async function upsertBehanceShowcaseEmbeds(embeds: BehanceShowcaseEmbed[]) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: BEHANCE_SHOWCASE_KEY, value: JSON.stringify(embeds) },
      { onConflict: "key" }
    );

  if (error) throw error;
}

/* ─── Pinterest Showcase Logic ─── */

export type PinterestShowcaseItem = {
  id: string;
  src: string;
  title: string;
};

const PINTEREST_SHOWCASE_KEY = "pinterest_showcase_links";

export async function getPinterestShowcaseItems(): Promise<PinterestShowcaseItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", PINTEREST_SHOWCASE_KEY)
    .maybeSingle();

  if (error) {
    console.error("Error fetching Pinterest showcase items:", error);
    return [];
  }

  if (!data?.value) return [];

  try {
    const parsed = JSON.parse(data.value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item: any) =>
          typeof item?.id === "string" &&
          typeof item?.src === "string" &&
          typeof item?.title === "string"
      )
      .map((item: any) => ({
        id: item.id,
        src: item.src,
        title: item.title,
      }));
  } catch {
    return [];
  }
}

export async function upsertPinterestShowcaseItems(items: PinterestShowcaseItem[]) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("site_content")
    .upsert(
      { key: PINTEREST_SHOWCASE_KEY, value: JSON.stringify(items) },
      { onConflict: "key" }
    );

  if (error) throw error;
}
