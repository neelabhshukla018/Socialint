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
    <section
      className="
        rounded-2xl
        border
        border-zinc-700/60
        bg-zinc-900/65
        p-5
        backdrop-blur-md
        transition-all
        duration-200
        hover:border-zinc-600/70
        sm:p-6
      "
    >

      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          {/* Keania One */}

          <h3 className="font-display text-base tracking-wide text-white">
            Sentiment over time
          </h3>

          {/* Normal UI font */}

          <p className="mt-1 text-[11px] text-zinc-500">
            Audience sentiment across the last 7 days
          </p>

        </div>


        {/* ================================================== */}
        {/* LEGEND                                            */}
        {/* ================================================== */}

        <div className="flex items-center gap-4 text-[10px]">

          <span className="flex items-center gap-1.5 text-zinc-400">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-emerald-400
              "
            />

            Positive

          </span>


          <span className="flex items-center gap-1.5 text-zinc-400">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-red-400
              "
            />

            Negative

          </span>


          <span className="flex items-center gap-1.5 text-zinc-400">

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-zinc-500
              "
            />

            Neutral

          </span>

        </div>

      </div>


      {/* ================================================== */}
      {/* CHART                                              */}
      {/* ================================================== */}

      <div className="mt-6 h-[300px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={sentimentData}
            margin={{
              top: 5,
              right: 5,
              left: -15,
              bottom: 0,
            }}
          >

            {/* ================================================== */}
            {/* GRADIENTS                                          */}
            {/* ================================================== */}

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
                  stopOpacity={0.16}
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
                  stopOpacity={0.12}
                />

                <stop
                  offset="100%"
                  stopColor="#f87171"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>


            {/* ================================================== */}
            {/* GRID                                               */}
            {/* ================================================== */}

            <CartesianGrid
              stroke="rgba(148, 163, 184, 0.08)"
              strokeDasharray="3 5"
              vertical={false}
            />


            {/* ================================================== */}
            {/* X AXIS                                             */}
            {/* ================================================== */}

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 10,
              }}
              dy={8}
            />


            {/* ================================================== */}
            {/* Y AXIS                                             */}
            {/* ================================================== */}

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#71717a",
                fontSize: 10,
              }}
              domain={[0, 80]}
              tickCount={5}
            />


            {/* ================================================== */}
            {/* TOOLTIP                                            */}
            {/* ================================================== */}

            <Tooltip
              cursor={{
                stroke: "rgba(148, 163, 184, 0.15)",
                strokeWidth: 1,
              }}
              contentStyle={{
                backgroundColor: "rgba(12, 16, 24, 0.95)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                borderRadius: "12px",
                color: "#f4f4f5",
                fontSize: "11px",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)",
              }}
            />


            {/* ================================================== */}
            {/* POSITIVE                                            */}
            {/* ================================================== */}

            <Area
              type="monotone"
              dataKey="positive"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#positiveGradient)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
              }}
            />


            {/* ================================================== */}
            {/* NEGATIVE                                            */}
            {/* ================================================== */}

            <Area
              type="monotone"
              dataKey="negative"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#negativeGradient)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
              }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </section>
  );
}