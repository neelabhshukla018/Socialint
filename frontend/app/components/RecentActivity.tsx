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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-white">
            Recent activity
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Latest analyzed conversations
          </p>
        </div>

        <MessageSquare
          size={18}
          className="text-zinc-500"
        />

      </div>

      <div className="mt-5 space-y-1">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-3 rounded-xl p-3 hover:bg-zinc-800/50"
          >

            <div
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                activity.type === "positive"
                  ? "bg-emerald-400"
                  : activity.type === "negative"
                    ? "bg-red-400"
                    : "bg-zinc-500"
              }`}
            />

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm text-zinc-300">
                {activity.text}
              </p>

              <div className="mt-1 flex gap-2 text-[11px] text-zinc-600">

                <span>
                  {activity.source}
                </span>

                <span>•</span>

                <span>
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