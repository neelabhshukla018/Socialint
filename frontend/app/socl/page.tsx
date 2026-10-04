"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  Radio,
  RefreshCw,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useSocl, type SoclMessage } from "../context/SoclContext";

interface PromptTemplate {
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  prompts: string[];
}

const PROMPT_CATEGORIES: PromptTemplate[] = [
  {
    category: "PR Crisis & Backlash",
    icon: AlertTriangle,
    prompts: [
      "Draft a crisis holding statement for a customer service defect",
      "What are the 4 immediate containment steps when negative sentiment hits 75%?",
      "How do I formulate a public response for an executive controversy?",
      "When should a brand apologize vs when should it clarify misinformation?",
    ],
  },
  {
    category: "Posts Analysis",
    icon: MessageSquare,
    prompts: [
      "How do I analyze an Instagram reel URL?",
      "Explain the difference between sentiment polarity and emotion scores",
      "How does the comment scraper work in SocialInt?",
      "What does the comment toxicity score indicate?",
    ],
  },
  {
    category: "Sentiment & Metrics",
    icon: Activity,
    prompts: [
      "How is Net Sentiment Score (NSS) calculated?",
      "What is considered an alarming sentiment threshold?",
      "How to track sentiment shifts before and after a press release?",
      "How does SocialInt detect sarcasm or mixed emotions?",
    ],
  },
  {
    category: "Trends & Topics",
    icon: TrendingUp,
    prompts: [
      "What is viral topic velocity and how is it measured?",
      "How do I set up alerts for emerging hashtag spikes?",
      "How do I identify which influencers are driving a negative trend?",
      "How can I spot coordinated bot amplification in a topic?",
    ],
  },
  {
    category: "Reports & Navigation",
    icon: FileText,
    prompts: [
      "Where do I download an Executive Briefing PDF?",
      "How do I connect Instagram and Facebook data sources?",
      "What is the difference between Person, Brand, and Campaign profiles?",
      "Where can I contact technical support for custom integrations?",
    ],
  },
];

