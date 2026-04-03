import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "ElectricGPT — Electrical Engineering Design Ideation",
  description: "AI-powered electrical engineering design blueprints referencing CEC, NBC, and NFPA standards",
};

// Inline script runs synchronously before first paint — no theme flash
const themeScript = `(function(){
  var t=localStorage.getItem('egpt-theme')||'dark';
  var f=localStorage.getItem('egpt-fontsize')||'normal';
  if(t==='dark')document.documentElement.classList.add('dark');
  if(f==='large')document.documentElement.classList.add('font-large');
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
