"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Filter,
  Maximize2,
  Minus,
  Network,
  Plus,
  Search,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

type NodeColor =
  | "blue"
  | "purple"
  | "cyan"
  | "green"
  | "orange"
  | "pink"
  | "yellow";

interface NetworkNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  size: number;
  influence: string;
  color: NodeColor;
}

const nodes: NetworkNode[] = [
  {
    id: "central",
    name: "Public Figure",
    type: "Monitored Profile",
    x: 50,
    y: 50,
    size: 82,
    influence: "94",
    color: "blue",
  },
  {
    id: "sportsmedia",
    name: "Sports Media",
    type: "Media",
    x: 23,
    y: 27,
    size: 58,
    influence: "82",
    color: "purple",
  },
  {
    id: "creator",
    name: "Top Creator",
    type: "Influencer",
    x: 77,
    y: 25,
    size: 62,
    influence: "79",
    color: "cyan",
  },
  {
    id: "fans",
    name: "Fan Community",
    type: "Community",
    x: 78,
    y: 70,
    size: 56,
    influence: "73",
    color: "green",
  },
  {
    id: "news",
    name: "News Network",
    type: "Media",
    x: 23,
    y: 73,
    size: 54,
    influence: "68",
    color: "orange",
  },
  {
    id: "analyst",
    name: "Analyst",
    type: "Creator",
    x: 50,
    y: 15,
    size: 45,
    influence: "61",
    color: "pink",
  },
  {
    id: "community",
    name: "Sports Community",
    type: "Community",
    x: 51,
    y: 85,
    size: 48,
    influence: "57",
    color: "yellow",
  },
];

const connections: [string, string][] = [
  ["central", "sportsmedia"],
  ["central", "creator"],
  ["central", "fans"],
  ["central", "news"],
  ["central", "analyst"],
  ["central", "community"],
  ["sportsmedia", "analyst"],
  ["sportsmedia", "news"],
  ["creator", "analyst"],
  ["creator", "fans"],
  ["fans", "community"],
  ["news", "community"],
];

const colorMap: Record<NodeColor, string> = {
  blue: "border-[#457B9D] text-[#457B9D] bg-white shadow-[#457B9D]/20",
  purple: "border-purple-500 text-purple-600 bg-white shadow-purple-500/20",
  cyan: "border-cyan-500 text-cyan-600 bg-white shadow-cyan-500/20",
  green: "border-emerald-500 text-emerald-600 bg-white shadow-emerald-500/20",
  orange: "border-orange-500 text-orange-600 bg-white shadow-orange-500/20",
  pink: "border-pink-500 text-pink-600 bg-white shadow-pink-500/20",
  yellow: "border-amber-500 text-amber-600 bg-white shadow-amber-500/20",
};

