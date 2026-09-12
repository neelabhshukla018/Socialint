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
        bg-white
        p-5
        shadow-xs
        transition-all
        duration-200
        hover:border-zinc-300
        hover:shadow-md
        sm:p-6
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base tracking-tight text-zinc-950">
            Recent Activity
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">
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
            bg-[#457B9D]/10
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
              bg-zinc-50/50
              p-3.5
              transition-all
              duration-150
              hover:border-zinc-200
              hover:bg-zinc-50
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
              <p className="text-sm font-medium text-zinc-800 transition-colors group-hover:text-zinc-950">
                {activity.text}
              </p>

              {/* Metadata */}
              <div className="mt-1.5 flex items-center gap-2 text-xs">
                <span className="rounded bg-white border border-zinc-200/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-zinc-700">
                  {activity.source}
                </span>

                <span className="text-zinc-300">•</span>

                <span className="text-zinc-400 font-mono text-[11px]">
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