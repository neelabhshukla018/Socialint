import {
  Hash,
} from "lucide-react";

const trendingTopics = [
  {
    name: "#Performance",
    growth: "+320%",
    mentions: "42.8K",
  },
  {
    name: "#UpcomingMatch",
    growth: "+184%",
    mentions: "31.4K",
  },
  {
    name: "#TeamSelection",
    growth: "+126%",
    mentions: "18.7K",
  },
  {
    name: "#Captaincy",
    growth: "+89%",
    mentions: "12.3K",
  },
];

export default function TrendingTopics() {
  return (
    <section
      className="
        rounded-2xl
        border
        border-zinc-200/80
        dark:border-zinc-800/80
        bg-white
        dark:bg-zinc-900/70
        p-5
        shadow-xs
        transition-all
        duration-200
        hover:border-zinc-300
        dark:hover:border-zinc-700
        hover:shadow-md
        sm:p-6
      "
    >
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-base tracking-tight text-zinc-950 dark:text-white">
            Trending Topics
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Fastest growing conversations around your profile
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
          <Hash
            size={18}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ================================================== */}
      {/* TOPICS LIST                                        */}
      {/* ================================================== */}
      <div className="mt-5 divide-y divide-zinc-100 dark:divide-zinc-800">
        {trendingTopics.map((topic, index) => (
          <div
            key={topic.name}
            className="
              group
              flex
              items-center
              justify-between
              gap-4
              py-3.5
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
                <p className="truncate font-display text-sm text-zinc-900 dark:text-white transition-colors group-hover:text-[#457B9D]">
                  {topic.name}
                </p>
                <p className="mt-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {topic.mentions} mentions
                </p>
              </div>
            </div>

            {/* Growth badge */}
            <span
              className="
                shrink-0
                rounded-full
                border
                border-emerald-200
                dark:border-emerald-800/40
                bg-emerald-50
                dark:bg-emerald-950/40
                px-2.5
                py-1
                text-xs
                font-bold
                font-mono
                text-emerald-700
                dark:text-emerald-300
              "
            >
              {topic.growth}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}