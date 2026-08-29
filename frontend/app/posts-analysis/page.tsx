"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock3,
  ExternalLink,
  Filter,
  MessageSquare,
  Search,
  ThumbsDown,
  ThumbsUp,
  Minus,
  X,
  Zap,
} from "lucide-react";


type Sentiment = "positive" | "negative" | "neutral";


interface Post {
  id: number;
  author: string;
  username: string;
  platform: string;
  time: string;
  text: string;
  sentiment: Sentiment;
  likes: string;
  comments: string;
  shares: string;
  score: number;
  topic: string;
}


const posts: Post[] = [
  {
    id: 1,
    author: "Rahul Sharma",
    username: "@rahul_sports",
    platform: "X",
    time: "2 min ago",
    text: "Amazing performance today. He completely changed the momentum of the match 🔥",
    sentiment: "positive",
    likes: "12.4K",
    comments: "842",
    shares: "1.8K",
    score: 94,
    topic: "Performance",
  },
  {
    id: 2,
    author: "Cricket Central",
    username: "@cricketcentral",
    platform: "X",
    time: "8 min ago",
    text: "He needs to improve his batting. The last few performances have been inconsistent.",
    sentiment: "negative",
    likes: "8.7K",
    comments: "1.2K",
    shares: "742",
    score: 81,
    topic: "Performance",
  },
  {
    id: 3,
    author: "Sports Updates",
    username: "@sportsupdates",
    platform: "Telegram",
    time: "14 min ago",
    text: "Match starts at 7 PM tomorrow. Team announcement expected shortly.",
    sentiment: "neutral",
    likes: "4.2K",
    comments: "318",
    shares: "529",
    score: 72,
    topic: "Upcoming Match",
  },
  {
    id: 4,
    author: "The Sports Desk",
    username: "@sportsdesk",
    platform: "X",
    time: "21 min ago",
    text: "One of the best players in the team. His contribution today was outstanding.",
    sentiment: "positive",
    likes: "15.8K",
    comments: "934",
    shares: "2.4K",
    score: 97,
    topic: "Performance",
  },
  {
    id: 5,
    author: "Fan Talk",
    username: "@fantalk",
    platform: "Instagram",
    time: "29 min ago",
    text: "Not sure about the current team selection. There are better options available.",
    sentiment: "negative",
    likes: "6.3K",
    comments: "684",
    shares: "391",
    score: 78,
    topic: "Team Selection",
  },
  {
    id: 6,
    author: "Match Zone",
    username: "@matchzone",
    platform: "X",
    time: "36 min ago",
    text: "Captaincy decision looks solid. The bowling changes were perfectly timed.",
    sentiment: "positive",
    likes: "9.2K",
    comments: "451",
    shares: "816",
    score: 91,
    topic: "Captaincy",
  },
  {
    id: 7,
    author: "Game Analysis",
    username: "@gameanalysis",
    platform: "Telegram",
    time: "44 min ago",
    text: "The middle order struggled again today. This could become a concern in the next match.",
    sentiment: "negative",
    likes: "5.9K",
    comments: "723",
    shares: "318",
    score: 84,
    topic: "Performance",
  },
];


