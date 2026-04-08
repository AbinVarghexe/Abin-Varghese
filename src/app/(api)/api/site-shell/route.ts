import { NextResponse } from "next/server";

import { getContactSectionSettings } from "@/lib/contact-content";
import { getHomeContent } from "@/lib/site-content";
import { getSiteCopyContent } from "@/lib/site-copy-content";

export async function GET() {
  const [siteCopy, home, contactSettings] = await Promise.all([
    getSiteCopyContent(),
    getHomeContent(),
    getContactSectionSettings(),
  ]);

  return NextResponse.json({
    siteCopy,
    socialLinks: home.socialLinks,
    contactSettings,
  });
}
