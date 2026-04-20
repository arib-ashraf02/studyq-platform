import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "StudyQ — Collaborative Knowledge Exchange",
  description:
    "A collaborative learning platform where students log questions they couldn't solve, and the community helps answer them.",
  keywords: ["study", "Q&A", "learning", "collaborative", "knowledge", "questions"],
};

// Inline script to set theme before paint — prevents flash of wrong theme
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('studyq-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
    var vars = t === 'light' ? {
      '--background': '#f5f7fb',
      '--foreground': '#111827',
      '--card': '#ffffff',
      '--primary': '#2563eb',
      '--foreground-muted': '#4b5563',
      '--border-color': 'rgba(0,0,0,0.08)',
      '--navbar-bg': 'rgba(245,247,251,0.92)',
      '--sidebar-bg': 'rgba(240,242,248,0.85)',
    } : {
      '--background': '#0b0f1a',
      '--foreground': '#e5e7eb',
      '--card': 'rgba(255,255,255,0.05)',
      '--primary': '#3b82f6',
      '--foreground-muted': '#9ca3af',
      '--border-color': 'rgba(255,255,255,0.1)',
      '--navbar-bg': 'rgba(11,15,26,0.85)',
      '--sidebar-bg': 'rgba(10,10,24,0.4)',
    };
    Object.keys(vars).forEach(function(k) {
      document.documentElement.style.setProperty(k, vars[k]);
    });
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply theme from localStorage before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <AnimatedBackground />
          <CursorGlow />
          {children}
        </Providers>
      </body>
    </html>
  );
}