export default function InfluencePage() {
  const [selectedNode, setSelectedNode] = useState("central");
  const [zoom, setZoom] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selected = nodes.find((node) => node.id === selectedNode);
  const getNode = (id: string) => nodes.find((node) => node.id === id)!;

  return (
    <div className="min-h-screen bg-[#fafafa] bg-grid-dashboard text-zinc-900 selection:bg-[#457B9D]/20">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="lg:ml-[270px]">
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <div className="p-4 sm:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* ================================================== */}
            {/* HEADER                                             */}
            {/* ================================================== */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Network size={16} className="text-[#457B9D]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#457B9D]">
                    Network Intelligence
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-zinc-950">
                  Influence Network
                </h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600">
                  Discover how accounts, key creators, media outlets, and communities interact around your monitored profile.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Network live
              </div>
            </div>

            {/* ================================================== */}
            {/* NETWORK CANVAS CONTAINER                           */}
            {/* ================================================== */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                    <Activity size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">
                      Live relationship map
                    </p>
                    <p className="text-xs text-zinc-500">
                      7 entities · 12 connections
                    </p>
                  </div>
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoom((v) => Math.max(0.7, v - 0.1))}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="Zoom out"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-12 text-center text-xs font-semibold text-zinc-600">
                    {Math.round(zoom * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setZoom((v) => Math.min(1.4, v + 0.1))}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="Zoom in"
                  >
                    <Plus size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setZoom(1)}
                    className="ml-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                    aria-label="Reset zoom"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div
                className="relative h-[550px] overflow-hidden bg-slate-50/50"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(15, 23, 42, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: "36px 36px",
                }}
              >
                {/* SVG Connections */}
                <svg
                  className="absolute inset-0 h-full w-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#457B9D" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {connections.map(([from, to]) => {
                    const start = getNode(from);
                    const end = getNode(to);
                    const isCentral = from === "central" || to === "central";

                    return (
                      <line
                        key={`${from}-${to}`}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={isCentral ? "#457B9D" : "rgba(100, 116, 139, 0.3)"}
                        strokeWidth={isCentral ? "0.35" : "0.2"}
                        strokeDasharray={isCentral ? "1 0.8" : "0.6 1"}
                      />
                    );
                  })}
                </svg>

                {/* Nodes */}
                <div
                  className="absolute inset-0 transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                >
                  {nodes.map((node) => {
                    const isSelected = selectedNode === node.id;

                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNode(node.id)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                        }}
                      >
                        {/* Pulse effect */}
                        {node.id === "central" && (
                          <span
                            className="absolute rounded-full bg-[#457B9D]/15 animate-ping"
                            style={{
                              width: node.size + 16,
                              height: node.size + 16,
                              left: -8,
                              top: -8,
                            }}
                          />
                        )}

                        {/* Node circle */}
                        <span
                          className={`relative flex items-center justify-center rounded-full border-2 bg-white shadow-md transition-all duration-200 ${
                            colorMap[node.color]
                          } ${
                            isSelected
                              ? "scale-110 ring-4 ring-[#457B9D]/20"
                              : "hover:scale-105"
                          }`}
                          style={{
                            width: node.size,
                            height: node.size,
                          }}
                        >
                          <span className="relative flex flex-col items-center">
                            {node.id === "central" ? (
                              <Network size={22} className="text-[#457B9D]" />
                            ) : (
                              <Users size={17} />
                            )}
                            <span className="mt-0.5 text-[11px] font-extrabold text-zinc-900">
                              {node.influence}
                            </span>
                          </span>
                        </span>

                        {/* Node label */}
                        <span className="absolute left-1/2 top-full mt-2 w-max -translate-x-1/2 pointer-events-none">
                          <span
                            className={`block text-xs font-bold text-center ${
                              isSelected ? "text-[#457B9D]" : "text-zinc-800"
                            }`}
                          >
                            {node.name}
                          </span>
                          <span className="block text-[10px] text-zinc-400 text-center">
                            {node.type}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-xs backdrop-blur-md">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Network tiers
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#457B9D]" />
                      Primary (90+)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                      Media (75+)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Community (50+)
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Entity Details Panel */}
              {selected && (
                <div className="border-t border-zinc-100 bg-white p-5 sm:px-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-zinc-950">
                            {selected.name}
                          </p>
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#457B9D]">
                            {selected.type}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          Active amplifier detected in connected networks.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Influence score
                        </p>
                        <p className="text-base font-extrabold text-zinc-950">
                          {selected.influence}/100
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          Direct links
                        </p>
                        <p className="text-base font-extrabold text-zinc-950">
                          {
                            connections.filter(
                              ([from, to]) =>
                                from === selected.id || to === selected.id
                            ).length
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedNode("central")}
                        className="rounded-xl border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition"
                        aria-label="Reset selected node"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ================================================== */}
            {/* NETWORK METRICS                                    */}
            {/* ================================================== */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Network}
                label="Connected entities"
                value="7"
                description="Across monitored platforms"
              />
              <MetricCard
                icon={Users}
                label="High influence"
                value="3"
                description="Key driving voices"
              />
              <MetricCard
                icon={Activity}
                label="Active connections"
                value="12"
                description="Detected in the last 24h"
              />
              <MetricCard
                icon={Zap}
                label="Network growth"
                value="+18.6%"
                description="vs previous period"
                positive
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================================================== */
/* METRIC CARD                                        */
/* ================================================== */

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  positive = false,
}: {
  icon: typeof Network;
  label: string;
  value: string;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition duration-200 hover:border-zinc-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#457B9D]/20 bg-[#457B9D]/10 text-[#457B9D]">
          <Icon size={18} />
        </div>

        {positive && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            Live
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-1.5 text-xs text-zinc-500">
        {description}
      </p>
    </div>
  );
}