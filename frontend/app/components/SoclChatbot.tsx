"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSocl } from "../context/SoclContext";
import MarkdownRenderer from "./MarkdownRenderer";

export default function SoclChatbot() {
  const pathname = usePathname();
  const {
    isOpen,
    messages,
    isLoading,
    suggestedQuestions,
    openSocl,
    closeSocl,
    sendMessage,
    clearMessages,
  } = useSocl();

  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptPlaceholderIndex, setPromptPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Cycle prompts one by one when not typing
  useEffect(() => {
    if (!isOpen || suggestedQuestions.length === 0 || input.trim().length > 0) return;
    const interval = setInterval(() => {
      setPromptPlaceholderIndex((prev) => (prev + 1) % suggestedQuestions.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isOpen, suggestedQuestions, input]);

  const handleSend = async () => {
    const textToSend = input.trim() || suggestedQuestions[promptPlaceholderIndex] || "";
    if (!textToSend || isLoading) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-adjust height
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Hide floating widget entirely on the dedicated /socl copilot page
  if (pathname === "/socl") {
    return null;
  }

  return (
    <>


      {/* ================================================== */}
      {/* CHATBOT MODAL / MOBILE BOTTOM SHEET                */}
      {/* ================================================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeSocl}
              className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-xs sm:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[385px] h-[85vh] sm:h-[510px] max-h-[92dvh] sm:max-h-[75vh] rounded-t-3xl sm:rounded-2xl border-t sm:border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1018] shadow-2xl shadow-zinc-950/25 dark:shadow-black/70 flex flex-col overflow-hidden"
            >
              {/* Mobile Drag Indicator Bar */}
              <div
                className="sm:hidden pt-2.5 pb-1 flex justify-center bg-zinc-50/80 dark:bg-[#101623] cursor-pointer"
                onClick={closeSocl}
                title="Tap to close"
              >
                <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>

              {/* ================================================== */}
              {/* HEADER                                             */}
              {/* ================================================== */}
              <div className="relative flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-[#101623] px-3.5 py-2.5 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                    <img
                      src="/socl-astronaut.png"
                      alt="SOCL"
                      className="h-full w-full object-cover animate-float-astronaut"
                    />
                  </div>
                  <div>
                    <span className="font-display text-xs tracking-tight text-zinc-950 dark:text-white leading-none block">
                      SOCL
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-400">
                      AI PR &amp; Intelligence Copilot
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={clearMessages}
                    title="Reset conversation"
                    aria-label="Reset conversation"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
                  >
                    <RefreshCw size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={closeSocl}
                    title="Close"
                    aria-label="Close"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* ================================================== */}
              {/* MESSAGES FEED                                      */}
              {/* ================================================== */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 text-xs sm:text-[13px] touch-pan-y">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg overflow-hidden text-[10px] font-bold ${
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

                      {/* Bubble */}
                      <div
                        className={`relative group max-w-[85%] rounded-xl p-3 shadow-2xs ${
                          isUser
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-tr-xs font-medium"
                            : "bg-zinc-100 dark:bg-[#151c2a] text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/80 dark:border-zinc-800"
                        }`}
                      >
                        {/* Assistant Response Meta */}
                        {!isUser && (
                          <div className="flex items-center justify-between mb-1 pb-1 border-b border-zinc-200/60 dark:border-zinc-800 text-[10px] text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                              <img
                                src="/socl-astronaut.png"
                                alt="SOCL"
                                className="h-3.5 w-3.5 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 inline-block"
                              />
                              <span>SOCL</span>
                            </span>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleCopyMessage(msg.id, msg.content)}
                                className="hover:text-zinc-900 dark:hover:text-white flex items-center gap-0.5"
                                title="Copy text"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check size={11} className="text-emerald-500" />
                                    <span className="text-emerald-500">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
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
                          <p className="whitespace-pre-wrap leading-relaxed text-xs">
                            {msg.content}
                          </p>
                        ) : (
                          <MarkdownRenderer
                            content={msg.content}
                            onLinkClick={closeSocl}
                          />
                        )}

                        {/* User Timestamp */}
                        {isUser && (
                          <div className="text-right text-[9px] text-zinc-400 dark:text-zinc-500 mt-1">
                            {msg.timestamp}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
                      <img
                        src="/socl-astronaut.png"
                        alt="SOCL"
                        className="h-full w-full object-cover animate-float-astronaut"
                      />
                    </div>
                    <div className="rounded-xl rounded-tl-xs border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-[#151c2a] px-3 py-2 shadow-2xs">
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
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 ml-1">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ================================================== */}
              {/* QUICK PROMPTS PREVIEW (ONE BY ONE)                 */}
              {/* ================================================== */}
              {suggestedQuestions.length > 0 && (
                <div className="border-t border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-[#0e131e] px-3 py-1.5 shrink-0 flex items-center justify-between text-[11px]">
                  <div
                    onClick={() => sendMessage(suggestedQuestions[promptPlaceholderIndex])}
                    className="flex items-center gap-1.5 min-w-0 cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition group"
                    title="Click to send this prompt"
                  >
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
                      Prompt:
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={promptPlaceholderIndex}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.18 }}
                        className="truncate font-medium group-hover:underline text-[11px]"
                      >
                        {suggestedQuestions[promptPlaceholderIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPromptPlaceholderIndex(
                          (prev) => (prev - 1 + suggestedQuestions.length) % suggestedQuestions.length
                        )
                      }
                      className="h-5 w-4 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs rounded transition"
                      title="Previous prompt"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPromptPlaceholderIndex((prev) => (prev + 1) % suggestedQuestions.length)
                      }
                      className="h-5 w-4 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 text-xs rounded transition"
                      title="Next prompt"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================== */}
              {/* INPUT COMPOSER                                     */}
              {/* ================================================== */}
              <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c1018] p-2.5 sm:p-3 safe-pb shrink-0">
                <div className="relative flex items-end gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-[#151c2a] p-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-500 transition">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      suggestedQuestions[promptPlaceholderIndex]
                        ? `Ask: "${suggestedQuestions[promptPlaceholderIndex]}"`
                        : "Ask a question..."
                    }
                    rows={1}
                    disabled={isLoading}
                    className="flex-1 max-h-24 resize-none bg-transparent text-xs text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-hidden leading-relaxed"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={(!input.trim() && !suggestedQuestions[promptPlaceholderIndex]) || isLoading}
                    aria-label="Send message"
                    className={`
                      flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-150
                      ${
                        (input.trim() || suggestedQuestions[promptPlaceholderIndex]) && !isLoading
                          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 hover:opacity-90 cursor-pointer"
                          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={13} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1.5 px-1 text-[9px] text-zinc-400 dark:text-zinc-400">
                  <span>Enter to send</span>
                  <span>SOCL</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
