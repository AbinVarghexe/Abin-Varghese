"use client";

import React from "react";
import { Briefcase, Layout, MousePointer2, CheckCircle2, Circle } from "lucide-react";
import { SiteCopyContent } from "@/types/site-copy";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface RecentProjectsSectionProps {
  siteCopy: SiteCopyContent;
  setSiteCopy: React.Dispatch<React.SetStateAction<SiteCopyContent>>;
  projects: any[];
}

export function RecentProjectsSection({
  siteCopy,
  setSiteCopy,
  projects = [],
}: RecentProjectsSectionProps) {
  const toggleProject = (id: string) => {
    const current = siteCopy.homeRecentWebProjectIds || [];
    if (current.includes(id)) {
      setSiteCopy({ ...siteCopy, homeRecentWebProjectIds: current.filter(pid => pid !== id) });
    } else {
      if (current.length >= 6) return; // Limit to 6
      setSiteCopy({ ...siteCopy, homeRecentWebProjectIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Main Section Header */}
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layout className="size-4 text-primary" />
            <CardTitle className="text-lg">Recent Projects Header</CardTitle>
          </div>
          <CardDescription>
            Manage the overall heading and introduction for the Projects & Creative section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recentHeading">Main Heading (Use [brackets] for accent)</Label>
            <Input
              id="recentHeading"
              value={siteCopy.homeRecentHeading}
              onChange={(e) => setSiteCopy({ ...siteCopy, homeRecentHeading: e.target.value })}
              placeholder="My Recent [Project's]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recentIntro">Section Introduction</Label>
            <Textarea
              id="recentIntro"
              rows={3}
              value={siteCopy.homeRecentIntro}
              onChange={(e) => setSiteCopy({ ...siteCopy, homeRecentIntro: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Web Development Subsection */}
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-primary" />
            <CardTitle className="text-lg">Web Development Subsection</CardTitle>
          </div>
          <CardDescription>
            Configure the sub-heading and description for the Web Development block.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="webTitle">Sub-heading</Label>
              <Input
                id="webTitle"
                value={siteCopy.homeRecentWebTitle}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeRecentWebTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webCta">CTA Label</Label>
              <Input
                id="webCta"
                value={siteCopy.homeRecentWebCtaLabel}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeRecentWebCtaLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="webCopy">Subsection Copy</Label>
              <Textarea
                id="webCopy"
                rows={3}
                value={siteCopy.homeRecentWebCopy}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeRecentWebCopy: e.target.value })}
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Project Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MousePointer2 className="size-3 text-primary" />
                  Select Featured Projects (Max 6)
                </h4>
                <p className="text-xs text-muted-foreground">Choose which projects to display in the card swap.</p>
              </div>
              <Badge variant="secondary">{siteCopy.homeRecentWebProjectIds?.length || 0} selected</Badge>
            </div>

            <ScrollArea className="h-[300px] rounded-md border border-border/40 bg-muted/20 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((project) => {
                  const isSelected = (siteCopy.homeRecentWebProjectIds || []).includes(project.id);
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => toggleProject(project.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        isSelected 
                          ? "bg-primary/5 border-primary shadow-sm" 
                          : "bg-background border-border/40 hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="size-12 shrink-0 rounded bg-muted overflow-hidden">
                        {project.imageUrl && (
                          <img src={project.imageUrl} alt={project.title} className="size-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{project.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{project.category || "Web Project"}</p>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground/30 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* 3. Creative Stuff Header */}
      <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layout className="size-4 text-primary" />
            <CardTitle className="text-lg">Creative Stuff Header</CardTitle>
          </div>
          <CardDescription>
            Configure the sub-heading and description for the Creative section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="creativeTitle">Sub-heading</Label>
              <Input
                id="creativeTitle"
                value={siteCopy.homeCreativeTitle}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeCreativeTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creativeCta">CTA Label</Label>
              <Input
                id="creativeCta"
                value={siteCopy.homeCreativeCtaLabel}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeCreativeCtaLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="creativeCopy">Subsection Copy</Label>
              <Textarea
                id="creativeCopy"
                rows={3}
                value={siteCopy.homeCreativeCopy}
                onChange={(e) => setSiteCopy({ ...siteCopy, homeCreativeCopy: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
