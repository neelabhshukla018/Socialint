"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

interface GridSparklesProps {
  density?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  type: "star" | "dot";
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  minOpacity: number;
  maxOpacity: number;
  phase: number;
  pulseSpeed: number;
  rotation: number;
  rotSpeed: number;
}

const LIGHT_PALETTE = [
  "#0284c7", // sky-600
  "#457B9D", // brand cyan-steel
  "#2563eb", // blue-600
  "#6366f1", // indigo-500
  "#0d9488", // teal-600
  "#d97706", // warm amber
];

const DARK_PALETTE = [
  "#38bdf8", // sky-400
  "#67e8f9", // cyan-300
  "#818cf8", // indigo-400
  "#a78bfa", // violet-400
  "#457B9D", // brand accent
  "#ffffff", // pure star white
];

export default function GridSparkles({
  density = 48,
  className = "",
}: GridSparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isLight = resolvedTheme === "light";
    const palette = isLight ? LIGHT_PALETTE : DARK_PALETTE;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse coordinates for interactive spread/reactivity
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Initialize particles spread across viewport
    const count = Math.min(Math.max(density, 25), 80);
    const particles: Particle[] = Array.from({ length: count }).map(() => {
      const type: "star" | "dot" = Math.random() > 0.45 ? "star" : "dot";
      const baseSize = type === "star" ? Math.random() * 3.5 + 2.2 : Math.random() * 2.2 + 1.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        type,
        color: palette[Math.floor(Math.random() * palette.length)],
        speedX: (Math.random() - 0.5) * 0.28,
        speedY: (Math.random() - 0.5) * 0.28,
        opacity: Math.random() * 0.5 + 0.2,
        minOpacity: isLight ? 0.15 : 0.2,
        maxOpacity: isLight ? 0.72 : 0.88,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.024 + 0.012,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      };
    });

    const drawStar = (
      pCtx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      angle: number
    ) => {
      let rot = (Math.PI / 2) * 3 + angle;
      const step = Math.PI / spikes;

      pCtx.beginPath();
      pCtx.moveTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      for (let i = 0; i < spikes; i++) {
        rot += step;
        pCtx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
        pCtx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      }
      pCtx.closePath();
      pCtx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap edges gracefully
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Twinkle pulse
        p.phase += p.pulseSpeed;
        const normPulse = 0.5 + 0.5 * Math.sin(p.phase);
        let alpha = p.minOpacity + (p.maxOpacity - p.minOpacity) * normPulse;

        // Interactive mouse spread: gently nudge particles away from cursor
        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pushRadius = 140;

          if (dist < pushRadius && dist > 0.01) {
            const force = (1 - dist / pushRadius) * 0.95;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            // Flare brightness when cursor approaches
            alpha = Math.min(alpha + force * 0.35, 1);
          }
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;

        if (p.type === "star") {
          p.rotation += p.rotSpeed;
          // Four-pointed diamond star sparkle
          drawStar(ctx, p.x, p.y, 4, p.size * 1.4, p.size * 0.32, p.rotation);
        } else {
          // Soft glowing dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [density, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
