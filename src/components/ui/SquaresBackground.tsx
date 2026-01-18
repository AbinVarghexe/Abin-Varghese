'use client';

import { useEffect, useRef, useState } from 'react';

interface SquaresBackgroundProps {
  squareSize?: number;
  gridGap?: number;
  strokeWidth?: number;
  maxOpacity?: number;
  strokeColor?: string;
  className?: string;
}

export default function SquaresBackground({
  squareSize = 50,
  gridGap = 0,
  strokeWidth = 1,
  maxOpacity = 0.3,
  strokeColor,
  className = '',
}: SquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect theme changes and mobile device
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial theme and device
    checkTheme();
    checkMobile();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Watch for resize to update mobile state
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const width = parent.offsetWidth || window.innerWidth;
        const height = parent.offsetHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      // Ensure canvas is properly sized before drawing
      if (canvas.width > 0 && canvas.height > 0) {
        drawSquares();
      }
    };

    const drawSquares = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use smaller squares on mobile (30px vs 50px default)
      const effectiveSquareSize = isMobile ? Math.min(squareSize * 0.6, 30) : squareSize;
      const effectiveStrokeWidth = isMobile ? strokeWidth * 0.8 : strokeWidth;

      const cols = Math.ceil(canvas.width / (effectiveSquareSize + gridGap));
      const rows = Math.ceil(canvas.height / (effectiveSquareSize + gridGap));

      // Calculate center point for radial fade
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

      // Determine stroke color based on theme if not provided
      let effectiveStrokeColor = strokeColor;
      if (!effectiveStrokeColor) {
        // Light mode: dark squares, Dark mode: light squares
        effectiveStrokeColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      }

      // Parse base RGB values from strokeColor
      let baseRgb = isDark ? '255, 255, 255' : '0, 0, 0';
      if (effectiveStrokeColor.startsWith('rgba')) {
        const rgbMatch = effectiveStrokeColor.match(/rgba?\(([^)]+)\)/);
        if (rgbMatch) {
          baseRgb = rgbMatch[1].split(',').slice(0, 3).join(',');
        }
      }

      ctx.lineWidth = effectiveStrokeWidth;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (effectiveSquareSize + gridGap);
          const y = j * (effectiveSquareSize + gridGap);

          // Calculate center of square
          const squareCenterX = x + effectiveSquareSize / 2;
          const squareCenterY = y + effectiveSquareSize / 2;

          // Calculate distance from center of canvas
          const dx = squareCenterX - centerX;
          const dy = squareCenterY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate radial fade factor (1.0 at center, 0.0 at edges)
          // Normalize distance to 0-1 range (0 = center, 1 = edge)
          const normalizedDistance = distance / maxDistance;

          // Create subtle radial fade: center fully visible, edges fade slightly
          // Reduced fade effect for a more subtle vignette
          let radialFadeFactor = 1.0;

          if (normalizedDistance > 0.6) {
            // Start fading at 60% from center (more subtle)
            // Smooth transition from 0.6 to 0.9 (where it becomes fully transparent)
            const fadeStart = 0.6;
            const fadeEnd = 0.9;
            const fadeRange = fadeEnd - fadeStart;

            if (normalizedDistance < fadeEnd) {
              // Calculate fade progress (0 to 1)
              const fadeProgress = (normalizedDistance - fadeStart) / fadeRange;
              // Use gentler easing for subtle fade
              radialFadeFactor = Math.max(0, 1 - Math.pow(fadeProgress, 1.5));
            } else {
              // Beyond fade end, fully transparent
              radialFadeFactor = 0;
            }
          }

          // Calculate bottom fade factor
          // Distance from bottom of canvas
          const distanceFromBottom = canvas.height - squareCenterY;
          const normalizedBottomDistance = distanceFromBottom / canvas.height;

          let bottomFadeFactor = 1.0;

          // Start fading from bottom at 70% of canvas height
          if (normalizedBottomDistance < 0.3) {
            // Fade from 30% to 0% from bottom
            const bottomFadeStart = 0.3;
            const bottomFadeEnd = 0.0;
            const bottomFadeRange = bottomFadeStart - bottomFadeEnd;

            if (normalizedBottomDistance > bottomFadeEnd) {
              const bottomFadeProgress = (bottomFadeStart - normalizedBottomDistance) / bottomFadeRange;
              // Use smooth easing for bottom fade
              bottomFadeFactor = Math.max(0, 1 - Math.pow(bottomFadeProgress, 1.5));
            } else {
              bottomFadeFactor = 0;
            }
          }

          // Combine both fade factors (multiply them)
          const combinedFadeFactor = radialFadeFactor * bottomFadeFactor;

          // Apply combined fade to opacity
          const opacity = maxOpacity * combinedFadeFactor;

          // Set stroke color with calculated opacity
          ctx.strokeStyle = `rgba(${baseRgb}, ${opacity})`;

          ctx.strokeRect(x, y, effectiveSquareSize, effectiveSquareSize);
        }
      }
    };

    // Initial draw
    resizeCanvas();

    // Ensure canvas is redrawn after a brief delay to handle any layout issues
    const timeoutId = setTimeout(() => {
      resizeCanvas();
    }, 100);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [squareSize, gridGap, strokeWidth, maxOpacity, strokeColor, isDark, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
