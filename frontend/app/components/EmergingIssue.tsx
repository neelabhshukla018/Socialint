import {
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

export default function EmergingIssue() {
  return (
    <section
      className="
        rounded-2xl
        border
        border-rose-200/80
        dark:border-rose-900/40
        bg-white
        dark:bg-zinc-900/70
        p-4
        sm:p-6
        shadow-xs
        transition-all
        duration-200
        hover:border-rose-300
        dark:hover:border-rose-800/60
        hover:shadow-md
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-rose-200
              dark:border-rose-900/50
              bg-rose-50
              dark:bg-rose-950/30
              text-rose-600
              dark:text-rose-400
            "
          >
            <AlertTriangle
              size={18}
              strokeWidth={2}
            />
          </div>

          <div>
            <h3 className="font-display text-base tracking-tight text-zinc-950 dark:text-white">
              Emerging issue
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Detected 18 minutes ago
            </p>
          </div>
        </div>

        {/* Alert indicator */}
        <span
          className="
            h-2
            w-2
            rounded-full
            bg-rose-500
            animate-pulse
            shadow-[0_0_8px_rgba(244,63,94,0.5)]
          "
        />
      </div>

      {/* ================================================== */}
      {/* ISSUE DESCRIPTION                                  */}
      {/* ================================================== */}
      <div className="mt-5">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Negative sentiment around{" "}
          <span className="font-semibold text-zinc-950 dark:text-white">
            recent performance
          </span>{" "}
          has increased by{" "}
          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
            44%
          </span>{" "}
          in the last 6 hours.
        </p>
      </div>

      {/* ================================================== */}
      {/* PRIMARY NARRATIVE                                  */}
      {/* ================================================== */}
      <div
        className="
          mt-5
          rounded-xl
          border
          border-zinc-200/80
          dark:border-zinc-800
          bg-zinc-50/70
          dark:bg-zinc-800/50
          p-4
        "
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
            Primary narrative
          </p>

          <ArrowUpRight
            size={14}
            className="text-zinc-400 dark:text-zinc-500"
          />
        </div>

        <p className="mt-1.5 font-display text-sm text-zinc-900 dark:text-white">
          Performance &amp; Selection
        </p>

        {/* Progress bar */}
        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="
              h-full
              w-[72%]
              rounded-full
              bg-gradient-to-r
              from-rose-500
              to-amber-500
            "
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
            Conversation volume
          </span>

          <span className="font-bold font-mono text-zinc-900 dark:text-white text-[11px]">
            72%
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* ACTION BUTTON                                      */}
      {/* ================================================== */}
      <button
        type="button"
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-zinc-200
          dark:border-zinc-800
          bg-zinc-50/80
          dark:bg-zinc-800/80
          py-2.5
          text-xs
          font-semibold
          text-zinc-800
          dark:text-zinc-200
          transition-all
          duration-200
          hover:bg-[#457B9D]
          dark:hover:bg-[#457B9D]
          hover:border-[#457B9D]
          dark:hover:border-[#457B9D]
          hover:text-white
          shadow-xs
        "
      >
        <span>View detailed analysis</span>
        <ArrowUpRight size={14} />
      </button>
    </section>
  );
}