export default function PostsAnalysisPage() {
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState<"all" | Sentiment>("all");
  const [platform, setPlatform] = useState("All platforms");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);


  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.text
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        post.author
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        post.topic
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSentiment =
        sentiment === "all" ||
        post.sentiment === sentiment;

      const matchesPlatform =
        platform === "All platforms" ||
        post.platform === platform;

      return (
        matchesSearch &&
        matchesSentiment &&
        matchesPlatform
      );
    });
  }, [search, sentiment, platform]);


  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">

      {/* ================================================== */}
      {/* BACKGROUND                                         */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="posts-glow posts-glow-one" />

        <div className="posts-glow posts-glow-two" />

      </div>


      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/90 backdrop-blur-xl">

        <div className="flex h-20 items-center justify-between px-5 sm:px-8">

          <div>

            <div className="mb-1.5 flex items-center gap-2">

              <MessageSquare
                size={16}
                className="text-blue-400"
              />

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                Content intelligence
              </span>

            </div>

            <h1 className="font-display text-3xl tracking-wide text-white sm:text-4xl">
              Posts Analysis
            </h1>

          </div>


          <div className="hidden items-center gap-2 text-sm text-zinc-500 sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            Live analysis

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* CONTENT                                            */}
      {/* ================================================== */}

      <div className="relative z-10 px-5 py-8 sm:px-8">


        {/* INTRO */}

        <section className="mb-8">

          <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
            Understand what people are saying
          </h2>

          <p className="mt-2 max-w-3xl text-base leading-7 text-zinc-400">
            Explore analyzed posts, identify sentiment,
            discover recurring narratives and understand
            which conversations are gaining attention.
          </p>

        </section>


        {/* ================================================== */}
        {/* QUICK STATS                                        */}
        {/* ================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MiniStat
            icon={MessageSquare}
            title="Posts analyzed"
            value="125.4K"
            change="+18.4%"
          />

          <MiniStat
            icon={ThumbsUp}
            title="Positive posts"
            value="68.4%"
            change="+6.2%"
          />

          <MiniStat
            icon={ThumbsDown}
            title="Negative posts"
            value="14.2%"
            change="-3.1%"
          />

          <MiniStat
            icon={Zap}
            title="High-impact posts"
            value="8.7K"
            change="+12.8%"
          />

        </section>


        {/* ================================================== */}
        {/* SEARCH + FILTERS                                  */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0b0f18]/90 p-4 sm:p-5">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search posts, people or topics..."
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40 focus:bg-white/[0.04]"
              />

            </div>


            {/* Sentiment */}

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">

              <Filter
                size={15}
                className="ml-2 mr-1 text-zinc-600"
              />

              <FilterButton
                active={sentiment === "all"}
                onClick={() => setSentiment("all")}
              >
                All
              </FilterButton>

              <FilterButton
                active={sentiment === "positive"}
                onClick={() => setSentiment("positive")}
              >
                Positive
              </FilterButton>

              <FilterButton
                active={sentiment === "neutral"}
                onClick={() => setSentiment("neutral")}
              >
                Neutral
              </FilterButton>

              <FilterButton
                active={sentiment === "negative"}
                onClick={() => setSentiment("negative")}
              >
                Negative
              </FilterButton>

            </div>


            {/* Platform */}

            <div className="relative">

              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 pr-10 text-sm text-zinc-300 outline-none sm:w-[170px]"
              >

                <option
                  className="bg-[#0b0f18]"
                  value="All platforms"
                >
                  All platforms
                </option>

                <option
                  className="bg-[#0b0f18]"
                  value="X"
                >
                  X
                </option>

                <option
                  className="bg-[#0b0f18]"
                  value="Telegram"
                >
                  Telegram
                </option>

                <option
                  className="bg-[#0b0f18]"
                  value="Instagram"
                >
                  Instagram
                </option>

              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* POSTS + INSIGHTS                                  */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">


          {/* POSTS */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90">

            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">

              <div>

                <h3 className="text-lg font-semibold text-white">
                  Analyzed posts
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {filteredPosts.length} conversations matching your filters
                </p>

              </div>


              <Activity
                size={18}
                className="text-zinc-600"
              />

            </div>


            <div>

              {filteredPosts.length === 0 ? (

                <div className="px-6 py-16 text-center">

                  <Search
                    size={28}
                    className="mx-auto text-zinc-700"
                  />

                  <p className="mt-4 text-sm font-medium text-zinc-300">
                    No posts found
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Try changing your search or filters.
                  </p>

                </div>

              ) : (

                filteredPosts.map((post) => (

                  <PostRow
                    key={post.id}
                    post={post}
                    onClick={() =>
                      setSelectedPost(post)
                    }
                  />

                ))

              )}

            </div>

          </section>


          {/* RIGHT SIDE */}

          <section className="space-y-6">


            {/* Sentiment summary */}

            <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    Sentiment overview
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Current conversation mood
                  </p>

                </div>

                <BarChart3
                  size={18}
                  className="text-zinc-600"
                />

              </div>


              <div className="mt-6 space-y-5">

                <ProgressRow
                  label="Positive"
                  value="68%"
                  width="68%"
                  color="bg-emerald-400"
                />

                <ProgressRow
                  label="Neutral"
                  value="18%"
                  width="18%"
                  color="bg-zinc-500"
                />

                <ProgressRow
                  label="Negative"
                  value="14%"
                  width="14%"
                  color="bg-red-400"
                />

              </div>

            </section>


            {/* AI summary */}

            <section className="rounded-3xl border border-blue-400/10 bg-blue-500/[0.025] p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                  <Zap
                    size={18}
                    className="text-blue-400"
                  />

                </div>

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    Conversation insight
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    Based on recent posts
                  </p>

                </div>

              </div>


              <p className="mt-5 text-sm leading-7 text-zinc-400">

                Performance is currently the dominant
                conversation. Positive reactions are driving
                most engagement, while concerns around
                consistency and team selection are creating
                the strongest negative discussions.

              </p>


              <div className="mt-5 flex items-center gap-2 text-xs text-blue-400">

                <ArrowUpRight size={14} />

                Performance conversations are trending

              </div>

            </section>


            {/* Topics */}

            <section className="rounded-3xl border border-white/[0.08] bg-[#0b0f18]/90 p-5 sm:p-6">

              <h3 className="text-lg font-semibold text-white">
                Dominant narratives
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Topics appearing most frequently.
              </p>


              <div className="mt-5 space-y-3">

                <Topic
                  name="Performance"
                  mentions="42.8K mentions"
                />

                <Topic
                  name="Upcoming Match"
                  mentions="31.4K mentions"
                />

                <Topic
                  name="Team Selection"
                  mentions="18.7K mentions"
                />

                <Topic
                  name="Captaincy"
                  mentions="12.3K mentions"
                />

              </div>

            </section>

          </section>

        </section>


        {/* ================================================== */}
        {/* STATUS                                             */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-4">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">

                <Activity
                  size={16}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <p className="text-sm font-medium text-zinc-200">
                  Post analysis active
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  New conversations are being analyzed automatically.
                </p>

              </div>

            </div>


            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-400">
                Processing live
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* ================================================== */}
      {/* POST DETAIL MODAL                                 */}
      {/* ================================================== */}

      {selectedPost && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >

          <div
            className="w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#0d121c] p-6 shadow-2xl sm:p-7"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]">

                  <MessageSquare
                    size={18}
                    className="text-zinc-400"
                  />

                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    {selectedPost.author}
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {selectedPost.username} · {selectedPost.platform}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
              >

                <X size={18} />

              </button>

            </div>


            <p className="mt-7 text-base leading-7 text-zinc-300">
              {selectedPost.text}
            </p>


            <div className="mt-6 flex flex-wrap gap-2">

              <SentimentBadge
                sentiment={selectedPost.sentiment}
              />

              <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-400">
                {selectedPost.topic}
              </span>

            </div>


            <div className="mt-7 grid grid-cols-3 gap-3">

              <DetailStat
                label="Likes"
                value={selectedPost.likes}
              />

              <DetailStat
                label="Comments"
                value={selectedPost.comments}
              />

              <DetailStat
                label="Shares"
                value={selectedPost.shares}
              />

            </div>


            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">

              <div className="flex items-center justify-between">

                <span className="text-xs text-zinc-500">
                  Influence score
                </span>

                <span className="text-sm font-semibold text-white">
                  {selectedPost.score}/100
                </span>

              </div>


              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                <div
                  className="h-full rounded-full bg-blue-400"
                  style={{
                    width: `${selectedPost.score}%`,
                  }}
                />

              </div>

            </div>


            <div className="mt-6 flex items-center justify-between">

              <div className="flex items-center gap-2 text-xs text-zinc-600">

                <Clock3 size={14} />

                {selectedPost.time}

              </div>


              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-white"
              >

                Open original

                <ExternalLink size={14} />

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================================================== */}
      {/* ANIMATION                                         */}
      {/* ================================================== */}

      <style jsx>{`
        .posts-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(110px);
        }

        .posts-glow-one {
          width: 600px;
          height: 280px;
          left: 25%;
          top: 100px;
          background: rgba(59, 130, 246, 0.035);
          animation: postsMoveOne 13s ease-in-out infinite;
        }

        .posts-glow-two {
          width: 420px;
          height: 260px;
          right: -80px;
          top: 45%;
          background: rgba(139, 92, 246, 0.025);
          animation: postsMoveTwo 16s ease-in-out infinite;
        }

        @keyframes postsMoveOne {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(70px, 30px) scale(1.1);
          }
        }

        @keyframes postsMoveTwo {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-50px, -35px) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .posts-glow {
            animation: none;
          }
        }
      `}</style>

    </main>
  );
}


