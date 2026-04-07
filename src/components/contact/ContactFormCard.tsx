"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ContactFormCardProps {
  isEnabled: boolean;
}

export default function ContactFormCard({ isEnabled }: ContactFormCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEnabled || submitting) {
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject.trim() || undefined,
          message,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Failed to submit form.");
        return;
      }

      setStatus(result.message || "Message sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("Something went wrong while sending your message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative bg-white/60 dark:bg-white/[0.05] border-[3px] border-white dark:border-white/20 backdrop-blur-xl p-6 sm:p-8 md:px-[32.6px] md:py-[24px] rounded-[35px] flex flex-col gap-[12px] w-full lg:w-[684px] shadow-[0_16px_40px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_16px_40px_-5px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-shadow duration-500 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
        }}
      />

      <div className="flex flex-col md:flex-row gap-[30px] relative z-10 w-full">
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name"
          className="contact-input w-full border-[2px] border-black/5 dark:border-[rgba(180,180,180,0.3)] rounded-[22px] pl-[31.7px] pr-[20px] text-[15.8px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-[#d0d0d0] focus:outline-none focus:border-black/20 dark:focus:border-white/50 transition-all duration-300 font-medium h-[70px] bg-black/[0.02] dark:bg-transparent"
        />

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="contact-input w-full border-[2px] border-black/5 dark:border-[rgba(180,180,180,0.3)] rounded-[22px] pl-[26.4px] pr-[20px] text-[15.8px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-[#d0d0d0] focus:outline-none focus:border-black/20 dark:focus:border-white/50 transition-all duration-300 font-medium h-[70px] bg-black/[0.02] dark:bg-transparent"
        />
      </div>

      <input
        type="text"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        placeholder="Subject (optional)"
        className="contact-input relative z-10 w-full border-[2px] border-black/5 dark:border-[rgba(180,180,180,0.3)] rounded-[22px] px-[26.4px] text-[15.8px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-[#d0d0d0] focus:outline-none focus:border-black/20 dark:focus:border-white/50 transition-all duration-300 font-medium h-[60px] bg-black/[0.02] dark:bg-transparent"
      />

      <textarea
        required
        minLength={10}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Message"
        className="contact-input w-full relative z-10 border-[2px] border-black/5 dark:border-[rgba(180,180,180,0.3)] rounded-[22px] px-[40.8px] pt-[29.5px] pb-[20px] text-[15.8px] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-[#d0d0d0] focus:outline-none focus:border-black/20 dark:focus:border-white/50 transition-all duration-300 resize-none font-medium h-[309px] bg-black/[0.02] dark:bg-transparent"
      />

      <button
        type="submit"
        disabled={!isEnabled || submitting}
        className="group overflow-hidden w-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[17.6px] uppercase h-[70px] rounded-[34.8px] border-[2px] border-black dark:border-[rgba(180,180,180,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 relative z-10 flex items-center justify-center tracking-wide"
      >
        <span className="relative z-20 flex items-center justify-center gap-2">
          {isEnabled ? (submitting ? "Submitting..." : "Submit") : "Form Disabled"}
          <ArrowUpRight className="w-5 h-5" />
        </span>
      </button>

      {status ? <p className="relative z-10 text-sm text-black/70 dark:text-white/80">{status}</p> : null}
    </form>
  );
}
