import prisma from "@/lib/prisma";
import { aboutContentDefaults, type AboutContent } from "@/lib/about-content-defaults";

export const siteContentDefaults = aboutContentDefaults;

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

export async function getAboutContent(): Promise<AboutContent> {
  const keys = Object.values(aboutKeyMap);
  const records = await prisma.siteContent.findMany({
    where: { key: { in: keys } },
  });

  const values = new Map(records.map((record) => [record.key, record.value]));

  return {
    aboutImage: values.get(aboutKeyMap.aboutImage) || siteContentDefaults.aboutImage,
    aboutInstagramImage1:
      values.get(aboutKeyMap.aboutInstagramImage1) || siteContentDefaults.aboutInstagramImage1,
    aboutInstagramImage2:
      values.get(aboutKeyMap.aboutInstagramImage2) || siteContentDefaults.aboutInstagramImage2,
    aboutInstagramImage3:
      values.get(aboutKeyMap.aboutInstagramImage3) || siteContentDefaults.aboutInstagramImage3,
    aboutInstagramImage4:
      values.get(aboutKeyMap.aboutInstagramImage4) || siteContentDefaults.aboutInstagramImage4,
    aboutInstagramLink1:
      values.get(aboutKeyMap.aboutInstagramLink1) || siteContentDefaults.aboutInstagramLink1,
    aboutInstagramLink2:
      values.get(aboutKeyMap.aboutInstagramLink2) || siteContentDefaults.aboutInstagramLink2,
    aboutInstagramLink3:
      values.get(aboutKeyMap.aboutInstagramLink3) || siteContentDefaults.aboutInstagramLink3,
    aboutInstagramLink4:
      values.get(aboutKeyMap.aboutInstagramLink4) || siteContentDefaults.aboutInstagramLink4,
  };
}

export async function upsertAboutContent(content: AboutContent) {
  await prisma.$transaction(
    Object.entries(aboutKeyMap).map(([field, key]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value: content[field as keyof AboutContent] },
        create: { key, value: content[field as keyof AboutContent] },
      })
    )
  );
}
