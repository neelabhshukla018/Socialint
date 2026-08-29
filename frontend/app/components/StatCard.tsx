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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-sm">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-zinc-800 p-2.5">
          <Icon
            size={19}
            className="text-zinc-300"
          />
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">

        <span
          className={
            positive
              ? "text-emerald-400"
              : "text-red-400"
          }
        >
          {change}
        </span>

        <span className="text-zinc-500">
          vs last 7 days
        </span>

      </div>
    </div>
  );
}