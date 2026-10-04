"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

export interface SoclMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source?: "gemini" | "knowledge_fallback";
}

interface SoclContextType {
  isOpen: boolean;
  isMinimized: boolean;
  isExpanded: boolean;
  messages: SoclMessage[];
  isLoading: boolean;
  suggestedQuestions: string[];
  pageContext: string;
  openSocl: (prompt?: string) => void;
  closeSocl: () => void;
  toggleSocl: () => void;
  minimizeSocl: () => void;
  expandSocl: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  regenerateLast: () => Promise<void>;
}

const SoclContext = createContext<SoclContextType | undefined>(undefined);

const INITIAL_WELCOME_MESSAGE: SoclMessage = {
  id: "welcome-1",
  role: "assistant",
  content: `### Hi! How can I help you?
I can answer questions about your data, explain sentiment metrics, and help with PR crisis situations.

Choose a prompt below or type your question:`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  source: "knowledge_fallback",
};

export function SoclProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<SoclMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "How do I monitor a PR crisis in real time?",
    "Explain how the sentiment score is calculated",
    "How do I analyze a post with Gemini AI?",
    "Where can I download executive PDF reports?",
  ]);

  // Update suggestions whenever pathname changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`/api/socl?pageContext=${encodeURIComponent(pathname || "/")}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.suggestions) {
            setSuggestedQuestions(json.data.suggestions);
          }
        }
      } catch {
        // Fallback default suggestions already set
      }
    };
    fetchSuggestions();
  }, [pathname]);

  // Listen for custom global event "socialint:open-socl"
  useEffect(() => {
    const handleOpenEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setIsMinimized(false);
      if (customEvent.detail?.prompt) {
        sendMessage(customEvent.detail.prompt);
      }
    };

    window.addEventListener("socialint:open-socl", handleOpenEvent);
    return () => {
      window.removeEventListener("socialint:open-socl", handleOpenEvent);
    };
  }, []);

  const openSocl = useCallback((prompt?: string) => {
    setIsOpen(true);
    setIsMinimized(false);
    if (prompt) {
      sendMessage(prompt);
    }
  }, []);

  const closeSocl = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSocl = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const minimizeSocl = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  const expandSocl = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: SoclMessage = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyForApi = messages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/socl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          pageContext: pathname || "/",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const json = await res.json();
      const replyData = json.data;

      const assistantMessage: SoclMessage = {
        id: `asst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "assistant",
        content:
          replyData?.reply ||
          "I am here to help you navigate SocialInt and manage PR crises. Could you please specify your question?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: replyData?.source || "knowledge_fallback",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (replyData?.suggestedQuestions && Array.isArray(replyData.suggestedQuestions)) {
        setSuggestedQuestions(replyData.suggestedQuestions);
      }
    } catch (err) {
      console.error("Failed to send message to SOCL:", err);
      const fallbackMessage: SoclMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `###  SOCL Offline Assistant
I am temporarily in high-availability mode.

Here are quick actions you can take:
- Check your social media monitoring on the [Dashboard](/)
- Paste a URL to examine live comments on [Posts Analysis](/posts-analysis)
- Review real-time viral velocity on [Trends](/trends)
- Generate stakeholder reports on [Reports](/reports)
- Contact engineering support at **supportsocialint@gmail.com**`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "knowledge_fallback",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateLast = async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove last assistant message
      setMessages((prev) => {
        const next = [...prev];
        if (next.length > 0 && next[next.length - 1].role === "assistant") {
          next.pop();
        }
        return next;
      });
      await sendMessage(lastUserMessage.content);
    }
  };

  return (
    <SoclContext.Provider
      value={{
        isOpen,
        isMinimized,
        isExpanded,
        messages,
        isLoading,
        suggestedQuestions,
        pageContext: pathname || "/",
        openSocl,
        closeSocl,
        toggleSocl,
        minimizeSocl,
        expandSocl,
        sendMessage,
        clearMessages,
        regenerateLast,
      }}
    >
      {children}
    </SoclContext.Provider>
  );
}

export function useSocl() {
  const context = useContext(SoclContext);
  if (!context) {
    throw new Error("useSocl must be used within a SoclProvider");
  }
  return context;
}
