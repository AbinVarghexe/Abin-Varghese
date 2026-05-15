// Contact Page - Site Under Development
import type { Metadata } from 'next';
import { ArrowUpRight, Instagram, Linkedin, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ContactFormCard from '@/components/contact/ContactFormCard';
import { getContactSectionSettings } from '@/lib/contact-content';
import { getSiteCopyContent } from '@/lib/site-copy-content';
import { createPageMetadata } from '@/seo/page-metadata';

export const metadata: Metadata = createPageMetadata({
  title: "Contact | Abin Varghese",
  description:
    "Get in touch with Abin Varghese for freelance web development, UI/UX design collaborations, or internship opportunities. Based in Kerala, India — available worldwide.",
  path: "/contact",
  keywords: [
    "Contact Abin Varghese",
    "Hire freelance developer India",
    "Hire UI designer Kerala",
    "Freelance Next.js developer contact",
    "Web developer for hire India",
  ],
});

export default async function ContactPage() {
  const formSettings = await getContactSectionSettings();
  const siteCopy = await getSiteCopyContent();

  return (
    <div className="relative min-h-screen w-full text-black bg-[#f8f5f2] overflow-hidden flex flex-col items-center justify-center pt-20 pb-24 font-['Poppins',sans-serif] transition-colors duration-500">
      <div 
        className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-[0.5]"
        style={{ 
          backgroundImage: `url("${siteCopy.contactBackgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }} 
      />

      {/* Let's Connect Pill */}
      <div className="group relative z-10 flex items-center gap-[8.4px] border-[0.8px] border-black/10 rounded-[42px] px-[15px] h-[36px] md:h-[48px] mb-4 md:mb-20 shadow-sm overflow-hidden bg-white/50 backdrop-blur-[24px] hover:scale-105 hover:bg-white/80 transition-all duration-300 cursor-pointer">
        <div className="absolute inset-0 z-[-1] opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
        <Sparkles className="w-[14px] h-[14px] text-black/60 group-hover:text-black group-hover:animate-pulse transition-colors duration-300" />
        <span className="text-[10px] md:text-[13.5px] font-semibold tracking-wide uppercase">{siteCopy.contactEyebrow}</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-xl w-full mx-auto px-6 xl:px-8 flex flex-col lg:flex-row gap-8 lg:gap-8 items-start justify-between">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 lg:gap-14 lg:w-[420px] pt-4">
          
          <div className="flex flex-col gap-4 md:gap-6 relative group cursor-default">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-[84px] font-bold tracking-tighter leading-none text-black">
                  {siteCopy.contactHeading}
                </h1>
                <ArrowUpRight className="hidden md:block w-16 h-16 text-black stroke-[2.5px] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              </div>

              {/* Social Icons for Mobile - Compact & Inline with Heading */}
              <div className="flex lg:hidden items-center gap-2 shrink-0">
                <Link 
                  href={formSettings.instagramUrl} 
                  className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all duration-300 active:scale-90"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link 
                  href={`mailto:${formSettings.contactEmail}`}
                  className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all duration-300 active:scale-90"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </Link>
                <Link 
                  href={formSettings.linkedinUrl}
                  className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm hover:bg-black hover:text-white transition-all duration-300 active:scale-90"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <p className="text-black/70 font-medium leading-[1.6] text-sm md:text-xl max-w-[380px] transition-colors duration-300 group-hover:text-black/90">
              {formSettings.introText}
            </p>
            <p className="text-black/50 text-xs md:text-base max-w-[420px] leading-relaxed">
              {siteCopy.contactSupportLine}
            </p>
          </div>

          <div className="hidden lg:flex flex-col mt-2">
            <Link href={formSettings.instagramUrl} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Instagram className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">{siteCopy.contactInstagramLabel}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
            <Link href={formSettings.linkedinUrl} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Linkedin className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">{siteCopy.contactLinkedinLabel}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
            <Link href={`mailto:${formSettings.contactEmail}`} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Mail className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">{siteCopy.contactEmailLabel}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
          </div>

          <p className="hidden lg:block text-[13px] text-black/60 font-medium transition-colors hover:text-black cursor-pointer w-fit">
            {formSettings.contactEmail}
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-fit relative z-20 group/form">
          <ContactFormCard isEnabled={formSettings.formEnabled} />
        </div>
      </div>

      {/* Giant Background Text - Positioned at Top for Mobile */}
      <div className="absolute top-[-2%] md:top-auto md:bottom-[-10%] w-[110vw] pointer-events-none select-none z-[5] overflow-hidden flex justify-center mix-blend-multiply opacity-[0.18] md:opacity-[0.15]">
        <svg 
          viewBox="0 0 1600 500" 
          className="w-full h-auto drop-shadow-xl"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="giantTextGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
              <stop offset="35%" stopColor="rgba(0,0,0,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          <text 
            x="50%" 
            y="50%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="url(#giantTextGradient)" 
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth="4"
            className="font-bold text-[280px] md:text-[390px] tracking-[-11.85px] font-['Poppins']"
          >
            {siteCopy.contactGiantText}
          </text>
        </svg>
      </div>
    </div>
  );
}
