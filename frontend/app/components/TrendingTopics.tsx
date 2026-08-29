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
            Trending topics
          </h3>

          {/* Normal font */}

          <p className="mt-1 text-[11px] text-zinc-500">
            Fastest growing conversations
          </p>

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

          <Hash
            size={17}
            strokeWidth={1.8}
            className="text-blue-400"
          />

        </div>

      </div>


      {/* ================================================== */}
      {/* TOPICS                                             */}
      {/* ================================================== */}

      <div className="mt-5 divide-y divide-zinc-700/40">

        {trendingTopics.map((topic, index) => (

          <div
            key={topic.name}
            className="
              group
              flex
              items-center
              justify-between
              gap-4
              py-4
              transition-all
              duration-150
            "
          >

            {/* ================================================== */}
            {/* TOPIC INFO                                         */}
            {/* ================================================== */}

            <div className="flex min-w-0 items-center gap-3">

              {/* Ranking number — NORMAL FONT */}

              <span
                className="
                  w-5
                  shrink-0
                  text-[10px]
                  font-medium
                  tabular-nums
                  text-zinc-600
                "
              >
                0{index + 1}
              </span>


              <div className="min-w-0">

                {/* Topic — Keania One */}

                <p className="truncate font-display text-sm tracking-wide text-zinc-200 transition-colors group-hover:text-white">
                  {topic.name}
                </p>


                {/* Mentions — NORMAL FONT */}

                <p className="mt-1 text-[10px] text-zinc-500">
                  <span className="tabular-nums">
                    {topic.mentions}
                  </span>{" "}
                  mentions
                </p>

              </div>

            </div>


            {/* ================================================== */}
            {/* GROWTH                                            */}
            {/* ================================================== */}

            {/* Percentage stays normal font */}

            <span
              className="
                shrink-0
                rounded-full
                border
                border-emerald-400/10
                bg-emerald-400/5
                px-2.5
                py-1
                text-[10px]
                font-medium
                tabular-nums
                text-emerald-400
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