import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-white text-zinc-900 selection:bg-cyan-500/20 selection:text-cyan-900">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_aG9uZXN0LXBvbnktNTY5Ni5jbGVyay5hY2NvdW50cy5kZXYk"}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}