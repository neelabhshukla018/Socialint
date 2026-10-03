"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onLinkClick?: () => void;
}

export default function MarkdownRenderer({
  content,
  className = "",
  onLinkClick,
}: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse inline styles: bold, italic, inline code, and links
  const renderInlineFormatted = (text: string): React.ReactNode => {
    // Regex matches:
    // 1. Links: [text](url)
    // 2. Bold: **text**
    // 3. Inline code: `text`
    // 4. Italic: *text* or _text_
    const pattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    const parts = text.split(pattern);

    return parts.map((part, i) => {
      if (!part) return null;

      // Link
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, linkText, href] = match;
          const isInternal = href.startsWith("/") || href.startsWith("#");

          if (isInternal) {
            return (
              <Link
                key={i}
                href={href}
                onClick={onLinkClick}
                className="font-medium text-zinc-950 dark:text-zinc-100 underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5 transition-colors"
              >
                <span>{linkText}</span>
              </Link>
            );
          }

          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-950 dark:text-zinc-100 underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5 transition-colors"
            >
              <span>{linkText}</span>
              <ExternalLink size={12} className="inline opacity-70 ml-0.5" />
            </a>
          );
        }
      }

      // Bold
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={i} className="font-semibold text-zinc-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code
            key={i}
            className="rounded-md bg-zinc-100 dark:bg-zinc-800/90 px-1.5 py-0.5 text-[12px] font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/80"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Italic
      if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
        return (
          <em key={i} className="italic text-zinc-700 dark:text-zinc-300">
            {part.slice(1, -1)}
          </em>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  // Split into lines and parse blocks
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeBlockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block delimiters
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        const fullCode = codeBuffer.join("\n");
        const idx = codeBlockIndex++;
        blocks.push(
          <div
            key={`code-${idx}`}
            className="relative my-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden text-xs shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 font-mono text-[11px] text-zinc-400">
              <span>Code / Formula</span>
              <button
                type="button"
                onClick={() => copyCode(fullCode, idx)}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 font-mono overflow-x-auto whitespace-pre leading-relaxed text-zinc-200">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="font-display text-base sm:text-lg text-zinc-950 dark:text-white mt-3.5 mb-1.5 flex items-center gap-1.5"
        >
          {renderInlineFormatted(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="font-display text-lg sm:text-xl text-zinc-950 dark:text-white mt-4 mb-2"
        >
          {renderInlineFormatted(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1
          key={`h1-${i}`}
          className="font-display text-xl sm:text-2xl text-zinc-950 dark:text-white mt-4 mb-2"
        >
          {renderInlineFormatted(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-2 border-zinc-400 dark:border-zinc-600 pl-3 py-1 my-2 bg-zinc-100/60 dark:bg-zinc-800/60 rounded-r-md text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic"
        >
          {renderInlineFormatted(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Unordered list item
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const indent = line.search(/\S/);
      const text = line.trim().slice(2);
      blocks.push(
        <div
          key={`li-${i}`}
          className={`flex items-start gap-2 my-1 text-xs sm:text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300 ${
            indent > 0 ? "ml-4" : "ml-1"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-1.5 shrink-0" />
          <span className="flex-1">{renderInlineFormatted(text)}</span>
        </div>
      );
      continue;
    }

    // Numbered list item
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const [, num, text] = numMatch;
      blocks.push(
        <div
          key={`ol-${i}`}
          className="flex items-start gap-2 my-1 ml-1 text-xs sm:text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300"
        >
          <span className="font-mono font-bold text-[11px] text-zinc-500 dark:text-zinc-400 w-4 shrink-0 pt-0.5">
            {num}.
          </span>
          <span className="flex-1">{renderInlineFormatted(text)}</span>
        </div>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      blocks.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p
        key={`p-${i}`}
        className="my-1 text-xs sm:text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300"
      >
        {renderInlineFormatted(line)}
      </p>
    );
  }

  return (
    <div
      className={`space-y-0.5 text-zinc-800 dark:text-zinc-200 break-words ${className}`}
    >
      {blocks}
    </div>
  );
}
