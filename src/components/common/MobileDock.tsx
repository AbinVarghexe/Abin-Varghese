'use client';

import React from 'react';
import { Dock } from './Dock';
import { Home, User, Briefcase, Zap, Mail } from 'lucide-react';

const navItems = [
  { name: 'Home', link: '/', icon: Home },
  { name: 'About', link: '/about', icon: User },
  { name: 'Projects', link: '/projects', icon: Briefcase },
  { name: 'Services', link: '/services', icon: Zap },
  { name: 'Contact', link: '/contact', icon: Mail },
];

export const MobileDock: React.FC = () => {
  return <Dock items={navItems} />;
};
