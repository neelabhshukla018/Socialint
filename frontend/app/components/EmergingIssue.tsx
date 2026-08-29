import {
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

export default function EmergingIssue() {
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
        hover:border-red-400/20
        sm:p-6
      "
    >

      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-red-400/15
              bg-red-400/10
            "
          >
            <AlertTriangle
              size={18}
              strokeWidth={1.8}
              className="text-red-400"
            />
          </div>

          <div>

            {/* Keania One */}

            <h3 className="font-display text-base tracking-wide text-white">
              Emerging issue
            </h3>

            {/* Normal font */}

            <p className="mt-1 text-[11px] text-zinc-500">
              Detected 18 minutes ago
            </p>

          </div>

        </div>


        {/* Alert indicator */}

        <span
          className="
            h-2
            w-2
            rounded-full
            bg-red-400
            shadow-[0_0_10px_rgba(248,113,113,0.55)]
          "
        />

      </div>


      {/* ================================================== */}
      {/* ISSUE DESCRIPTION                                  */}
      {/* ================================================== */}

      <div className="mt-6">

        <p className="text-sm leading-6 text-zinc-300">

          Negative sentiment around{" "}

          <span className="font-medium text-white">
            recent performance
          </span>{" "}

          has increased by{" "}

          {/* Normal number font */}

          <span className="font-semibold text-red-400">
            44%
          </span>{" "}

          in the last 6 hours.

        </p>

      </div>


      {/* ================================================== */}
      {/* PRIMARY NARRATIVE                                  */}
      {/* ================================================== */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-zinc-700/50
          bg-zinc-950/55
          p-4
        "
      >

        <div className="flex items-center justify-between">

          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            Primary narrative
          </p>

          <ArrowUpRight
            size={14}
            className="text-zinc-600"
          />

        </div>


        {/* Keania One */}

        <p className="mt-2 font-display text-sm tracking-wide text-white">
          Performance & selection
        </p>


        {/* Progress bar */}

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">

          <div
            className="
              h-full
              w-[72%]
              rounded-full
              bg-gradient-to-r
              from-red-500
              to-orange-400
              shadow-[0_0_10px_rgba(248,113,113,0.25)]
            "
          />

        </div>


        {/* ================================================== */}
        {/* PROGRESS INFO                                      */}
        {/* ================================================== */}

        <div className="mt-2 flex items-center justify-between">

          <span className="text-[10px] text-zinc-600">
            Conversation volume
          </span>

          {/* Normal number font */}

          <span className="text-[10px] font-medium text-zinc-400">
            72%
          </span>

        </div>

      </div>


      {/* ================================================== */}
      {/* ACTION                                             */}
      {/* ================================================== */}

      <button
        type="button"
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-zinc-700/60
          bg-zinc-800/45
          py-2.5
          text-[11px]
          font-medium
          text-zinc-400
          transition-all
          duration-200
          hover:border-red-400/20
          hover:bg-red-400/5
          hover:text-red-300
        "
      >

        View detailed analysis

        <ArrowUpRight size={13} />

      </button>

    </section>
  );
}