import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

// Load the exact families the ShareKAI component references by name
// ('Fraunces' for display, 'Inter' for body) so its inline styles resolve.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShareKAI — Community Food Sharing",
  description:
    "ShareKAI helps schools and communities rescue surplus food, track pantry inventory, and match donations to needs in real time.",
};

export const viewport: Viewport = {
  themeColor: "#2E4630",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.className} ${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
