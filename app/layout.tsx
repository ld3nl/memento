import "../styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import type { Viewport } from "next";
import { Footer } from "../components/Footer";

// Define viewport settings for responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: false,
};

export const metadata = {
  title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
  description:
    "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
  openGraph: {
    title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
    description:
      "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
    images: [
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    ], // Optional, add an image for social sharing
  },
  // Optional Twitter card tags
  twitter: {
    card: "summary_large_image",
    title: "Memento Mori Online Table Generator - Calculate Your Life in Weeks",
    description:
      "Discover how many weeks you've lived with our Memento Mori Online Table Generator. Input your DOB to visualize your life across 10 decades, based on an 80-year lifespan",
    images: [
      "https://utfs.io/f/vfxFGWyJBql9tjBcWhLA6EWr7SI90xRVulwdUhnPDQs8kcH3",
    ],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "57x57" },
      { url: "/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-70x70.png",
        sizes: "70x70",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-150x150.png",
        sizes: "150x150",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/ms-icon-310x310.png",
        sizes: "310x310",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "v2sHI7uXGFwijEqESYGy_2yrSbDW6lzLolCzZUl-ttw",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white dark:bg-black">
        <main className="flex-1">{children}</main>
        <Footer />
        {/* <GoogleAnalytics gaId="G-XXXXXXXXXX" /> */}
        <Analytics />
        <GoogleTagManager gtmId="G-CYT1S2EC6W" />
      </body>
    </html>
  );
}
