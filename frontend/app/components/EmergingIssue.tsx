import {
  AlertTriangle,
} from "lucide-react";

export default function EmergingIssue() {
  return (
    <section className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5 sm:p-6">

      <div className="flex items-center gap-2">

        <div className="rounded-lg bg-red-500/10 p-2 text-red-400">
          <AlertTriangle size={18} />
        </div>

        <div>

          <h3 className="font-semibold text-white">
            Emerging issue
          </h3>

          <p className="text-xs text-zinc-500">
            Detected 18 minutes ago
          </p>

        </div>

      </div>

      <div className="mt-6">

        <p className="text-sm leading-6 text-zinc-300">

          Negative sentiment around{" "}

          <span className="font-medium text-white">
            recent performance
          </span>{" "}

          has increased by{" "}

          <span className="font-semibold text-red-400">
            44%
          </span>{" "}

          in the last 6 hours.

        </p>

      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">

        <p className="text-xs text-zinc-500">
          Primary narrative
        </p>

        <p className="mt-2 text-sm font-medium text-white">
          Performance & selection
        </p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">

          <div className="h-full w-[72%] rounded-full bg-red-400" />

        </div>

        <div className="mt-2 flex justify-between text-[11px] text-zinc-500">

          <span>
            Conversation volume
          </span>

          <span>
            72%
          </span>

        </div>

      </div>

      <button className="mt-5 w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white">
        View detailed analysis
      </button>

    </section>
  );
}