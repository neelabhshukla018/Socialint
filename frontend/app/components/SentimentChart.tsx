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
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <h3 className="font-semibold text-white">
            Sentiment over time
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Audience sentiment across the last 7 days
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">

          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Positive
          </span>

          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Negative
          </span>

          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
            Neutral
          </span>

        </div>

      </div>

      <div className="mt-6 h-[300px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={sentimentData}>

            <defs>

              <linearGradient
                id="positiveGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#34d399"
                  stopOpacity={0.2}
                />

                <stop
                  offset="100%"
                  stopColor="#34d399"
                  stopOpacity={0}
                />

              </linearGradient>

              <linearGradient
                id="negativeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#f87171"
                  stopOpacity={0.15}
                />

                <stop
                  offset="100%"
                  stopColor="#f87171"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#27272a"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 11,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 11,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="positive"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#positiveGradient)"
            />

            <Area
              type="monotone"
              dataKey="negative"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#negativeGradient)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}