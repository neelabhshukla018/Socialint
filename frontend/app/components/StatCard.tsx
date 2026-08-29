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
        border-zinc-700/60
        bg-zinc-900/65
        p-5
        backdrop-blur-md
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-zinc-600/80
        hover:bg-zinc-900/75
      "
    >

      {/* ================================================== */}
      {/* TOP                                               */}
      {/* ================================================== */}

      <div className="flex items-start justify-between">

        <div>

          {/* Normal UI font */}

          <p className="text-[11px] font-medium tracking-wide text-zinc-500">
            {title}
          </p>


          {/* ================================================== */}
          {/* STATISTIC VALUE                                    */}
          {/* ================================================== */}

          {/* IMPORTANT:
              No font-display here.
              Numbers stay in the normal UI font.
          */}

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>

        </div>


        {/* ================================================== */}
        {/* ICON                                               */}
        {/* ================================================== */}

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-blue-400/10
            bg-blue-400/5
          "
        >

          <Icon
            size={18}
            strokeWidth={1.8}
            className="text-blue-400"
          />

        </div>

      </div>


      {/* ================================================== */}
      {/* CHANGE                                             */}
      {/* ================================================== */}

      <div className="mt-4 flex items-center gap-2">

        <span
          className={`
            text-[11px]
            font-medium
            ${
              positive
                ? "text-emerald-400"
                : "text-red-400"
            }
          `}
        >
          {change}
        </span>


        <span className="text-[10px] text-zinc-600">
          vs last 7 days
        </span>

      </div>

    </div>
  );
}