/* ================================================== */
/* POST ROW                                           */
/* ================================================== */

function PostRow({
  post,
  onClick,
}: {
  post: Post;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full border-b border-white/[0.06] p-5 text-left transition hover:bg-white/[0.025] sm:p-6"
    >

      <div className="mr-4 mt-1">

        <SentimentIcon
          sentiment={post.sentiment}
        />

      </div>


      <div className="min-w-0 flex-1">

        <div className="flex flex-col justify-between gap-2 sm:flex-row">

          <div>

            <p className="text-sm font-semibold text-zinc-200">
              {post.author}
            </p>

            <p className="mt-0.5 text-xs text-zinc-600">
              {post.username}
            </p>

          </div>


          <div className="flex items-center gap-3 text-xs text-zinc-600">

            <span>
              {post.platform}
            </span>

            <span>•</span>

            <span>
              {post.time}
            </span>

          </div>

        </div>


        <p className="mt-4 text-sm leading-6 text-zinc-400">
          {post.text}
        </p>


        <div className="mt-4 flex flex-wrap items-center gap-2">

          <SentimentBadge
            sentiment={post.sentiment}
          />

          <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-500">
            {post.topic}
          </span>

        </div>


        <div className="mt-4 flex items-center gap-5 text-[11px] text-zinc-600">

          <span>
            ♥ {post.likes}
          </span>

          <span>
            {post.comments} comments
          </span>

          <span>
            {post.shares} shares
          </span>

        </div>

      </div>


      <ArrowUpRight
        size={17}
        className="ml-3 mt-1 shrink-0 text-zinc-700 transition group-hover:text-zinc-300"
      />

    </button>
  );
}


