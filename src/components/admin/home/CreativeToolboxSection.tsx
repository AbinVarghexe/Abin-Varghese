"use client";

import React from "react";
import { Wrench, Image, Share2, ExternalLink, Plus, X } from "lucide-react";
import { HomeContent } from "@/lib/home-content-defaults";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CreativeToolboxSectionProps {
  home: HomeContent;
  setHome: React.Dispatch<React.SetStateAction<HomeContent>>;
}

export function CreativeToolboxSection({ home, setHome }: CreativeToolboxSectionProps) {
  const updateSocial = (network: keyof HomeContent["socialLinks"], value: string) => {
    setHome((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [network]: value },
    }));
  };

  const addLogo = () => {
    setHome((prev) => ({
      ...prev,
      scrollingLogos: [...prev.scrollingLogos, ""],
    }));
  };

  const updateLogo = (index: number, value: string) => {
    const newLogos = [...home.scrollingLogos];
    newLogos[index] = value;
    setHome((prev) => ({ ...prev, scrollingLogos: newLogos }));
  };

  const removeLogo = (index: number) => {
    setHome((prev) => ({
      ...prev,
      scrollingLogos: prev.scrollingLogos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="size-4 text-primary" />
            <CardTitle className="text-lg">Banner Content</CardTitle>
          </div>
          <CardDescription>
            Edit the items that appear in the infinite scrolling banner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="scrollingBannerItems">Banner Items (Comma separated)</Label>
            <Textarea
              id="scrollingBannerItems"
              rows={2}
              value={home.scrollingBannerItems}
              onChange={(e) => setHome({ ...home, scrollingBannerItems: e.target.value })}
              placeholder="Web Developer, Graphic Designer, etc."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="size-4 text-primary" />
            <CardTitle className="text-lg">Brand Logos</CardTitle>
          </div>
          <CardDescription>
            Manage the list of logo URLs that scroll in the toolbox section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {home.scrollingLogos.map((logo, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={logo}
                  onChange={(e) => updateLogo(index, e.target.value)}
                  placeholder="Logo URL"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-destructive hover:bg-destructive/10"
                  onClick={() => removeLogo(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={addLogo}
          >
            <Plus className="size-4 mr-2" />
            Add Logo URL
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="size-4 text-primary" />
            <CardTitle className="text-lg">Global Social Links</CardTitle>
          </div>
          <CardDescription>
            Manage the primary social media links used across the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(home.socialLinks) as Array<keyof HomeContent["socialLinks"]>).map((network) => (
              <div key={network} className="space-y-2">
                <Label htmlFor={`social-${network}`} className="capitalize">{network}</Label>
                <Input
                  id={`social-${network}`}
                  value={home.socialLinks[network]}
                  onChange={(e) => updateSocial(network, e.target.value)}
                  placeholder={`https://${network}.com/...`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
