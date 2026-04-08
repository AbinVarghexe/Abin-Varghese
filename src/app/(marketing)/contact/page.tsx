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
    "Get in touch with Abin Varghese for freelance work, collaborations, or internship opportunities. Front-end developer and UI/UX designer available for projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const formSettings = await getContactSectionSettings();
  const siteCopy = await getSiteCopyContent();

  return (
    <div className="relative min-h-screen w-full text-black bg-[#f8f5f2] overflow-hidden flex flex-col items-center justify-center pt-20 pb-24 font-['Poppins',sans-serif] transition-colors duration-500">
      <div 
        className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-[0.5]"
        style={{ 
          backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/013/396/404/small/crumpled-paper-texture-realisric-crease-sheet-free-vector.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }} 
      />

      {/* Let's Connect Pill */}
      <div className="group relative z-10 flex items-center gap-[8.4px] border-[0.8px] border-black/10 rounded-[42px] px-[17px] h-[48px] mb-20 shadow-sm overflow-hidden bg-white/50 backdrop-blur-[24px] hover:scale-105 hover:bg-white/80 transition-all duration-300 cursor-pointer">
        <div className="absolute inset-0 z-[-1] opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
        <Sparkles className="w-[18px] h-[18px] text-black/60 group-hover:text-black group-hover:animate-pulse transition-colors duration-300" />
        <span className="text-[13.5px] font-medium tracking-wide">{siteCopy.contactEyebrow}</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-xl w-full mx-auto px-6 xl:px-8 flex flex-col lg:flex-row gap-16 lg:gap-8 items-start justify-between">
        
        {/* Left Column */}
        <div className="flex flex-col gap-14 lg:w-[420px] pt-4">
          <div className="flex flex-col gap-4 relative group cursor-default">
            <h1 className="text-5xl md:text-[64px] font-semibold flex flex-wrap items-center gap-3 text-black tracking-tight leading-[0.95]">
              <span>{siteCopy.contactHeading}</span>
              <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16 text-black stroke-[2px] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            </h1>
            <p className="text-black/70 font-medium leading-[1.6] text-base md:text-lg max-w-[380px] transition-colors duration-300 group-hover:text-black/90">
              {formSettings.introText}
            </p>
            <p className="text-black/50 text-sm md:text-base max-w-[420px] leading-[1.7]">
              {siteCopy.contactSupportLine}
            </p>
          </div>

          <div className="flex flex-col mt-2">
            <Link href={formSettings.instagramUrl} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Instagram className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">Instagram</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
            <Link href={formSettings.linkedinUrl} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Linkedin className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">LinkedIn</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
            <Link href={`mailto:${formSettings.contactEmail}`} className="flex items-center justify-between border-b border-black/10 py-5 group hover:border-black/30 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Mail className="w-5 h-5 text-black/70 group-hover:text-black transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black transition-colors duration-300">Gmail</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black" />
            </Link>
          </div>

          <p className="text-[13px] text-black/60 font-medium transition-colors hover:text-black cursor-pointer w-fit">
            {formSettings.contactEmail}
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-fit relative z-20 group/form">
          <ContactFormCard isEnabled={formSettings.formEnabled} />
        </div>
      </div>

      {/* Giant Background Text */}
      <div className="absolute bottom-[-10%] w-[110vw] pointer-events-none select-none z-[5] overflow-hidden flex justify-center mix-blend-multiply opacity-[0.15]">
        <h2 
          className="contact-giant-text text-[120px] sm:text-[180px] md:text-[330px] lg:text-[390px] font-semibold leading-[0.8] tracking-[-11.85px] text-transparent bg-clip-text whitespace-nowrap drop-shadow-xl"
        >
          {siteCopy.contactGiantText}
        </h2>
        <style dangerouslySetInnerHTML={{__html: `
          .contact-giant-text {
            background-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 35%, transparent 100%);
            -webkit-text-stroke: 4px rgba(0, 0, 0, 0.05);
          }
        `}} />
      </div>
    </div>
  );
}