/* ================================================== */
/* SENTIMENT ICON                                     */
/* ================================================== */

function SentimentIcon({
  sentiment,
}: {
  sentiment: Sentiment;
}) {
  if (sentiment === "positive") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
        <ThumbsUp size={15} />
      </div>
    );
  }

  if (sentiment === "negative") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
        <ThumbsDown size={15} />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-500/10 text-zinc-400">
      <Minus size={15} />
    </div>
  );
}


/* ================================================== */
/* SENTIMENT BADGE                                    */
/* ================================================== */

function SentimentBadge({
  sentiment,
}: {
  sentiment: Sentiment;
}) {
  const styles = {
    positive:
      "bg-emerald-500/10 text-emerald-400",
    negative:
      "bg-red-500/10 text-red-400",
    neutral:
      "bg-zinc-500/10 text-zinc-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${styles[sentiment]}`}
    >
      {sentiment}
    </span>
  );
}


/* ================================================== */
/* MINI STAT                                          */
/* ================================================== */

function MiniStat({
  icon: Icon,
  title,
  value,
  change,
}: {
  icon: typeof Activity;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.13] hover:bg-white/[0.04]">

      <div className="flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.07]">

          <Icon
            size={18}
            className="text-blue-400"
          />

        </div>


        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">

          <ArrowUpRight size={13} />

          {change}

        </span>

      </div>


      <p className="mt-5 text-sm text-zinc-500">
        {title}
      </p>

      {/* Numbers intentionally use normal font */}

      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>

    </div>
  );
}


/* ================================================== */
/* FILTER BUTTON                                      */
/* ================================================== */

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
        active
          ? "bg-white text-black"
          : "text-zinc-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}


/* ================================================== */
/* PROGRESS ROW                                       */
/* ================================================== */

function ProgressRow({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-sm text-zinc-400">
          {label}
        </span>

        <span className="text-sm font-medium text-zinc-200">
          {value}
        </span>

      </div>


      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width,
          }}
        />

      </div>

    </div>
  );
}


/* ================================================== */
/* TOPIC                                             */
/* ================================================== */

function Topic({
  name,
  mentions,
}: {
  name: string;
  mentions: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">

      <span className="text-sm font-medium text-zinc-300">
        {name}
      </span>

      <span className="text-xs text-zinc-600">
        {mentions}
      </span>

    </div>
  );
}


/* ================================================== */
/* DETAIL STAT                                        */
/* ================================================== */

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">

      <p className="text-[11px] text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-zinc-200">
        {value}
      </p>

    </div>
  );
}