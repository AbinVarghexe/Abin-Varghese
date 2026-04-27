"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Trash2, Globe, Zap, Mic, MicOff, ExternalLink, Cpu } from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import JarvisWaveform from "./JarvisWaveform";
import { colors } from "@/lib/design-system";

type AssistantIntent = "about" | "projects" | "skills" | "contact" | "none";

type ProjectPreview = { title: string; tech?: string };

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
  resultIndex: number;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: Event) => void) | null;
}

export default function JarvisAssistant() {
  const { isOpen, closeJarvis, messages, addMessage, isThinking, setThinking, clearHistory } = useJarvisStore();
  const [input, setInput] = useState("");
  const [currentIntent, setCurrentIntent] = useState<AssistantIntent>("none");
  const [realProjects, setRealProjects] = useState<ProjectPreview[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [ragActive, setRagActive] = useState(false);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setRealProjects(d))
      .catch(() => null);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  // ── AUDIO ANALYZER ────────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    void audioContextRef.current?.close();
    streamRef.current = null;
    audioContextRef.current = null;
    analyzerRef.current = null;
    setAudioLevel(0);
  }, []);

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const Ctx = window.AudioContext || (window as AudioWindow).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      audioContextRef.current = ctx;
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;
      ctx.createMediaStreamSource(stream).connect(analyzer);
      const buf = new Uint8Array(analyzer.frequencyBinCount);
      const tick = () => {
        if (!analyzerRef.current) return;
        analyzer.getByteFrequencyData(buf);
        const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
        setAudioLevel(avg / 128);
        requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setIsListening(false);
    }
  }, []);

  // ── SPEECH RECOGNITION (STT) ──────────────────────────────────────────────
  const submitVoice = useCallback((text: string) => {
    setTranscript("");
    setIsListening(false);
    setInput(text);
    setTimeout(() => {
      document.getElementById("jarvis-submit")?.click();
    }, 100);
  }, []);

  const startRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const result = e.results[e.resultIndex];
      const text = result[0].transcript;
      setTranscript(text);
      if (result.isFinal) {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        submitVoice(text);
      } else {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => submitVoice(text), 2000);
      }
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    rec.start();
  }, [submitVoice]);

  useEffect(() => {
    if (isListening && isOpen) {
      void startAudio();
      startRecognition();
    } else {
      stopAudio();
      recognitionRef.current?.stop();
      setTranscript("");
    }
    return () => stopAudio();
  }, [isListening, isOpen, startAudio, stopAudio, startRecognition]);

  // ── TTS (SPEECH SYNTHESIS) ────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const maleVoice =
      voices.find((v) => v.name.includes("David") || v.name.includes("Daniel") || v.name.includes("Guy") || v.name.includes("Male")) ||
      voices[0];
    utterance.voice = maleVoice ?? null;
    utterance.pitch = 0.85;
    utterance.rate = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => setThinking(true);
    utterance.onend = () => setThinking(false);
    window.speechSynthesis.speak(utterance);
  }, [setThinking]);

  // ── SUBMIT (RAG CHAT) ─────────────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;
    setInput("");
    addMessage(text, "user");
    setThinking(true);
    setRagActive(true);

    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }],
          currentIntent,
        }),
      });
      const data = await res.json() as { text?: string; intent?: string; error?: string; ragUsed?: boolean };
      if (data.error) throw new Error(data.error);
      const reply = data.text ?? "Neural sync failed.";
      addMessage(reply, "assistant");
      setCurrentIntent((data.intent as AssistantIntent) ?? "none");
      setRagActive(false);
      speak(reply);
    } catch {
      const err = "Neural link interrupted, sir. Please check the NVIDIA NIM API key.";
      addMessage(err, "assistant");
      setRagActive(false);
      speak(err);
    } finally {
      setThinking(false);
    }
  };

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant");
  if (!isOpen || !isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#02030a]/78 backdrop-blur-3xl"
            onClick={closeJarvis}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#0e0e2c]/95 shadow-2xl md:flex-row"
            style={{ backgroundColor: colors.indigo }}
          >
            {/* Ambient Grid */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,32,215,0.22),transparent_45%)]" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:110px_110px]" />
            </div>

            {/* HUD Top Left */}
            <div className="absolute top-6 left-8 z-10 hidden md:flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-500/60 uppercase">Neural Link: Secured</span>
              </div>
              <div className="flex items-center gap-1.5 ml-3.5">
                <Cpu size={8} className="text-[#0020d7]/50" />
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-tighter">NVIDIA Llama 3.3-70B · RAG Active</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-6 right-8 z-10 flex items-center gap-3">
              {ragActive && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0020d7]/20 border border-[#0020d7]/30 rounded-full"
                >
                  <span className="w-1 h-1 rounded-full bg-[#0020d7] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#0020d7]/80">Searching memory...</span>
                </motion.div>
              )}
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-3 rounded-full transition-all ${isListening ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-white/5 text-white/40 hover:text-white"}`}
                title="Toggle Voice Input"
              >
                {isListening ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button onClick={clearHistory} className="p-3 bg-white/5 hover:bg-white/10 text-white/20 hover:text-white/60 rounded-full transition-colors">
                <Trash2 size={18} />
              </button>
              <button onClick={closeJarvis} className="p-3 bg-[#0020d7] hover:scale-110 text-white rounded-full transition-all shadow-[0_0_15px_rgba(0,32,215,0.4)]">
                <X size={18} />
              </button>
            </div>

            {/* ── LEFT: VOICE ENGINE ───────────────────────────────────── */}
            <div className="relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 md:w-[35%] md:border-b-0 md:border-r md:p-12">
              <div className="mb-8 w-full cursor-pointer" onClick={() => setIsListening(true)}>
                <JarvisWaveform isThinking={isThinking} volume={audioLevel} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lastAssistantMsg?.content ?? "idle"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  {transcript ? (
                    <p className="text-sm font-mono text-white/50 italic max-w-xs mx-auto">
                      &ldquo;{transcript}&rdquo;
                    </p>
                  ) : (
                    <p className="text-xl md:text-2xl font-light text-white leading-tight italic max-w-xs mx-auto drop-shadow-lg">
                      {lastAssistantMsg ? `"${lastAssistantMsg.content}"` : "Speak, sir. I am listening."}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 hidden md:flex items-center gap-3 p-3 px-5 bg-white/2 rounded-full border border-white/5">
                <div className="flex gap-1 h-3 items-end">
                  {[0.2, 0.5, 0.8, 0.4, 0.6].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isListening ? `${h * (100 + audioLevel * 100)}%` : "2px" }}
                      className="w-1 bg-[#0020d7] rounded-full"
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">
                  {isListening ? "Hearing Active" : "Signal Idle"}
                </span>
              </div>
            </div>

            {/* ── RIGHT: KNOWLEDGE STAGE ───────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden bg-white/2 backdrop-blur-xl">
              <div className="scrollbar-hide flex-1 overflow-y-auto p-8 md:p-12 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIntent}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {currentIntent === "none" && (
                      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                        <div className="w-24 h-24 rounded-full bg-[#0020d7]/10 flex items-center justify-center text-[#0020d7] mb-8 border border-[#0020d7]/20 relative">
                          <div className="absolute inset-0 rounded-full border border-[#0020d7]/40 animate-ping" />
                          <Globe size={48} />
                        </div>
                        <h3 className="text-white/60 font-mono text-xs tracking-[0.5em] uppercase mb-4">Neural Interface Ready</h3>
                        <p className="text-white/30 text-base max-w-sm font-light">
                          Ask me anything — &ldquo;Who are you?&rdquo;, &ldquo;What projects have you built?&rdquo;, or &ldquo;What&apos;s your stack?&rdquo;
                        </p>
                      </div>
                    )}

                    {currentIntent === "about" && (
                      <div className="p-10 bg-[#0020d7]/10 border border-[#0020d7]/20 rounded-[48px] backdrop-blur-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0020d7]/20 blur-4xl rounded-full -mr-20 -mt-20" />
                        <h4 className="text-[#0020d7] font-mono text-xs tracking-[0.4em] uppercase mb-6">Identity Record</h4>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">
                          Abin<br /><span className="text-white/30">Varghese.</span>
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                          Lead Front-end Architect specializing in Creative Engineering, 3D Web Experiences, and immersive UI systems.
                        </p>
                      </div>
                    )}

                    {currentIntent === "projects" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <h3 className="text-[#0020d7] font-mono text-xs tracking-widest uppercase">Project Archive</h3>
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-emerald-500">Live</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(realProjects.length > 0 ? realProjects.slice(0, 4) : [
                            { title: "Fluid 3D Engine", tech: "Three.js / React" },
                            { title: "SaaS Dashboard", tech: "Next.js / Prisma" },
                          ]).map((proj, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-6 bg-white/5 border border-white/5 rounded-3xl hover:border-[#0020d7]/40 transition-all cursor-pointer"
                            >
                              <h4 className="text-white font-bold text-xl mb-1">{proj.title}</h4>
                              <p className="text-xs text-white/30 font-mono mb-4">{proj.tech ?? "Creative Logic"}</p>
                              <div className="flex items-center gap-2 text-[10px] text-[#0020d7] font-bold uppercase tracking-[0.2em]">
                                <span>Access Component</span>
                                <ExternalLink size={12} />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentIntent === "skills" && (
                      <div className="space-y-8">
                        <h3 className="text-[#0020d7] font-mono text-xs tracking-[0.4em] uppercase py-2 border-b border-white/5">Neural Skill Sync</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {["Next.js", "Three.js", "React", "TypeScript", "Node.js", "GLSL", "Supabase", "GSAP"].map((skill) => (
                            <div key={skill} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex flex-col items-center gap-4 group hover:bg-[#0020d7]/5 transition-all">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#0020d7] transition-all">
                                <Zap size={16} />
                              </div>
                              <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase text-center">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentIntent === "contact" && (
                      <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[48px] text-center space-y-6">
                        <h3 className="text-emerald-400 font-mono text-xs tracking-[0.4em] uppercase">Open for Opportunities</h3>
                        <p className="text-white/60 text-lg">Head to the Contact section to reach Abin directly.</p>
                        <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all">
                          <ExternalLink size={14} /> Go to Contact
                        </a>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="border-t border-white/5 bg-[#0e0e2c]/90 p-8 backdrop-blur-xl md:p-10">
                <form onSubmit={(e) => void handleSubmit(e)} className="relative max-w-3xl mx-auto group">
                  <div className="absolute -inset-1.5 bg-[#0020d7] rounded-full blur-xl opacity-0 group-focus-within:opacity-20 transition-all duration-500" />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? `Listening... "${transcript || ""}"` : "Ask your Digital Clone anything..."}
                    className="relative w-full bg-white/5 border border-white/10 px-10 h-16 rounded-full outline-none text-white placeholder:text-white/20 focus:border-[#0020d7]/40 transition-all pr-16"
                  />
                  <button
                    id="jarvis-submit"
                    type="submit"
                    disabled={isThinking}
                    className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center bg-[#0020d7] rounded-full text-white shadow-[0_0_20px_rgba(0,32,215,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <MessageSquare size={20} />
                  </button>
                </form>
                <p className="mt-3 text-center text-[8px] font-mono text-white/10 uppercase tracking-[0.5em]">
                  {isThinking ? "Processing Neural Signal..." : "Powered by NVIDIA NIM · Llama 3.3 70B · RAG"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
