import type { LucideIcon } from "lucide-react";

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
        rounded-2xl
        border
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white
        dark:bg-zinc-900/70
        p-4
        sm:p-5
        shadow-xs
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-zinc-300
        dark:hover:border-zinc-700
        hover:shadow-md
      "
    >
      {/* ================================================== */}
      {/* TOP                                               */}
      {/* ================================================== */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">
            {title}
          </p>

          {/* Stat Value */}
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            {value}
          </h3>
        </div>

        {/* Icon Container with user brand color #457B9D */}
        <div
          className="
            flex
            h-10
            w-10
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
            size={19}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* CHANGE BADGE & COMPARISON                          */}
      {/* ================================================== */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`
            inline-flex
            items-center
            rounded-md
            border
            px-2
            py-0.5
            text-[11px]
            font-bold
            font-mono
            ${
              positive
                ? "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                : "border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
            }
          `}
        >
          {change}
        </span>

        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
          vs last 7 days
        </span>
      </div>
    </div>
  );
}