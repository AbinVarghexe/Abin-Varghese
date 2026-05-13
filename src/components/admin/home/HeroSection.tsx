"use client";

import React from "react";
import { User, Type, Link, Tag, Calendar, CheckCircle2 } from "lucide-react";
import { HeroContent } from "@/lib/hero-content-defaults";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface HeroSectionProps {
  hero: HeroContent;
  setHero: React.Dispatch<React.SetStateAction<HeroContent>>;
}

export function HeroSection({ hero, setHero }: HeroSectionProps) {
  const updateHero = (field: keyof HeroContent, value: string) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <CardTitle className="text-lg">Main Identity</CardTitle>
          </div>
          <CardDescription>
            Control how you introduce yourself on the home page hero section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="heroGreeting">Greeting Text</Label>
              <Input
                id="heroGreeting"
                value={hero.heroGreeting}
                onChange={(e) => updateHero("heroGreeting", e.target.value)}
                placeholder="Hi, Guys 👋 I'm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroName">Display Name</Label>
              <Input
                id="heroName"
                value={hero.heroName}
                onChange={(e) => updateHero("heroName", e.target.value)}
                placeholder="Abin Varghese."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="heroSubcopy">Hero Subcopy (Introduction)</Label>
              <Textarea
                id="heroSubcopy"
                rows={3}
                value={hero.heroSubcopy}
                onChange={(e) => updateHero("heroSubcopy", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-primary" />
            <CardTitle className="text-lg">Tags & Availability</CardTitle>
          </div>
          <CardDescription>
            Manage your audience tags and availability status line.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="heroAudienceTags">Audience Tags (Comma separated)</Label>
              <Input
                id="heroAudienceTags"
                value={hero.heroAudienceTags}
                onChange={(e) => updateHero("heroAudienceTags", e.target.value)}
                placeholder="AV,UI,UX,FD,NX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroAvailabilityText">Availability Status</Label>
              <Input
                id="heroAvailabilityText"
                value={hero.heroAvailabilityText}
                onChange={(e) => updateHero("heroAvailabilityText", e.target.value)}
                placeholder="Full-Stack Developer · UI/UX Designer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link className="size-4 text-primary" />
            <CardTitle className="text-lg">Call to Actions</CardTitle>
          </div>
          <CardDescription>
            Configure the primary and secondary buttons in your hero section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-sm font-medium">Primary Button</p>
              <div className="space-y-2">
                <Label htmlFor="primaryLabel">Label</Label>
                <Input
                  id="primaryLabel"
                  value={hero.heroCtaPrimaryLabel}
                  onChange={(e) => updateHero("heroCtaPrimaryLabel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryUrl">URL / Path</Label>
                <Input
                  id="primaryUrl"
                  value={hero.heroCtaPrimaryUrl}
                  onChange={(e) => updateHero("heroCtaPrimaryUrl", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Secondary Button</p>
              <div className="space-y-2">
                <Label htmlFor="secondaryLabel">Label</Label>
                <Input
                  id="secondaryLabel"
                  value={hero.heroCtaSecondaryLabel}
                  onChange={(e) => updateHero("heroCtaSecondaryLabel", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryUrl">URL / Path</Label>
                <Input
                  id="secondaryUrl"
                  value={hero.heroCtaSecondaryUrl}
                  onChange={(e) => updateHero("heroCtaSecondaryUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
