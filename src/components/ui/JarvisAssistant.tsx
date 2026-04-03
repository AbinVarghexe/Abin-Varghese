"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ExternalLink, Cpu, Trash2, Rocket, Globe, Ghost, Zap, Mic, MicOff, Volume2 } from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { AssistantIntent } from "@/lib/jarvis-engine";
import JarvisWaveform from "./JarvisWaveform";
import { colors, shadows } from "@/lib/design-system";

/**
 * JarvisAssistant: A centered cinematic "Neural Stage" modal.
 * Features:
 * - Real-time Voice Interaction (Microphone)
 * - Gemini AI Integration (Virtual Self Brain)
 * - Text-to-Speech (Male Personality)
 * - Contextual Knowledge Cards sync'd with database.
 */
export default function JarvisAssistant() {
  const { isOpen, closeJarvis, messages, addMessage, isThinking, setThinking, clearHistory } = useJarvisStore();
  const [input, setInput] = useState("");
  const [currentIntent, setCurrentIntent] = useState<AssistantIntent>("none");
  const [realProjects, setRealProjects] = useState<any[]>([]);
  
  // Voice & Audio States
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fetch real projects for contextual archive
  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setRealProjects(data))
      .catch(err => console.error("Jarvis failed to load project data:", err));
  }, []);

  // ── LOCK BODY SCROLL WHEN OPEN ──────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ── MICROPHONE ANALYZER ──────────────────────────────────
  useEffect(() => {
    if (isListening && isOpen) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => stopRecording();
  }, [isListening, isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyzer);

      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!isListening) return;
        analyzer.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;
        setAudioLevel(average / 128); // Normalize 0 to 1
        requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (err) {
      console.error("Neural Microphone Link Failed:", err);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    setAudioLevel(0);
  };

  // ── TEXT TO SPEECH (MALE PERSONALITY) ─────────────────────
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt to find a high-quality Male voice
    const maleVoice = voices.find(v => (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Daniel") || v.name.includes("Guy"))) || voices[0];
    
    utterance.voice = maleVoice;
    utterance.pitch = 0.85; // Deep, sophisticated Jarvis tone
    utterance.rate = 1.05;  // Efficient, tech-y pacing
    utterance.volume = 1;
    
    // Simulate "speaking" for waveform reactivity if AI is talking
    utterance.onstart = () => setThinking(true);
    utterance.onend = () => setThinking(false);

    window.speechSynthesis.speak(utterance);
  };

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");

  // ── GEMINI AI SYNC ─────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;

    const userText = input.trim();
    setInput("");
    addMessage(userText, "user");
    setThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, { role: "user", content: userText }],
          currentIntent 
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      addMessage(data.text, "assistant");
      setCurrentIntent(data.intent || "none");
      
      // Speak the response immediately
      speak(data.text);
    } catch (err: any) {
      const errorText = "Neural link interrupted, sir. Awaiting reconnection.";
      addMessage(errorText, "assistant");
      speak(errorText);
    } finally {
      // In Gemini mode, thinking ends when TTS starts or finishes
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-12 overflow-hidden">
           {/* Cinematic Backdrop with Global Isolation */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-black/70 backdrop-blur-3xl"
             onClick={closeJarvis}
           />

           {/* ── THE NEURAL STAGE (PROPER RECTANGLE) ───────────────── */}
           <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="relative w-full max-w-6xl h-[85vh] bg-[#0e0e2c]/95 border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl"
             style={{ backgroundColor: colors.indigo }}
           >
              {/* Corner HUD Meta-Data */}
              <div className="absolute top-6 left-8 z-10 hidden md:block">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-mono tracking-widest text-emerald-500/60 uppercase">Link: Secured</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/10 ml-3.5 uppercase tracking-tighter">Model: Gemini 1.5 Pro</span>
                 </div>
              </div>

              {/* Action Buttons (Top Right) */}
              <div className="absolute top-6 right-8 z-10 flex items-center gap-3">
                 <button 
                   onClick={() => setIsListening(!isListening)}
                   className={`p-3 rounded-full transition-all ${isListening ? "bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-white/5 text-white/40 hover:text-white"}`}
                   title="Neural Mic Toggle"
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

              {/* ── LEFT PANE: VOICE ENGINE ────────────────────────── */}
              <motion.div 
                className="w-full md:w-[35%] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 p-8 md:p-12 relative"
              >
                 <div className="mb-8 w-full group cursor-pointer" onClick={() => setIsListening(true)}>
                    <JarvisWaveform isThinking={isThinking} volume={audioLevel} />
                 </div>

                 <AnimatePresence mode="wait">
                    <motion.div
                      key={lastAssistantMessage?.content || "idle"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                       <p className="text-xl md:text-2xl font-light text-white leading-tight italic max-w-xs mx-auto drop-shadow-lg">
                          {lastAssistantMessage ? `"${lastAssistantMessage.content}"` : "Speak Sir. I am listening to your neural signature."}
                       </p>
                    </motion.div>
                 </AnimatePresence>

                 {/* Signal Indicator */}
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
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{isListening ? "Hearing Active" : "Signal Idle"}</span>
                 </div>
              </motion.div>

              {/* ── RIGHT PANE: KNOWLEDGE STAGE ────────────────────── */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white/2">
                 <div className="flex-1 overflow-y-auto p-8 md:p-16 space-y-12 scrollbar-hide">
                    <AnimatePresence mode="wait">
                       <motion.div
                          key={currentIntent}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-10"
                       >
                          {currentIntent === "none" && (
                             <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                                <div className="w-24 h-24 rounded-full bg-[#0020d7]/10 flex items-center justify-center text-[#0020d7] mb-8 border border-[#0020d7]/20 relative">
                                   <div className="absolute inset-0 rounded-full border border-[#0020d7]/40 animate-ping" />
                                   <Globe size={48} className="animate-spin-slow" />
                                </div>
                                <h3 className="text-white/60 font-mono text-xs tracking-[0.5em] uppercase mb-4">Neural Interface Primary</h3>
                                <p className="text-white/30 text-base max-w-sm font-light">"Who are you?", "What have you done?", or "Analyze skills." I am ready to synchronize.</p>
                             </div>
                          )}

                          {currentIntent === "about" && (
                             <div className="p-10 md:p-16 bg-[#0020d7]/10 border border-[#0020d7]/20 rounded-[48px] backdrop-blur-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0020d7]/20 blur-4xl rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                                <h4 className="text-[#0020d7] font-mono text-xs tracking-[0.4em] uppercase mb-6">IDENTITY RECORD // ARCHIVE</h4>
                                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">Abin<br/><span className="text-white/30">Varghese.</span></h2>
                                <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                                   Architecture-focused Lead Front-end specialized in Creative Engineering & 3D Web Experiences. I bridge the gap between brutalist hardware design and fluid software logic.
                                </p>
                             </div>
                          )}

                          {currentIntent === "projects" && (
                             <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                   <h3 className="text-[#0020d7] font-mono text-xs tracking-widest uppercase">Project Modules Detected</h3>
                                   <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-emerald-500">Live Archives</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   {(realProjects.length > 0 ? realProjects.slice(0, 4) : [
                                      { title: "Fluid 3D Engine", tech: "Three.js / React" },
                                      { title: "SaaS System", tech: "Next.js / Prisma" },
                                   ]).map((proj, idx) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-[#0020d7]/40 transition-all cursor-pointer overflow-hidden"
                                      >
                                         <h4 className="text-white font-bold text-xl mb-1">{proj.title}</h4>
                                         <p className="text-xs text-white/30 font-mono mb-6">{proj.tech || "Creative Logic Archive"}</p>
                                         <div className="flex items-center gap-2 text-[10px] text-[#0020d7] font-bold uppercase tracking-[0.2em]">
                                            <span>Access Component</span>
                                            <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                                         </div>
                                      </motion.div>
                                   ))}
                                </div>
                             </div>
                          )}

                          {currentIntent === "skills" && (
                             <div className="space-y-10">
                                <h3 className="text-[#0020d7] font-mono text-xs tracking-[0.4em] uppercase py-2 border-b border-white/5">Neural Skill Sync</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                   {["Next.js", "Three.js", "React", "TypeScript", "Node.js", "GLSL", "Prisma", "GSAP"].map((skill) => (
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
                       </motion.div>
                    </AnimatePresence>
                 </div>

                 {/* Neural Integrated Input Bar */}
                 <div className="p-8 md:p-12 border-t border-white/5 bg-[#0e0e2c]">
                    <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto group">
                       <div className="absolute -inset-1.5 bg-[#0020d7] rounded-full blur-xl opacity-0 group-focus-within:opacity-20 transition-all duration-500" />
                       <input 
                         type="text"
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         placeholder={isListening ? "Listening to your voice..." : "Synthesize neural inquiry..."}
                         className="relative w-full bg-white/5 border border-white/10 px-10 h-16 rounded-full outline-none text-white text-base placeholder:text-white/20 focus:border-[#0020d7]/40 transition-all pr-16"
                       />
                       <button 
                         type="submit"
                         disabled={isThinking}
                         className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center bg-[#0020d7] rounded-full text-white shadow-[0_0_20px_rgba(0,32,215,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                       >
                          <MessageSquare size={20} />
                       </button>
                    </form>
                    <div className="mt-4 text-center">
                       <p className="text-[8px] font-mono text-white/10 uppercase tracking-[0.5em]">{isThinking ? "Processing Neural Signal..." : "Awaiting Command Link"}</p>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
