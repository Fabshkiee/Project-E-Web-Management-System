import type { Metadata } from "next";
import { Teko, Lexend, Space_Grotesk, Inter } from "next/font/google";
import "../styles/globals.css";
// landing.css is now imported inside globals.css

// Dashboard Fonts
const teko = Teko({ variable: "--font-teko", subsets: ["latin"] });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });

// Landing Page Fonts
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project-E Fitness Gym",
  description: "Train With Purpose. Train With Passion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${teko.variable} ${lexend.variable} ${spaceGrotesk.variable} ${inter.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
