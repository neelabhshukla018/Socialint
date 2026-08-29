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

      <div className="flex items-center justify-between">

        <div>

          {/* Keania One */}

          <h3 className="font-display text-base tracking-wide text-white">
            Recent activity
          </h3>

          {/* Normal font */}

          <p className="mt-1 text-[11px] text-zinc-500">
            Latest analyzed conversations
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
            border-blue-400/10
            bg-blue-400/5
          "
        >

          <MessageSquare
            size={17}
            strokeWidth={1.8}
            className="text-blue-400"
          />

        </div>

      </div>


      {/* ================================================== */}
      {/* ACTIVITIES                                         */}
      {/* ================================================== */}

      <div className="mt-5 space-y-1">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="
              group
              flex
              gap-3
              rounded-xl
              border
              border-transparent
              p-3
              transition-all
              duration-150
              hover:border-zinc-700/40
              hover:bg-zinc-800/40
            "
          >

            {/* ================================================== */}
            {/* SENTIMENT DOT                                     */}
            {/* ================================================== */}

            <div
              className={`
                mt-1.5
                h-2
                w-2
                shrink-0
                rounded-full
                ${
                  activity.type === "positive"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    : activity.type === "negative"
                      ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]"
                      : "bg-zinc-500"
                }
              `}
            />


            {/* ================================================== */}
            {/* ACTIVITY CONTENT                                   */}
            {/* ================================================== */}

            <div className="min-w-0 flex-1">

              {/* Normal UI font */}

              <p className="truncate text-sm text-zinc-300 transition-colors group-hover:text-white">
                {activity.text}
              </p>


              {/* Metadata */}

              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-zinc-600">

                <span className="font-medium text-zinc-500">
                  {activity.source}
                </span>

                <span>
                  •
                </span>

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