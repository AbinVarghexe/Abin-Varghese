// Contact Page - Site Under Development
import type { Metadata } from 'next';
import { ArrowUpRight, Instagram, Linkedin, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import DarkVeil from '@/components/effects/DarkVeil';
import ContactFormCard from '@/components/contact/ContactFormCard';
import { getContactSectionSettings } from '@/lib/contact-content';
import { createPageMetadata } from '@/seo/page-metadata';

export const metadata: Metadata = createPageMetadata({
  title: "Contact | Abin Varghese",
  description:
    "Get in touch with Abin Varghese for freelance work, collaborations, or internship opportunities. Front-end developer and UI/UX designer available for projects.",
  path: "/contact",
});

export default async function ContactPage() {
  const formSettings = await getContactSectionSettings();

  return (
    <div className="relative min-h-screen w-full text-black dark:text-white bg-[#f8f5f2] dark:bg-black overflow-hidden flex flex-col items-center justify-center pt-20 pb-24 font-['Poppins',sans-serif] transition-colors duration-500">
      {/* Background Interactive Effect (Dark Mode) */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none hidden dark:block">
        <DarkVeil
          hueShift={15}
          noiseIntensity={0.04}
          scanlineIntensity={0}
          speed={1}
          scanlineFrequency={5}
          warpAmount={0.65}
          resolutionScale={1.75}
        />
      </div>

      {/* Paper Texture Background (Light Mode) */}
      <div 
        className="absolute inset-0 z-0 w-full h-full pointer-events-none dark:hidden opacity-[0.5]"
        style={{ 
          backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/013/396/404/small/crumpled-paper-texture-realisric-crease-sheet-free-vector.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'multiply'
        }} 
      />

      {/* Let's Connect Pill */}
      <div className="group relative z-10 flex items-center gap-[8.4px] border-[0.8px] border-black/10 dark:border-[rgba(180,180,180,0.3)] rounded-[42px] px-[17px] h-[48px] mb-20 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden bg-white/50 dark:bg-transparent backdrop-blur-[24px] hover:scale-105 hover:bg-white/80 dark:hover:bg-white/[0.05] transition-all duration-300 cursor-pointer">
        <div 
          className="absolute inset-0 z-[-1] hidden dark:block transition-opacity duration-300 group-hover:opacity-60" 
          style={{ backgroundImage: "linear-gradient(97.5deg, rgba(75, 75, 75, 0.25) 0%, rgba(89, 89, 89, 0.25) 99.3%)" }}
        />
        <div className="absolute inset-0 z-[-1] opacity-[0.05] dark:opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")' }} />
        <Sparkles className="w-[18px] h-[18px] text-black/60 dark:text-white/75 group-hover:text-black dark:group-hover:text-white group-hover:animate-pulse transition-colors duration-300" />
        <span className="text-[13.5px] font-medium tracking-wide">Let&apos;s Connect</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-screen-xl w-full mx-auto px-6 xl:px-8 flex flex-col lg:flex-row gap-16 lg:gap-8 items-start justify-between">
        
        {/* Left Column */}
        <div className="flex flex-col gap-14 lg:w-[420px] pt-4">
          <div className="flex flex-col gap-4 relative group cursor-default">
            <h1 className="text-5xl md:text-[64px] font-semibold flex items-center gap-3 text-black dark:text-white whitespace-nowrap tracking-tight">
              Reach Me <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16 text-black dark:text-white stroke-[2px] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
            </h1>
            <p className="text-black/70 dark:text-white/75 font-medium leading-[1.6] text-base md:text-lg max-w-[380px] transition-colors duration-300 group-hover:text-black/90 dark:group-hover:text-white">
              {formSettings.introText}
            </p>
          </div>

          <div className="flex flex-col mt-2">
            <Link href={formSettings.instagramUrl} className="flex items-center justify-between border-b border-black/10 dark:border-white/20 py-5 group hover:border-black/30 dark:hover:border-white/50 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Instagram className="w-5 h-5 text-black/70 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black dark:group-hover:text-white transition-colors duration-300">Instagram</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 dark:text-white/50 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black dark:group-hover:text-white" />
            </Link>
            <Link href={formSettings.linkedinUrl} className="flex items-center justify-between border-b border-black/10 dark:border-white/20 py-5 group hover:border-black/30 dark:hover:border-white/50 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Linkedin className="w-5 h-5 text-black/70 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black dark:group-hover:text-white transition-colors duration-300">LinkedIn</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 dark:text-white/50 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black dark:group-hover:text-white" />
            </Link>
            <Link href={`mailto:${formSettings.contactEmail}`} className="flex items-center justify-between border-b border-black/10 dark:border-white/20 py-5 group hover:border-black/30 dark:hover:border-white/50 transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center gap-5 transition-transform duration-300 group-hover:translate-x-3">
                <Mail className="w-5 h-5 text-black/70 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors duration-500 group-hover:scale-110" />
                <span className="font-semibold text-[15px] group-hover:text-black dark:group-hover:text-white transition-colors duration-300">Gmail</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40 dark:text-white/50 opacity-0 transition-all duration-300 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-black dark:group-hover:text-white" />
            </Link>
          </div>

          <p className="text-[13px] text-black/60 dark:text-white/60 font-medium transition-colors hover:text-black dark:hover:text-white cursor-pointer w-fit">
            {formSettings.contactEmail}
          </p>
        </div>

        {/* Right Column - Form */}
        <div className="w-full lg:w-fit relative z-20 group/form">
          <ContactFormCard isEnabled={formSettings.formEnabled} />
        </div>
      </div>

      {/* Giant Background Text */}
      <div className="absolute bottom-[-10%] w-[110vw] pointer-events-none select-none z-[5] overflow-hidden flex justify-center mix-blend-multiply dark:mix-blend-plus-lighter opacity-[0.15] dark:opacity-100">
        <h2 
          className="contact-giant-text text-[120px] sm:text-[180px] md:text-[330px] lg:text-[390px] font-semibold leading-[0.8] tracking-[-11.85px] text-transparent bg-clip-text whitespace-nowrap drop-shadow-xl dark:drop-shadow-2xl"
        >
          Contact Me
        </h2>
        <style dangerouslySetInnerHTML={{__html: `
          .dark .contact-input {
            background-image: linear-gradient(99.6deg, rgba(75, 75, 75, 0.25) 0%, rgba(89, 89, 89, 0.25) 99.3%);
          }
          textarea.contact-input.dark {
            background-image: linear-gradient(94.6deg, rgba(75, 75, 75, 0.25) 0%, rgba(89, 89, 89, 0.25) 99.3%);
          }
          .dark .contact-giant-text {
            background-image: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.02) 100%);
            -webkit-text-stroke: 4px rgba(255, 255, 255, 0.2);
          }
          :root:not(.dark) .contact-giant-text {
            background-image: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 35%, transparent 100%);
            -webkit-text-stroke: 4px rgba(0, 0, 0, 0.05);
          }
        `}} />
      </div>
    </div>
  );
}
