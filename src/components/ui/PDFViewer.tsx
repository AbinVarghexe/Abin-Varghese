'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';

/**
 * Cross-platform PDF viewer.
 * - Desktop: native iframe PDF rendering
 * - Mobile: first-page canvas thumbnail + Open/Download actions
 */

interface PDFViewerProps {
  url: string;
  title?: string;
}

/** Renders a single-page PDF thumbnail to a canvas (client-side only). */
function PdfThumbnail({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');

        // Pin worker to exact CDN version — avoids local file cache mismatches
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);

        if (cancelled || !canvasRef.current) return;

        // Render at a small scale for the thumbnail
        const baseViewport = page.getViewport({ scale: 1 });
        const thumbWidth = Math.min(window.innerWidth - 80, 320);
        const thumbScale = thumbWidth / baseViewport.width;
        const viewport = page.getViewport({ scale: thumbScale });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        ctx.scale(dpr, dpr);

        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!cancelled) setStatus('done');
      } catch (err) {
        console.error('Thumbnail render failed:', err);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  if (status === 'error') {
    return (
      <div className="w-full max-w-[280px] aspect-[8.5/11] bg-white rounded-xl border-2 border-[#d4bc96]/40 flex flex-col items-center justify-center gap-3 shadow-lg">
        <FileText className="w-10 h-10 text-[#8b5a2b]/30" />
        <p className="text-xs text-[#8b5a2b]/50 font-serif">Preview unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[280px]">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-xl border-2 border-[#d4bc96]/40 shadow-lg z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#8b5a2b]/20 border-t-[#8b5a2b] rounded-full animate-spin" />
            <p className="text-xs text-[#8b5a2b]/60 font-serif italic animate-pulse">Loading preview...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full rounded-xl border-2 border-[#d4bc96]/40 shadow-lg bg-white"
      />
    </div>
  );
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, title = 'Document' }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ─── Mobile: Thumbnail preview + action buttons ──────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col items-center w-full h-full bg-[#fdfaf5]/50 overflow-y-auto px-4 py-8 gap-6">
        {/* First-page preview thumbnail */}
        <PdfThumbnail url={url} />

        {/* Title */}
        <div className="text-center">
          <h3 className="text-base font-serif font-bold text-[#4a331e] uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-[10px] text-[#8b5a2b]/50 font-mono uppercase tracking-widest mt-1">
            Page 1 Preview
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 w-full max-w-[300px]">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8b5a2b] text-[#fdfaf5] rounded-full font-serif text-xs font-bold uppercase tracking-[0.1em] shadow-lg shadow-[#8b5a2b]/25 hover:bg-[#5a3b1c] transition-all active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
          <a
            href={url}
            download
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-[#8b5a2b]/30 text-[#8b5a2b] rounded-full font-serif text-xs font-bold uppercase tracking-[0.1em] shadow-sm hover:border-[#8b5a2b] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>
    );
  }

  // ─── Desktop: Native iframe PDF viewer ───────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-[#f4e8d1]/30 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #8b5a2b 0px, #8b5a2b 1px, transparent 1px, transparent 15px)',
        }}
      />

      {!iframeLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-[#fdfaf5]/80">
          <div className="w-10 h-10 border-3 border-[#8b5a2b]/20 border-t-[#8b5a2b] rounded-full animate-spin" />
          <p className="text-[#8b5a2b] font-serif italic text-sm animate-pulse">
            Unrolling the chronicle...
          </p>
        </div>
      )}

      <iframe
        src={`${url}#toolbar=1&navpanes=0`}
        title={title}
        className="w-full h-full relative border-0 z-0"
        style={{ colorScheme: 'light' }}
        onLoad={() => setIframeLoaded(true)}
      />
    </div>
  );
};

export default PDFViewer;
