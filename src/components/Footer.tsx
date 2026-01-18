'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/yourusername' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
    { name: 'GitHub', href: 'https://github.com/yourusername' },
    { name: 'Twitter', href: 'https://twitter.com/yourusername' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 py-16 md:py-24">
        <div className="mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
            Let's work
            <br />
            together
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 mt-8 text-lg md:text-xl border-b border-white pb-1 hover:opacity-70 transition-opacity"
          >
            Get in touch
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-16 md:mb-24">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Navigation</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-lg hover:opacity-70 transition-opacity"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Social</h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@abinvarghese.me"
                  className="text-lg hover:opacity-70 transition-opacity"
                >
                  hello@abinvarghese.me
                </a>
              </li>
              <li>
                <span className="text-lg text-zinc-400">Kerala, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Services</h3>
            <ul className="space-y-3">
              <li className="text-lg text-zinc-300">Web Development</li>
              <li className="text-lg text-zinc-300">Graphic Design</li>
              <li className="text-lg text-zinc-300">Video Editing</li>
              <li className="text-lg text-zinc-300">VFX & Motion</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {currentYear} Abin Varghese. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
