"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseTrail from "@/components/ui/MouseTrail";
import { MobileNav } from "@/components/common/MobileNav";
import { MobileDock } from "@/components/common/MobileDock";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <MouseTrail baseThickness={4} enableCustomCursor={true} enableFade={true} />
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <MobileNav />
        <MobileDock />
      </div>
      <div className="">{children}</div>
      <Footer />
    </>
  );
}
