"use client";

import { signIn } from "next-auth/react";
import { Github, AlertTriangle } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-neutral-950/80 border border-neutral-800/50 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/80">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
          <svg
            className="w-8 h-8 text-neutral-300 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">The Batcave</h1>
        <p className="text-neutral-400 mt-2 text-sm">Authorized Personnel Only</p>
      </div>

      {error === "AccessDenied" && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Intruder Alert</span>
            <span className="text-red-300/80 text-xs mt-1">This identity is not authorized to access the Batcomputer. Access Denied.</span>
          </div>
        </div>
      )}

      {error === "OAuthAccountNotLinked" && (
        <div className="mb-6 p-4 bg-yellow-950/50 border border-yellow-500/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Authentication Collision</span>
            <span className="text-yellow-300/80 text-xs mt-1">You previously signed in with a different provider using this email address. Please sign in using the original provider (Google).</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
          <button
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
            className="w-full relative group flex items-center justify-center gap-3 px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Github className="w-5 h-5 relative z-10" />
            <span className="font-medium tracking-wide relative z-10">Authenticate via GitHub</span>
          </button>

          <button
            onClick={() => signIn("google", { callbackUrl: "/admin" })}
            className="w-full relative group flex items-center justify-center gap-3 px-6 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-medium tracking-wide relative z-10">Authenticate via Google</span>
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800/50 flex justify-center">
             <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full font-medium tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
               SYSTEMS ONLINE
             </div>
        </div>
      </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-neutral-900/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] md:w-[500px] h-[400px] md:h-[500px] bg-neutral-900/30 blur-[100px] rounded-full pointer-events-none" />

      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-neutral-950/80 border border-neutral-800/50 backdrop-blur-xl rounded-3xl shadow-2xl flex items-center justify-center h-[400px]">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
