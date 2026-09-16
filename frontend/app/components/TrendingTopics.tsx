"use client";

import { Hash, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  computeTrendingTopics,
  type AnalysisRecord,
} from "@/src/lib/analyzedPostsStore";

interface TrendingTopicsProps {
  posts?: AnalysisRecord[];
}

export default function TrendingTopics({ posts }: TrendingTopicsProps) {
  const topics = computeTrendingTopics(posts || []);

  return (
    <section
      className="
        rounded-2xl
        border
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white
        dark:bg-zinc-900/70
        p-4
        sm:p-6
        shadow-xs
        transition-all
        duration-200
        hover:border-zinc-300
        dark:hover:border-zinc-700
        hover:shadow-md
        flex
        flex-col
        justify-between
      "
    >
      <div>
        {/* ================================================== */}
        {/* HEADER                                             */}
        {/* ================================================== */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base tracking-tight text-zinc-950 dark:text-white">
              Trending Topics
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Fastest growing conversations extracted from analyzed posts
            </p>
          </div>

          {/* Icon with user color #457B9D */}
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#457B9D]/20
              dark:border-[#457B9D]/30
              bg-[#457B9D]/10
              dark:bg-[#457B9D]/15
              text-[#457B9D]
            "
          >
            <Hash size={18} strokeWidth={2} />
          </div>
        </div>

        {/* ================================================== */}
        {/* TOPICS LIST / EMPTY STATE                          */}
        {/* ================================================== */}
        {topics.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2.5">
              <Hash size={18} />
            </div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No topics discovered yet
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              Once you analyze posts, recurring hashtags, topics, and growth rates will emerge automatically.
            </p>
            <Link
              href="/posts-analysis"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#457B9D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#386785] transition"
            >
              <Sparkles size={13} />
              <span>Analyze a post</span>
            </Link>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-zinc-100 dark:divide-zinc-800">
            {topics.slice(0, 5).map((topic, index) => (
              <div
                key={topic.name}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  py-3
                  px-1
                  rounded-xl
                  transition-all
                  duration-150
                  hover:bg-zinc-50/80
                  dark:hover:bg-zinc-800/50
                "
              >
                {/* Topic info */}
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-5 shrink-0 text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                    0{index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-medium text-zinc-900 dark:text-white transition-colors group-hover:text-[#457B9D]">
                      {topic.name}
                    </p>
                    <p className="mt-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {topic.mentions} mentions · {topic.platforms.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Growth badge */}
                <span
                  className={`
                    shrink-0
                    rounded-full
                    border
                    px-2.5
                    py-0.5
                    text-xs
                    font-bold
                    font-mono
                    ${
                      topic.sentiment === "positive"
                        ? "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                        : topic.sentiment === "negative"
                          ? "border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                          : "border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/40 text-[#457B9D] dark:text-sky-300"
                    }
                  `}
                >
                  {topic.growth}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {topics.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <Link
            href="/trends"
            className="text-xs font-semibold text-[#457B9D] hover:underline"
          >
            Explore all trends &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}