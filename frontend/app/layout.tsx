import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SocialInt",
    template: "%s | SocialIntel",
  },
  description:
    "AI-powered social media intelligence, sentiment analysis, trend detection, audience insights, and influence analytics.",
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('socialint_theme');
      var isDark = false;
      if (stored === 'DARK') {
        isDark = true;
      } else if (stored === 'SYSTEM' || !stored) {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-white text-zinc-900 dark:bg-[#080b12] dark:text-zinc-100 selection:bg-cyan-500/20 selection:text-cyan-900 dark:selection:bg-[#457B9D]/30 dark:selection:text-cyan-200 transition-colors duration-150">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_aG9uZXN0LXBvbnktNTY5Ni5jbGVyay5hY2NvdW50cy5kZXYk"}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}