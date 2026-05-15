'use client';

import React, { useEffect, useState } from 'react';
import { Dock } from './Dock';
import { Home, User, Briefcase, Zap, Mail, type LucideIcon } from 'lucide-react';
import { siteCopyDefaults, type SiteCopyContent } from '@/types/site-copy';

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  projects: Briefcase,
  services: Zap,
  contact: Mail,
};

export const MobileDock: React.FC = () => {
  const [siteCopy, setSiteCopy] = useState<SiteCopyContent>(siteCopyDefaults);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/site-shell', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setSiteCopy(data.siteCopy || siteCopyDefaults);
      } catch { /* keep defaults */ }
    }
    void load();
    return () => { mounted = false; };
  }, []);

  const items = siteCopy.navLinks.map(link => ({
    name: link.name,
    link: link.path,
    icon: iconMap[link.name.toLowerCase()] || Home,
  }));

  return <Dock items={items} />;
};
