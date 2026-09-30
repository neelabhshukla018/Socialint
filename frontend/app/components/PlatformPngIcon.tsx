"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface PlatformPngIconProps {
  platform?: string;
  size?: number;
  className?: string;
  alt?: string;
  showContainer?: boolean;
  containerClassName?: string;
}

export function getPlatformNormalizedKey(platformOrUrl?: string): string {
  if (!platformOrUrl) return "generic";
  const p = platformOrUrl.toLowerCase().trim();

  if (p.includes("instagram") || p.includes("instagr.am") || p === "ig") {
    return "instagram";
  }
  if (p.includes("facebook") || p.includes("fb.com") || p.includes("fb.watch") || p === "fb") {
    return "facebook";
  }
  if (p.includes("youtube") || p.includes("youtu.be") || p === "yt") {
    return "youtube";
  }
  if (p === "twitter") {
    return "twitter";
  }
  if (p.includes("twitter.com") || p.includes("x.com") || p === "x") {
    return "x";
  }
  if (p.includes("telegram") || p.includes("t.me")) {
    return "telegram";
  }
  if (p.includes("reddit") || p.includes("redd.it")) {
    return "reddit";
  }
  if (p.includes("tiktok")) {
    return "tiktok";
  }
  if (p.includes("linkedin")) {
    return "linkedin";
  }
  if (p.includes("threads")) {
    return "threads";
  }
  if (p.includes("github")) {
    return "github";
  }
  if (p.includes("news") || p.includes("rss") || p.includes("feed")) {
    return "news";
  }

  return "generic";
}

export function getPlatformPngPath(platformOrUrl?: string): string {
  const key = getPlatformNormalizedKey(platformOrUrl);
  switch (key) {
    case "instagram":
      return "/icons/platforms/instagram.png";
    case "facebook":
      return "/icons/platforms/facebook.png";
    case "youtube":
      return "/icons/platforms/youtube.png";
    case "x":
      return "/icons/platforms/x.png";
    case "twitter":
      return "/icons/platforms/twitter.png";
    case "telegram":
      return "/icons/platforms/telegram.png";
    case "reddit":
      return "/icons/platforms/reddit.png";
    case "tiktok":
      return "/icons/platforms/tiktok.png";
    case "linkedin":
      return "/icons/platforms/linkedin.png";
    case "threads":
      return "/icons/platforms/threads.png";
    case "github":
      return "/icons/platforms/github.png";
    case "news":
      return "/icons/platforms/news.png";
    default:
      return "/icons/platforms/instagram.png";
  }
}

export function getPlatformLabel(platformOrUrl?: string): string {
  const key = getPlatformNormalizedKey(platformOrUrl);
  switch (key) {
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "youtube":
      return "YouTube";
    case "x":
      return "X / Twitter";
    case "twitter":
      return "Twitter";
    case "telegram":
      return "Telegram";
    case "reddit":
      return "Reddit";
    case "tiktok":
      return "TikTok";
    case "linkedin":
      return "LinkedIn";
    case "threads":
      return "Threads";
    case "github":
      return "GitHub";
    case "news":
      return "News & RSS";
    default:
      return platformOrUrl || "Social";
  }
}

export function getPlatformBrandColor(platformOrUrl?: string): string {
  const key = getPlatformNormalizedKey(platformOrUrl);
  switch (key) {
    case "instagram":
      return "#E1306C";
    case "facebook":
      return "#1877F2";
    case "youtube":
      return "#FF0000";
    case "x":
      return "#000000";
    case "twitter":
      return "#1DA1F2";
    case "telegram":
      return "#229ED9";
    case "reddit":
      return "#FF4500";
    case "tiktok":
      return "#000000";
    case "linkedin":
      return "#0A66C2";
    case "threads":
      return "#000000";
    case "github":
      return "#24292E";
    case "news":
      return "#10B981";
    default:
      return "#457B9D";
  }
}

export default function PlatformPngIcon({
  platform,
  size = 20,
  className = "",
  alt,
  showContainer = false,
  containerClassName = "",
}: PlatformPngIconProps) {
  const [loadError, setLoadError] = useState(false);
  const iconPath = getPlatformPngPath(platform);
  const label = alt || getPlatformLabel(platform);

  const imgElement = (
    <img
      src={iconPath}
      alt={label}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setLoadError(true)}
      className={`inline-block shrink-0 object-contain select-none transition-transform duration-150 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      }}
    />
  );

  if (loadError) {
    // Graceful fallback if image cannot be rendered
    return (
      <span
        className={`inline-flex items-center justify-center font-bold text-xs uppercase rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {(label || "S")[0]}
      </span>
    );
  }

  if (showContainer) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 shadow-2xs shrink-0 p-1.5 ${containerClassName}`}
      >
        {imgElement}
      </div>
    );
  }

  return imgElement;
}
