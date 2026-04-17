import { createClient } from "@/utils/supabase/server";
import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";
import { heroContentDefaults, type HeroContent } from "@/lib/hero-content-defaults";
import { homeContentDefaults, type HomeContent } from "@/lib/home-content-defaults";

export const siteContentDefaults = {
  ...aboutContentDefaults,
  ...heroContentDefaults,
  ...homeContentDefaults,
};

const aboutKeyMap = {
  aboutImage: "about_image",
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const entries = Object.entries(heroKeyMap).map(([field, key]) => ({
    key,
    value: content[field as keyof HeroContent],
  }));

  const { error } = await supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });

  if (error) throw error;
}

export async function upsertHomeContent(content: HomeContent) {
  const supabase = await createClient();
  const entries = Object.entries(homeKeyMap).map(([field, key]) => {
    const value =
      field === "scrollingLogos" || field === "socialLinks" || field === "pageLinks"
        ? JSON.stringify(content[field as keyof HomeContent])
        : content[field as keyof HomeContent];
      
    return {
      key,
      value: value as string,
    };
  });

  const { error } = await supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });

  if (error) throw error;
}
