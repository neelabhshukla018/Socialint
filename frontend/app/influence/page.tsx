"use client";

import { useState } from "react";

import {
  Activity,
  ArrowUpRight,
  ChevronDown,
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


/* ================================================== */
/* TYPES                                              */
/* ================================================== */

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


/* ================================================== */
/* NETWORK NODES                                      */
/* ================================================== */

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


/* ================================================== */
/* CONNECTIONS                                        */
/* ================================================== */

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


/* ================================================== */
/* NODE COLORS                                        */
/* ================================================== */

const colorMap: Record<NodeColor, string> = {
  blue:
    "from-blue-400 to-indigo-500 shadow-blue-500/40",

  purple:
    "from-purple-400 to-violet-500 shadow-purple-500/40",

  cyan:
    "from-cyan-300 to-blue-500 shadow-cyan-500/40",

  green:
    "from-emerald-300 to-green-500 shadow-emerald-500/40",

  orange:
    "from-orange-300 to-red-500 shadow-orange-500/40",

  pink:
    "from-pink-300 to-purple-500 shadow-pink-500/40",

  yellow:
    "from-yellow-200 to-orange-400 shadow-yellow-500/40",
};


/* ================================================== */
/* PAGE                                               */
/* ================================================== */

export default function InfluencePage() {
  const [selectedNode, setSelectedNode] =
    useState("central");

  const [zoom, setZoom] = useState(1);

  const selected = nodes.find(
    (node) => node.id === selectedNode
  );


  const getNode = (id: string) =>
    nodes.find(
      (node) => node.id === id
    )!;


  return (
    <main className="min-h-screen overflow-hidden bg-[#080b12] text-white">

      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <div className="mb-1.5 flex items-center gap-2">

              <Network
                size={16}
                className="text-blue-400"
              />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Network Intelligence
              </span>

            </div>


            <h1 className="font-display text-3xl tracking-wide text-white sm:text-4xl">
              Influence Network
            </h1>

          </div>


          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}

            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm text-zinc-400 transition hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white sm:flex"
            >

              <Search size={16} />

              Search network

            </button>


            {/* Filters */}

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.07]"
            >

              <Filter size={16} />

              <span className="hidden sm:inline">
                Filters
              </span>

            </button>

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}

      <div className="relative px-5 py-7 sm:px-8 sm:py-8">

        {/* Background glow */}

        <div className="pointer-events-none absolute left-[30%] top-20 h-[550px] w-[550px] rounded-full bg-blue-500/[0.035] blur-[110px]" />

        <div className="pointer-events-none absolute right-0 top-[45%] h-[450px] w-[450px] rounded-full bg-purple-500/[0.025] blur-[110px]" />


        {/* ================================================== */}
        {/* INTRO                                              */}
        {/* ================================================== */}

        <section className="relative z-10 mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
              Relationship map
            </h2>


            <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-400">
              Discover how accounts, creators, media and
              communities interact around your monitored profile.
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-400">
                Network live
              </span>

            </div>


            <span className="text-sm text-zinc-500">
              Updated 2 min ago
            </span>

          </div>

        </section>


        {/* ================================================== */}
        {/* NETWORK CARD                                       */}
        {/* ================================================== */}

        <section className="relative z-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b0f18]/95 shadow-2xl shadow-black/25">

          {/* ================================================== */}
          {/* TOOLBAR                                            */}
          {/* ================================================== */}

          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">

                <Activity
                  size={17}
                  className="text-blue-400"
                />

              </div>


              <div>

                <p className="text-sm font-semibold text-zinc-100">
                  Live relationship map
                </p>

                <p className="mt-0.5 text-xs text-zinc-500">
                  7 entities · 12 connections
                </p>

              </div>

            </div>


            {/* Zoom */}

            <div className="flex items-center gap-1.5">

              <button
                type="button"
                onClick={() =>
                  setZoom((value) =>
                    Math.max(
                      0.7,
                      value - 0.1
                    )
                  )
                }
                className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Zoom out"
              >
                <Minus size={15} />
              </button>


              <span className="w-14 text-center text-xs font-medium text-zinc-500">
                {Math.round(
                  zoom * 100
                )}
                %
              </span>


              <button
                type="button"
                onClick={() =>
                  setZoom((value) =>
                    Math.min(
                      1.4,
                      value + 0.1
                    )
                  )
                }
                className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Zoom in"
              >
                <Plus size={15} />
              </button>


              <button
                type="button"
                onClick={() =>
                  setZoom(1)
                }
                className="ml-1 rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Reset zoom"
              >
                <Maximize2 size={15} />
              </button>

            </div>

          </div>


          {/* ================================================== */}
          {/* GRAPH                                              */}
          {/* ================================================== */}

          <div
            className="relative h-[620px] overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(
                  to right,
                  rgba(148,163,184,0.035) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(148,163,184,0.035) 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "40px 40px",
            }}
          >

            {/* Animated waves */}

            <div className="network-wave network-wave-one" />

            <div className="network-wave network-wave-two" />

            <div className="network-wave network-wave-three" />


            {/* ================================================== */}
            {/* CONNECTION LINES                                   */}
            {/* ================================================== */}

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              <defs>

                <linearGradient
                  id="connectionGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >

                  <stop
                    offset="0%"
                    stopColor="#60a5fa"
                    stopOpacity="0.12"
                  />

                  <stop
                    offset="50%"
                    stopColor="#818cf8"
                    stopOpacity="0.55"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                    stopOpacity="0.12"
                  />

                </linearGradient>


                <filter id="glow">

                  <feGaussianBlur
                    stdDeviation="0.45"
                    result="blur"
                  />

                  <feMerge>

                    <feMergeNode in="blur" />

                    <feMergeNode in="SourceGraphic" />

                  </feMerge>

                </filter>

              </defs>


              {connections.map(
                ([from, to], index) => {

                  const start =
                    getNode(from);

                  const end =
                    getNode(to);

                  const centralConnection =
                    from === "central" ||
                    to === "central";

                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="url(#connectionGradient)"
                      strokeWidth={
                        centralConnection
                          ? "0.28"
                          : "0.16"
                      }
                      strokeDasharray={
                        centralConnection
                          ? "1.2 1"
                          : "0.7 1.2"
                      }
                      filter="url(#glow)"
                      className="network-line"
                      style={{
                        animationDelay:
                          `${index * 0.35}s`,
                      }}
                    />
                  );
                }
              )}

            </svg>


            {/* ================================================== */}
            {/* NODES                                              */}
            {/* ================================================== */}

            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform:
                  `scale(${zoom})`,
              }}
            >

              {nodes.map((node) => {

                const isSelected =
                  selectedNode ===
                  node.id;


                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() =>
                      setSelectedNode(
                        node.id
                      )
                    }
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left:
                        `${node.x}%`,
                      top:
                        `${node.y}%`,
                    }}
                  >

                    {/* Pulse */}

                    <span
                      className={`absolute rounded-full bg-blue-500/10 ${
                        node.id ===
                        "central"
                          ? "animate-node-pulse"
                          : ""
                      }`}
                      style={{
                        width:
                          node.size +
                          24,
                        height:
                          node.size +
                          24,
                        left: -12,
                        top: -12,
                      }}
                    />


                    {/* Node */}

                    <span
                      className={`
                        relative flex items-center justify-center
                        rounded-full
                        border border-white/10
                        bg-gradient-to-br
                        ${colorMap[node.color]}
                        shadow-2xl
                        transition-all
                        duration-300
                        ${
                          isSelected
                            ? "scale-110 ring-2 ring-white/30"
                            : "hover:scale-105"
                        }
                      `}
                      style={{
                        width:
                          node.size,
                        height:
                          node.size,
                      }}
                    >

                      <span className="absolute inset-[2px] rounded-full bg-[#101722]/95" />


                      <span className="relative flex flex-col items-center">

                        {node.id ===
                        "central" ? (
                          <Network
                            size={25}
                            className="text-blue-300"
                          />
                        ) : (
                          <Users
                            size={19}
                            className="text-zinc-300"
                          />
                        )}


                        {/* Numbers intentionally normal font */}

                        <span className="mt-1 text-xs font-medium text-zinc-400">
                          {node.influence}
                        </span>

                      </span>

                    </span>


                    {/* ================================================== */}
                    {/* NODE LABEL                                         */}
                    {/* ================================================== */}

                    <span className="absolute left-1/2 top-full mt-3 w-max -translate-x-1/2">

                      <span
                        className={`block text-sm font-semibold ${
                          isSelected
                            ? "text-white"
                            : "text-zinc-300"
                        }`}
                      >
                        {node.name}
                      </span>


                      <span className="mt-1 block text-xs text-zinc-500">
                        {node.type}
                      </span>

                    </span>

                  </button>
                );

              })}

            </div>


            {/* ================================================== */}
            {/* LEGEND                                             */}
            {/* ================================================== */}

            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/[0.08] bg-[#0a0e16]/90 p-4 backdrop-blur-xl">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Network strength
              </p>


              <div className="flex items-center gap-5">

                <span className="flex items-center gap-2 text-xs text-zinc-400">

                  <span className="h-2 w-2 rounded-full bg-blue-400" />

                  High

                </span>


                <span className="flex items-center gap-2 text-xs text-zinc-400">

                  <span className="h-2 w-2 rounded-full bg-purple-400" />

                  Medium

                </span>


                <span className="flex items-center gap-2 text-xs text-zinc-400">

                  <span className="h-2 w-2 rounded-full bg-zinc-500" />

                  Low

                </span>

              </div>

            </div>


            {/* ================================================== */}
            {/* INFLUENCE SCORE                                   */}
            {/* ================================================== */}

            <div className="absolute right-5 top-5 hidden rounded-2xl border border-white/[0.08] bg-[#0a0e16]/90 px-4 py-3 backdrop-blur-xl sm:block">

              <div className="flex items-center gap-2.5">

                <Zap
                  size={15}
                  className="text-blue-400"
                />

                <span className="text-xs text-zinc-500">
                  Influence score
                </span>

                {/* Number stays normal font */}

                <span className="text-sm font-semibold text-white">
                  94
                </span>

              </div>

            </div>

          </div>


          {/* ================================================== */}
          {/* SELECTED ENTITY                                    */}
          {/* ================================================== */}

          {selected && (
            <div className="border-t border-white/[0.07] bg-[#0a0e16]/90 px-5 py-5 sm:px-6">

              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">


                {/* Entity */}

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">

                    <Users
                      size={19}
                      className="text-blue-400"
                    />

                  </div>


                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <p className="text-base font-semibold text-white">
                        {selected.name}
                      </p>


                      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                        {selected.type}
                      </span>

                    </div>


                    <p className="mt-1 text-sm text-zinc-500">
                      Strong interaction detected across connected platforms.
                    </p>

                  </div>

                </div>


                {/* Stats */}

                <div className="flex items-center gap-6">

                  <div>

                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Influence
                    </p>

                    {/* Normal UI font */}

                    <p className="mt-1 text-lg font-semibold text-white">
                      {selected.influence}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      Connections
                    </p>

                    {/* Normal UI font */}

                    <p className="mt-1 text-lg font-semibold text-white">
                      {
                        connections.filter(
                          ([from, to]) =>
                            from ===
                              selected.id ||
                            to ===
                              selected.id
                        ).length
                      }
                    </p>

                  </div>


                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
                  >

                    View profile

                    <ArrowUpRight
                      size={14}
                    />

                  </Link>


                  <button
                    type="button"
                    onClick={() =>
                      setSelectedNode(
                        "central"
                      )
                    }
                    className="rounded-lg p-2 text-zinc-600 transition hover:text-white"
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

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
            description="Entities driving conversation"
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
            description="Compared with last 7 days"
            positive
          />

        </section>

      </div>


      {/* ================================================== */}
      {/* ANIMATION                                          */}
      {/* ================================================== */}

      <style jsx>{`

        .network-wave {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(45px);
        }


        .network-wave-one {
          width: 550px;
          height: 170px;
          left: 20%;
          top: 15%;
          background: rgba(59, 130, 246, 0.055);
          animation: waveOne 11s ease-in-out infinite;
        }


        .network-wave-two {
          width: 480px;
          height: 160px;
          right: 10%;
          bottom: 15%;
          background: rgba(139, 92, 246, 0.045);
          animation: waveTwo 14s ease-in-out infinite;
        }


        .network-wave-three {
          width: 300px;
          height: 130px;
          left: 42%;
          bottom: 0;
          background: rgba(34, 211, 238, 0.035);
          animation: waveThree 10s ease-in-out infinite;
        }


        .network-line {
          animation: flow 4s linear infinite;
        }


        @keyframes flow {

          0% {
            stroke-dashoffset: 12;
          }

          100% {
            stroke-dashoffset: 0;
          }

        }


        @keyframes waveOne {

          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(80px, 30px) scale(1.18);
          }

        }


        @keyframes waveTwo {

          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-70px, -35px) scale(1.15);
          }

        }


        @keyframes waveThree {

          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(100px);
          }

        }


        @keyframes nodePulse {

          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.25;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.55;
          }

        }


        .animate-node-pulse {
          animation: nodePulse 3s ease-in-out infinite;
        }


        @media (prefers-reduced-motion: reduce) {

          .network-wave,
          .network-line,
          .animate-node-pulse {
            animation: none;
          }

        }

      `}</style>

    </main>
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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.045]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Icon
            size={18}
            className="text-blue-400"
          />

        </div>


        {positive && (
          <span className="text-xs font-medium text-emerald-400">
            Live
          </span>
        )}

      </div>


      <p className="mt-6 text-sm font-medium text-zinc-400">
        {label}
      </p>


      {/* Numbers intentionally use normal UI font */}

      <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>


      <p className="mt-2 text-xs text-zinc-500">
        {description}
      </p>

    </div>
  );
}