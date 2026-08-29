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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-white">
            Trending topics
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            Fastest growing conversations
          </p>
        </div>

        <div className="rounded-lg bg-zinc-800 p-2 text-zinc-400">
          <Hash size={17} />
        </div>

      </div>

      <div className="mt-5 divide-y divide-zinc-800">

        {trendingTopics.map((topic, index) => (

          <div
            key={topic.name}
            className="flex items-center justify-between py-4"
          >

            <div className="flex items-center gap-3">

              <span className="text-xs text-zinc-600">
                0{index + 1}
              </span>

              <div>

                <p className="text-sm font-medium text-zinc-200">
                  {topic.name}
                </p>

                <p className="mt-1 text-[11px] text-zinc-500">
                  {topic.mentions} mentions
                </p>

              </div>

            </div>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              {topic.growth}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}