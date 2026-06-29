import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "leaflet/dist/leaflet.css";

import { AuthProvider } from "@/components/auth-provider";
import { SiteShell } from "@/components/site-shell";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-earth-body",
});

const jakartaDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-earth-display",
});

export const metadata: Metadata = {
  title: "earthmender",
  description:
    "A calm, mobile-first waste reporting platform for capture, territory tracking, and environmental learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jakartaDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
        </AuthProvider>
      </body>
    </html>
  );
}