export default function SoclPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    suggestedQuestions,
    sendMessage,
    clearMessages,
  } = useSocl();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportConversation = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.role.toUpperCase()}] (${m.timestamp}):\n${m.content}\n\n----------------------------\n`
      )
      .join("\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `socialint-socl-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCategories =
    selectedCategory === "All"
      ? PROMPT_CATEGORIES
      : PROMPT_CATEGORIES.filter((c) => c.category === selectedCategory);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-zinc-900 dark:bg-[#080b12] dark:text-zinc-100">
      {/* ================================================== */}
      {/* SIDEBAR                                            */}
      {/* ================================================== */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ================================================== */}
      {/* MAIN CONTENT AREA                                  */}
      {/* ================================================== */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 lg:pl-[270px]">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* WORKSPACE INNER CONTAINER */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* ================================================== */}
          {/* LEFT COLUMN: PROMPT LIBRARY & CONTROLS (DESKTOP)   */}
          {/* ================================================== */}
          <div className="hidden xl:flex w-80 flex-col border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0b0f17]/50 overflow-hidden shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <Sparkles size={14} />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-tight text-zinc-950 dark:text-white">
                    Prompt Library
                  </h3>
                  <p className="text-[10px] text-zinc-400">Click to run in chat</p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearMessages}
                title="Reset conversation"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <RefreshCw size={13} />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-3 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                  selectedCategory === "All"
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                All
              </button>
              {PROMPT_CATEGORIES.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.category
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      : "bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                >
                  {cat.category.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Prompt List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              {filteredCategories.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.category} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      <Icon size={12} className="text-zinc-500 dark:text-zinc-400" />
                      <span>{group.category}</span>
                    </div>
                    <div className="space-y-1">
                      {group.prompts.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => sendMessage(p)}
                          disabled={isLoading}
                          className="w-full text-left rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 p-2.5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition duration-150 disabled:opacity-50 group"
                        >
                          <span className="line-clamp-2 leading-relaxed">{p}</span>
                          <span className="mt-1 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white block transition">
                            Run Prompt &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0b0f17]">
              <button
                type="button"
                onClick={exportConversation}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <Download size={14} />
                <span>Export Chat History (.txt)</span>
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* CENTER: CHAT FEED & COMPOSER                      */}
          {/* ================================================== */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#080b12] relative min-w-0">
            {/* Top Workspace Header Bar */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 px-3 sm:px-6 py-2.5 sm:py-3 bg-zinc-50/50 dark:bg-[#0c1018]/50 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                  <img
                    src="/socl-astronaut.png"
                    alt="SOCL"
                    className="h-full w-full object-cover animate-float-astronaut"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display text-base sm:text-lg tracking-tight text-zinc-950 dark:text-white leading-none">
                    SOCL
                  </h1>
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-[170px] xs:max-w-[240px] sm:max-w-none">
                    Help &amp; prompts for SocialInt PR crisis &amp; sentiment guidance.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Mobile Prompt Library Button */}
                <button
                  type="button"
                  onClick={() => setMobileLibraryOpen(true)}
                  className="flex xl:hidden items-center gap-1.5 rounded-xl border border-[#457B9D]/30 bg-[#457B9D]/10 hover:bg-[#457B9D]/20 px-2.5 py-1.5 text-xs font-semibold text-[#457B9D] dark:text-[#7bb5d4] transition"
                  title="Browse categorized prompt library"
                >
                  <Sparkles size={13} />
                  <span>Prompts</span>
                </button>

                <button
                  type="button"
                  onClick={clearMessages}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                  title="New Session"
                >
                  <RefreshCw size={13} />
                  <span className="hidden sm:inline">New Session</span>
                </button>
                <button
                  type="button"
                  onClick={exportConversation}
                  className="flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                  title="Export Chat History"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 touch-pan-y">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 sm:gap-4 max-w-4xl mx-auto ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden text-xs font-bold shadow-2xs ${
                        isUser
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                          : "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                    >
                      {isUser ? (
                        "You"
                      ) : (
                        <img
                          src="/socl-astronaut.png"
                          alt="SOCL"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Content Box */}
                    <div
                      className={`group relative max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-5 shadow-2xs ${
                        isUser
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-xs font-medium"
                          : "bg-zinc-50 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/80 dark:border-zinc-800"
                      }`}
                    >
                      {/* Assistant Top Meta */}
                      {!isUser && (
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                            <img
                              src="/socl-astronaut.png"
                              alt="SOCL"
                              className="h-4 w-4 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 inline-block"
                            />
                            <span>SOCL</span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={12} className="text-emerald-500" />
                                  <span className="text-emerald-500">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                          {msg.content}
                        </p>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}

                      {/* User Timestamp */}
                      {isUser && (
                        <div className="text-right text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
                          {msg.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-start gap-3 sm:gap-4 max-w-4xl mx-auto">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                    <img
                      src="/socl-astronaut.png"
                      alt="SOCL"
                      className="h-full w-full object-cover animate-float-astronaut"
                    />
                  </div>
                  <div className="rounded-2xl rounded-tl-xs border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 px-4 py-3 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                      <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 ml-1">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            {suggestedQuestions.length > 0 && (
              <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/50 px-3 sm:px-6 py-2 shrink-0">
                <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
                    Prompts:
                  </span>
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(q)}
                      disabled={isLoading}
                      className="shrink-0 text-left rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition duration-150 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Composer Input */}
            <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#080b12] p-2.5 sm:p-6 shrink-0 safe-pb">
              <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end gap-2 sm:gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 p-2.5 sm:p-4 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 transition shadow-2xs">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 max-h-36 resize-none bg-transparent text-xs sm:text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden leading-relaxed"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message to SOCL"
                    className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-150
                      ${
                        input.trim() && !isLoading
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 cursor-pointer"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span>Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for a new line</span>
                  <span>SOCL</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* RIGHT COLUMN: QUICK CAPABILITIES & ASSISTANCE     */}
          {/* ================================================== */}
          <div className="hidden 2xl:flex w-80 flex-col border-l border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0b0f17]/50 p-4 space-y-4 overflow-y-auto shrink-0">
            {/* About Card */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 p-4 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/socl-astronaut.png"
                  alt="SOCL"
                  className="h-10 w-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 animate-float-astronaut"
                />
                <div>
                  <h4 className="font-display text-sm text-zinc-950 dark:text-white leading-none">
                    About SOCL
                  </h4>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                    Help & Prompts
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                SOCL is your assistant to help explore SocialInt analytics, understand sentiment scores, and navigate PR crisis containment.
              </p>
            </div>

            {/* Quick Links to SocialInt Modules */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 p-4 shadow-2xs space-y-2.5">
              <h4 className="font-display text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Explore Modules
              </h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/posts-analysis"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-zinc-500" />
                    <span>Posts Analysis</span>
                  </span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </Link>
                <Link
                  href="/trends"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-zinc-500" />
                    <span>Trends & Velocity</span>
                  </span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </Link>
                <Link
                  href="/data-sources"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <span className="flex items-center gap-2">
                    <Radio size={14} className="text-zinc-500" />
                    <span>Data Sources</span>
                  </span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={14} className="text-zinc-500" />
                    <span>Reports & PDF</span>
                  </span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </Link>
                <Link
                  href="/help"
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={14} className="text-zinc-500" />
                    <span>Help & Playbooks</span>
                  </span>
                  <ExternalLink size={12} className="text-zinc-400" />
                </Link>
              </div>
            </div>

            {/* Support Callout */}
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold text-xs mb-1">
                <Mail size={15} />
                <span>Contact Support</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Need specialized assistance with your social monitoring? Contact our team:
              </p>
              <a
                href="mailto:supportsocialint@gmail.com"
                className="mt-2 block font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline break-all"
              >
                supportsocialint@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MOBILE PROMPT LIBRARY SLIDE-UP DRAWER               */}
      {/* ================================================== */}
      <AnimatePresence>
        {mobileLibraryOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileLibraryOpen(false)}
              className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs"
            />

            {/* Slide-Up Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-x-0 bottom-0 h-[80vh] max-h-[85dvh] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] shadow-2xl flex flex-col overflow-hidden z-10 safe-pb"
            >
              {/* Drawer Drag Indicator */}
              <div
                className="pt-2.5 pb-1 flex justify-center cursor-pointer"
                onClick={() => setMobileLibraryOpen(false)}
              >
                <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>

              {/* Drawer Header */}
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#457B9D]/15 text-[#457B9D]">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm tracking-tight text-zinc-950 dark:text-white">
                      Prompt Library
                    </h3>
                    <p className="text-[10px] text-zinc-400">Tap any prompt to execute immediately</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileLibraryOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
                  aria-label="Close prompt library"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Category Pills */}
              <div className="px-3 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition shrink-0 ${
                    selectedCategory === "All"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  All
                </button>
                {PROMPT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition shrink-0 ${
                      selectedCategory === cat.category
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {cat.category.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Categorized Prompt List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs touch-pan-y">
                {filteredCategories.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.category} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        <Icon size={12} className="text-zinc-500 dark:text-zinc-400" />
                        <span>{group.category}</span>
                      </div>
                      <div className="space-y-1">
                        {group.prompts.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setMobileLibraryOpen(false);
                              sendMessage(p);
                            }}
                            disabled={isLoading}
                            className="w-full text-left rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/80 p-2.5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-150 disabled:opacity-50"
                          >
                            <span className="line-clamp-2 leading-relaxed">{p}</span>
                            <span className="mt-1 text-[10px] font-mono text-[#457B9D] dark:text-cyan-400 block font-semibold">
                              Run Prompt &rarr;
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
