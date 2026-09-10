"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/src/lib/utils";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export const SparklesCore: React.FC<SparklesProps> = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 2.4,
  particleDensity = 60,
  className,
  particleColor = "#38bdf8",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const count = Math.floor((width * height) / (10000 / (particleDensity / 50)));
    const particles = Array.from({ length: Math.min(count, 120) }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseDirection: Math.random() > 0.5 ? 1 : -1,
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.parentElement?.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        // Subtle drift
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle
        p.opacity += p.pulseSpeed * p.pulseDirection;
        if (p.opacity > 0.9) {
          p.opacity = 0.9;
          p.pulseDirection = -1;
        } else if (p.opacity < 0.15) {
          p.opacity = 0.15;
          p.pulseDirection = 1;
        }

        // Mouse proximity glow
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let currentOpacity = p.opacity;
        let currentSize = p.size;

        if (dist < 100) {
          currentOpacity = Math.min(1, p.opacity + (1 - dist / 100) * 0.5);
          currentSize = p.size * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = currentOpacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = particleColor;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [background, maxSize, minSize, particleColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
};
