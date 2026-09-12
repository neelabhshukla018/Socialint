"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTheme } from "../context/ThemeContext";

const sentimentData = [
  { day: "Mon", positive: 62, negative: 18, neutral: 20 },
  { day: "Tue", positive: 65, negative: 16, neutral: 19 },
  { day: "Wed", positive: 59, negative: 24, neutral: 17 },
  { day: "Thu", positive: 54, negative: 29, neutral: 17 },
  { day: "Fri", positive: 68, negative: 18, neutral: 14 },
  { day: "Sat", positive: 72, negative: 15, neutral: 13 },
  { day: "Sun", positive: 69, negative: 17, neutral: 14 },
];

export default function SentimentChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section
      className="
        rounded-2xl
        border
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white
        dark:bg-zinc-900/70
        p-5
        shadow-xs
        transition-all
        duration-200
        hover:border-zinc-300
        dark:hover:border-zinc-700
        hover:shadow-md
        sm:p-6
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-lg tracking-tight text-zinc-950 dark:text-white">
            Sentiment Over Time
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Audience sentiment trend across the last 7 days
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Positive
          </span>

          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Negative
          </span>

          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#457B9D]" />
            Neutral
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* CHART                                              */}
      {/* ================================================== */}
      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sentimentData}
            margin={{
              top: 5,
              right: 5,
              left: -15,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#457B9D" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#457B9D" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)"}
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#94a3b8" : "#71717a",
                fontSize: 11,
              }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#94a3b8" : "#71717a",
                fontSize: 11,
              }}
              domain={[0, 80]}
              tickCount={5}
            />

            <Tooltip
              cursor={{
                stroke: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)",
                strokeWidth: 1,
              }}
              contentStyle={{
                backgroundColor: isDark ? "#0d111a" : "#ffffff",
                border: isDark ? "1px solid #27272a" : "1px solid #e4e4e7",
                borderRadius: "12px",
                color: isDark ? "#f4f4f5" : "#09090b",
                fontSize: "12px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            />

            <Area
              type="monotone"
              dataKey="positive"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#positiveGradient)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 0,
                fill: "#10b981",
              }}
            />

            <Area
              type="monotone"
              dataKey="negative"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fill="url(#negativeGradient)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 0,
                fill: "#f43f5e",
              }}
            />

            <Area
              type="monotone"
              dataKey="neutral"
              stroke="#457B9D"
              strokeWidth={2}
              fill="url(#neutralGradient)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
                fill: "#457B9D",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}