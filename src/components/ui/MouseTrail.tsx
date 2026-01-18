"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Transform, Vec3, Color, Polyline } from "ogl";

interface MouseTrailProps {
  colors?: string[];
  baseSpring?: number;
  baseFriction?: number;
  baseThickness?: number;
  offsetFactor?: number;
  maxAge?: number;
  pointCount?: number;
  speedMultiplier?: number;
  enableFade?: boolean;
  enableShaderEffect?: boolean;
  effectAmplitude?: number;
  backgroundColor?: [number, number, number, number];
  enableCustomCursor?: boolean;
}

const MouseTrail = ({
  colors,
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
  enableCustomCursor = true,
}: MouseTrailProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const styleElRef = useRef<HTMLStyleElement | null>(null);
  const linesRef = useRef<any[]>([]);
  const [isDark, setIsDark] = useState(false);

  // Get theme-aware colors
  const getThemeColors = () => {
    if (colors) return colors;
    // Always white for difference blend mode
    return ["#ffffff"];
  };

  // Check theme state and update trail colors
  useEffect(() => {
    let previousDark = document.documentElement.classList.contains("dark");

    const checkTheme = () => {
      const nowDark = document.documentElement.classList.contains("dark");
      setIsDark(nowDark);

      // Update trail colors if theme changed and we're not using custom colors
      if (previousDark !== nowDark && !colors && linesRef.current.length > 0) {
        const newColors = ["#ffffff"];
        linesRef.current.forEach((line, index) => {
          if (line.polyline && line.polyline.mesh.program.uniforms.uColor) {
            const colorIndex = Math.min(index, newColors.length - 1);
            line.polyline.mesh.program.uniforms.uColor.value = new Color(
              newColors[colorIndex],
            );
          }
        });
      }

      previousDark = nowDark;
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [colors]);

  useEffect(() => {
    // Check if device is mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) || window.innerWidth < 768;

    // Setup custom Figma-like cursor (desktop only)
    if (enableCustomCursor && !isMobile) {
      // Add global style to hide default cursor on desktop only
      const styleEl = document.createElement("style");
      styleEl.innerHTML =
        "@media (min-width: 768px) { * { cursor: none !important; } }";
      document.head.appendChild(styleEl);
      styleElRef.current = styleEl;

      // Create custom cursor element with the provided SVG
      const cursor = document.createElement("div");
      cursor.style.position = "fixed";
      cursor.style.pointerEvents = "none";
      cursor.style.zIndex = "999999";
      cursor.style.width = "24px";
      cursor.style.height = "24px";
      cursor.style.transform = "translate(-50%, -50%)";
      cursor.style.display = "none"; // Hide by default

      const updateCursor = () => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        const fillColor = isDarkMode ? "white" : "black";
        const strokeColor = isDarkMode ? "black" : "white";

        cursor.innerHTML = `
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Outer stroke -->
            <path d="M20.5056 10.7754C21.1225 10.5355 21.431 10.4155 21.5176 10.2459C21.5926 10.099 21.5903 9.92446 21.5115 9.77954C21.4205 9.61226 21.109 9.50044 20.486 9.2768L4.59629 3.5728C4.0866 3.38983 3.83175 3.29835 3.66514 3.35605C3.52029 3.40621 3.40645 3.52004 3.35629 3.6649C3.29859 3.8315 3.39008 4.08635 3.57304 4.59605L9.277 20.4858C9.50064 21.1088 9.61246 21.4203 9.77973 21.5113C9.92465 21.5901 10.0991 21.5924 10.2461 21.5174C10.4157 21.4308 10.5356 21.1223 10.7756 20.5054L13.3724 13.8278C13.4194 13.707 13.4429 13.6466 13.4792 13.5957C13.5114 13.5506 13.5508 13.5112 13.5959 13.479C13.6468 13.4427 13.7072 13.4192 13.828 13.3722L20.5056 10.7754Z" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Fill and inner stroke -->
            <path d="M20.5056 10.7754C21.1225 10.5355 21.431 10.4155 21.5176 10.2459C21.5926 10.099 21.5903 9.92446 21.5115 9.77954C21.4205 9.61226 21.109 9.50044 20.486 9.2768L4.59629 3.5728C4.0866 3.38983 3.83175 3.29835 3.66514 3.35605C3.52029 3.40621 3.40645 3.52004 3.35629 3.6649C3.29859 3.8315 3.39008 4.08635 3.57304 4.59605L9.277 20.4858C9.50064 21.1088 9.61246 21.4203 9.77973 21.5113C9.92465 21.5901 10.0991 21.5924 10.2461 21.5174C10.4157 21.4308 10.5356 21.1223 10.7756 20.5054L13.3724 13.8278C13.4194 13.707 13.4429 13.6466 13.4792 13.5957C13.5114 13.5506 13.5508 13.5112 13.5959 13.479C13.6468 13.4427 13.7072 13.4192 13.828 13.3722L20.5056 10.7754Z" fill="${fillColor}" stroke="${fillColor}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
      };

      updateCursor();

      // Watch for theme changes
      const observer = new MutationObserver(updateCursor);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      document.body.appendChild(cursor);
      cursorRef.current = cursor;

      // Store observer for cleanup
      (cursor as any)._observer = observer;

      // Show cursor on mouse move (desktop)
      const showCursor = () => {
        cursor.style.display = "block";
      };
      document.addEventListener("mousemove", showCursor, { once: true });
    }

    const container = containerRef.current;
    if (!container) return;

    const themeColors = getThemeColors();

    const renderer = new Renderer({
      dpr: window.devicePixelRatio || 2,
      alpha: true,
    });
    const gl = renderer.gl;
    if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
      gl.clearColor(
        backgroundColor[0],
        backgroundColor[1],
        backgroundColor[2],
        backgroundColor[3],
      );
    } else {
      gl.clearColor(0, 0, 0, 0);
    }
    gl.canvas.style.position = "absolute";
    gl.canvas.style.top = "0";
    gl.canvas.style.left = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.zIndex = "999";
    container.appendChild(gl.canvas);

    const scene = new Transform();
    const lines: any[] = [];

    const vertex = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;
      
      uniform vec2 uResolution;
      uniform float uDPR;
      uniform float uThickness;
      uniform float uTime;
      uniform float uEnableShaderEffect;
      uniform float uEffectAmplitude;
      
      varying vec2 vUV;
      
      vec4 getPosition() {
          vec4 current = vec4(position, 1.0);
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 nextScreen = next.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 tangent = normalize(nextScreen - prevScreen);
          vec2 normal = vec2(-tangent.y, tangent.x);
          normal /= aspect;
          normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
          float dist = length(nextScreen - prevScreen);
          normal *= smoothstep(0.0, 0.02, dist);
          float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
          float pixelWidth = current.w * pixelWidthRatio;
          normal *= pixelWidth * uThickness;
          current.xy -= normal * side;
          if(uEnableShaderEffect > 0.5) {
            current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
          }
          return current;
      }
      
      void main() {
          vUV = uv;
          gl_Position = getPosition();
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uEnableFade;
      varying vec2 vUV;
      void main() {
          float fadeFactor = 1.0;
          if(uEnableFade > 0.5) {
              fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
          }
          gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
      }
    `;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      lines.forEach((line) => line.polyline.resize());
    }
    window.addEventListener("resize", resize);

    // If only one color is provided, we only create a single trail
    // Otherwise, create multiple trails
    const colorsToUse =
      themeColors.length === 1 ? [themeColors[0]] : themeColors;

    colorsToUse.forEach((color, index) => {
      const spring = baseSpring;
      const friction = baseFriction;
      const thickness = baseThickness;

      // Zero offset for a single color, proper spacing for multiple colors
      const mouseOffset = new Vec3(
        themeColors.length === 1
          ? 0
          : (index - (colorsToUse.length - 1) / 2) * offsetFactor,
        0,
        0,
      );

      const line: any = {
        spring,
        friction,
        mouseVelocity: new Vec3(),
        mouseOffset,
      };

      const count = pointCount;
      const points: Vec3[] = [];
      for (let i = 0; i < count; i++) {
        points.push(new Vec3());
      }
      line.points = points;

      line.polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color(color) },
          uThickness: { value: thickness },
          uOpacity: { value: 1.0 },
          uTime: { value: 0.0 },
          uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
          uEffectAmplitude: { value: effectAmplitude },
          uEnableFade: { value: enableFade ? 1.0 : 0.0 },
        },
      });
      line.polyline.mesh.setParent(scene);
      lines.push(line);
    });

    // Store lines reference for theme updates
    linesRef.current = lines;

    resize();

    const mouse = new Vec3();

    // Touch ripple animation for mobile
    function createTouchRipple(clientX: number, clientY: number) {
      const ripple = document.createElement("div");
      const isDarkMode = document.documentElement.classList.contains("dark");

      ripple.style.position = "fixed";
      ripple.style.left = `${clientX}px`;
      ripple.style.top = `${clientY}px`;
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.borderRadius = "50%";
      ripple.style.border = `2px solid ${isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"}`;
      ripple.style.transform = "translate(-50%, -50%) scale(0)";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "999998";
      ripple.style.transition =
        "transform 0.6s ease-out, opacity 0.6s ease-out";
      ripple.style.opacity = "1";

      document.body.appendChild(ripple);

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(4)";
        ripple.style.opacity = "0";
      });

      // Remove after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    function updateMouse(e: MouseEvent | TouchEvent) {
      if (!container) return;
      let x: number, y: number;
      let clientX: number, clientY: number;
      const rect = container.getBoundingClientRect();

      if (
        "changedTouches" in e &&
        e.changedTouches &&
        e.changedTouches.length
      ) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
        x = clientX - rect.left;
        y = clientY - rect.top;

        // Create touch ripple on mobile
        if (isMobile && e.type === "touchstart") {
          createTouchRipple(clientX, clientY);
        }
      } else {
        const mouseEvent = e as MouseEvent;
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY;
        x = clientX - rect.left;
        y = clientY - rect.top;
      }

      // Update custom cursor position (desktop only)
      if (enableCustomCursor && cursorRef.current && !isMobile) {
        cursorRef.current.style.left = `${clientX}px`;
        cursorRef.current.style.top = `${clientY}px`;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
    }

    document.addEventListener("mousemove", updateMouse as any);
    document.addEventListener("touchstart", updateMouse as any);
    document.addEventListener("touchmove", updateMouse as any);

    const tmp = new Vec3();
    let frameId: number;
    let lastTime = performance.now();
    function update() {
      frameId = requestAnimationFrame(update);
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      lastTime = currentTime;

      lines.forEach((line) => {
        tmp
          .copy(mouse)
          .add(line.mouseOffset)
          .sub(line.points[0])
          .multiply(line.spring);
        line.mouseVelocity.add(tmp).multiply(line.friction);
        line.points[0].add(line.mouseVelocity);

        for (let i = 1; i < line.points.length; i++) {
          if (isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / (line.points.length - 1);
            const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
            line.points[i].lerp(line.points[i - 1], alpha);
          } else {
            line.points[i].lerp(line.points[i - 1], 0.9);
          }
        }
        if (line.polyline.mesh.program.uniforms.uTime) {
          line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
        }
        line.polyline.updateGeometry();
      });

      renderer.render({ scene });
    }
    update();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", updateMouse as any);
      document.removeEventListener("touchstart", updateMouse as any);
      document.removeEventListener("touchmove", updateMouse as any);
      cancelAnimationFrame(frameId);
      if (gl.canvas && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }

      // Clean up custom cursor
      if (enableCustomCursor && cursorRef.current) {
        const cursor = cursorRef.current as any;
        if (cursor._observer) {
          cursor._observer.disconnect();
        }
        document.body.removeChild(cursor);
        if (styleElRef.current) {
          document.head.removeChild(styleElRef.current);
        }
      }
    };
  }, [
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor,
    enableCustomCursor,
    isDark,
  ]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none mix-blend-difference"
      style={{ zIndex: 999 }}
    />
  );
};

export default MouseTrail;
