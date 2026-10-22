"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export interface NeonBorderBeamProps {
  className?: string;
  duration?: number; // Seconds for one complete loop around the navbar (default 5s)
  beamLength?: number; // Length in pixels of the chasing beam (default auto ~16% of perimeter)
  colorFrom?: string; // Leading neon color (default steel/slate blue #7496AF)
  colorMid?: string; // Mid tone (default #4F7A9A from user image)
  colorTo?: string; // Trailing neon color (default deep steel blue #365874)
  strokeWidth?: number; // Ultra-fine razor-thin breadth (default 0.85)
}

/**
 * NeonBorderBeam renders a sleek, ultra-fine neon line in the exact steel-slate blue
 * shade that continuously chases around the rounded-full perimeter of the navbar.
 */
export function NeonBorderBeam({
  className,
  duration = 5,
  beamLength,
  colorFrom = "#7496AF",
  colorMid = "#4F7A9A",
  colorTo = "#365874",
  strokeWidth = 0.85,
}: NeonBorderBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [perimeter, setPerimeter] = useState<number>(1800);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updatePerimeter = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      if (w > 0 && h > 0) {
        setDimensions({ width: w, height: h });

        // Pill shape perimeter: 2 straight lines + 2 semicircles
        const r = h / 2;
        const straightEdge = Math.max(0, w - h);
        const calculatedPerimeter = 2 * straightEdge + 2 * Math.PI * r;

        // Verify with SVG native getTotalLength if available
        if (rectRef.current) {
          try {
            const svgLength = rectRef.current.getTotalLength();
            if (svgLength > 0) {
              setPerimeter(svgLength);
              return;
            }
          } catch {}
        }

        setPerimeter(calculatedPerimeter);
      }
    };

    updatePerimeter();

    const resizeObserver = new ResizeObserver(() => {
      updatePerimeter();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updatePerimeter, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePerimeter);
    };
  }, []);

  // Compact, tasteful length: ~16% of perimeter (around 130px - 220px)
  const effectiveBeamLength = beamLength ?? Math.max(120, Math.min(220, perimeter * 0.16));
  const effectiveGap = Math.max(1, perimeter - effectiveBeamLength);
  const radius = dimensions.height > 0 ? dimensions.height / 2 : 9999;
  const isMeasured = dimensions.width > 0 && dimensions.height > 0;
  const rectWidth = isMeasured ? Math.max(0, dimensions.width - 2) : "calc(100% - 2px)";
  const rectHeight = isMeasured ? Math.max(0, dimensions.height - 2) : "calc(100% - 2px)";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        opacity: isMeasured ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      className={cn(
        "pointer-events-none absolute -inset-[1px] rounded-[inherit] overflow-visible z-20",
        className
      )}
    >
      <svg
        className="h-full w-full overflow-visible rounded-[inherit]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Steel-slate blue gradient matching photo */}
          <linearGradient id="neon-chasing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0.2" />
          </linearGradient>

          {/* Soft steel bloom filter */}
          <filter id="neon-chasing-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Subtle ambient outer aura in steel-slate blue */}
        <motion.rect
          x={1}
          y={1}
          width={rectWidth}
          height={rectHeight}
          rx={radius}
          ry={radius}
          fill="none"
          stroke={colorMid}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeDasharray={`${effectiveBeamLength} ${effectiveGap}`}
          opacity={0.3}
          animate={{
            strokeDashoffset: [0, -perimeter],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter: "blur(2.5px)",
          }}
        />

        {/* Layer 2: Main sleek steel-slate blue chasing laser line */}
        <motion.rect
          ref={rectRef}
          x={1}
          y={1}
          width={rectWidth}
          height={rectHeight}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="url(#neon-chasing-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${effectiveBeamLength} ${effectiveGap}`}
          animate={{
            strokeDashoffset: [0, -perimeter],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter:
              "drop-shadow(0 0 2.5px #4F7A9A) drop-shadow(0 0 6px rgba(79, 122, 154, 0.8)) drop-shadow(0 0 10px rgba(116, 150, 175, 0.4))",
          }}
        />

        {/* Layer 3: Ultra-fine illuminated core */}
        <motion.rect
          x={1}
          y={1}
          width={rectWidth}
          height={rectHeight}
          rx={radius}
          ry={radius}
          fill="none"
          stroke="#EBF3F8"
          strokeWidth={Math.max(0.5, strokeWidth - 0.3)}
          strokeLinecap="round"
          strokeDasharray={`${effectiveBeamLength * 0.7} ${perimeter - effectiveBeamLength * 0.7}`}
          opacity={0.8}
          animate={{
            strokeDashoffset: [0, -perimeter],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter: "drop-shadow(0 0 1px #ffffff)",
          }}
        />
      </svg>
    </div>
  );
}

export default NeonBorderBeam;
