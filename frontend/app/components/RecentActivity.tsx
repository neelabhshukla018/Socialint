import {
  MessageSquare,
} from "lucide-react";

const activities = [
  {
    type: "positive",
    text: "Amazing performance today 🔥",
    source: "X",
    time: "2 min ago",
  },
  {
    type: "negative",
    text: "He needs to improve his batting.",
    source: "X",
    time: "8 min ago",
  },
  {
    type: "neutral",
    text: "Match starts at 7 PM tomorrow.",
    source: "Telegram",
    time: "14 min ago",
  },
  {
    type: "positive",
    text: "One of the best players in the team.",
    source: "X",
    time: "21 min ago",
  },
];

export default function RecentActivity() {
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
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base tracking-tight text-zinc-950 dark:text-white">
            Recent Activity
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Latest analyzed conversations across platforms
          </p>
        </div>

        {/* Header icon */}
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
          <MessageSquare
            size={18}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* ACTIVITIES LIST                                    */}
      {/* ================================================== */}
      <div className="mt-5 space-y-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
              group
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-zinc-100
              dark:border-zinc-800/80
              bg-zinc-50/50
              dark:bg-zinc-800/40
              p-3.5
              transition-all
              duration-150
              hover:border-zinc-200
              dark:hover:border-zinc-700
              hover:bg-zinc-50
              dark:hover:bg-zinc-800/70
            "
          >
            {/* Sentiment Dot */}
            <div
              className={`
                mt-1.5
                h-2
                w-2
                shrink-0
                rounded-full
                ${
                  activity.type === "positive"
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    : activity.type === "negative"
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                      : "bg-[#457B9D]"
                }
              `}
            />

            {/* Activity Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 transition-colors group-hover:text-zinc-950 dark:group-hover:text-white">
                {activity.text}
              </p>

              {/* Metadata */}
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <span className="rounded bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                  {activity.source}
                </span>

                <span className="text-zinc-300 dark:text-zinc-600">•</span>

                <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
                  {activity.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}