import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
}: StatCardProps) {
  return (
    <div
      className="
        card-hanging
        rounded-2xl
        border
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white
        dark:bg-zinc-900/70
        p-3.5
        sm:p-5
        shadow-xs
        min-w-0
      "
    >
      {/* ================================================== */}
      {/* TOP                                               */}
      {/* ================================================== */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase truncate">
            {title}
          </p>

          {/* Stat Value */}
          <h3 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white truncate">
            {value}
          </h3>
        </div>

        {/* Icon Container with user brand color #457B9D */}
        <div
          className="
            flex
            h-8
            w-8
            sm:h-10
            sm:w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-[#457B9D]/20
            dark:border-[#457B9D]/30
            bg-[#457B9D]/10
            dark:bg-[#457B9D]/15
            text-[#457B9D]
            shadow-xs
          "
        >
          <Icon
            size={16}
            className="sm:w-[19px] sm:h-[19px]"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* CHANGE BADGE & COMPARISON                          */}
      {/* ================================================== */}
      <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 flex-wrap">
        <span
          className={`
            inline-flex
            items-center
            gap-1
            rounded-md
            border
            px-1.5
            py-0.5
            text-[10px]
            sm:text-[11px]
            font-mono
            font-semibold
            max-w-full
            truncate
            ${
              positive
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : "border-rose-500/25 bg-rose-500/10 text-rose-800 dark:text-rose-300"
            }
          `}
        >
          {positive ? (
            <TrendingUp size={11} className="stroke-[2.5] shrink-0" />
          ) : (
            <TrendingDown size={11} className="stroke-[2.5] shrink-0" />
          )}
          <span className="truncate">{change}</span>
        </span>

        <span className="text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-mono truncate hidden xs:inline">
          vs last 7 days
        </span>
      </div>
    </div>
  );
}