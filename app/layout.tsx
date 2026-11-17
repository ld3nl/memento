import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import * as stylex from "@stylexjs/stylex";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Footer } from "../components/Footer";
import { body, display, mono } from "../lib/fonts";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "../lib/site";
import { breakpoints } from "../styles/breakpoints.stylex";
import { tokens } from "../styles/tokens.stylex";

const styles = stylex.create({
  html: {
    scrollBehavior: "smooth",
    colorScheme: {
      default: "light dark",
      [breakpoints.print]: "light",
    },
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: {
      default: tokens.surface,
      [breakpoints.print]: tokens.white,
    },
    fontFamily: tokens.fontSans,
    color: {
      default: tokens.primary,
      [breakpoints.print]: "#18181b",
    },
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  skip: {
    position: "absolute",
    width: {
      default: "1px",
      ":focus": "auto",
    },
    height: {
      default: "1px",
      ":focus": "auto",
    },
    paddingInline: {
      default: 0,
      ":focus": "1rem",
    },
    paddingBlock: {
      default: 0,
      ":focus": "0.5rem",
    },
    marginTop: {
      default: "-1px",
      ":focus": 0,
    },
    marginRight: {
      default: "-1px",
      ":focus": 0,
    },
    marginBottom: {
      default: "-1px",
      ":focus": 0,
    },
    marginLeft: {
      default: "-1px",
      ":focus": 0,
    },
    overflow: {
      default: "hidden",
      ":focus": "visible",
    },
    clipPath: {
      default: "inset(50%)",
      ":focus": "none",
    },
    whiteSpace: {
      default: "nowrap",
      ":focus": "normal",
    },
    borderWidth: 0,
    backgroundColor: tokens.accent,
    color: tokens.white,
    top: {
      default: "auto",
      ":focus": "0.5rem",
    },
    left: {
      default: "auto",
      ":focus": "0.5rem",
    },
    zIndex: {
      default: "auto",
      ":focus": 50,
    },
  },
  main: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
});

// Define viewport settings for mobile-first responsive design
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true, // Allow zoom for accessibility
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "How many weeks have I lived? | Memento Mori",
    template: "%s | Memento Mori",
  },
  description:
    "How many weeks have I lived? Count them on a life-in-weeks calendar. Enter a birthdate and see an 80-year grid of the weeks behind you and ahead.",
  keywords: [
    "memento mori",
    "life in weeks",
    "life calendar",
    "weeks calculator",
    "mortality reminder",
    "stoic calendar",
    "life expectancy visualizer",
    "time visualization",
    "life planning",
  ],
  authors: [{ name: "Memento Mori Team" }],
  creator: "Memento Mori",
  publisher: "Memento Mori",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: "How many weeks have I lived? | Memento Mori",
    description:
      "How many weeks have I lived? Count them on a life-in-weeks calendar. Enter a birthdate and see an 80-year grid of the weeks behind you and ahead.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 730,
        height: 548,
        alt: "Memento Mori Life Calendar Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How many weeks have I lived? | Memento Mori",
    description:
      "How many weeks have I lived? Count them on a life-in-weeks calendar. Enter a birthdate and see an 80-year grid of the weeks behind you and ahead.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png" },
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
  manifest: "/manifest.webmanifest",
  verification: {
    google: "v2sHI7uXGFwijEqESYGy_2yrSbDW6lzLolCzZUl-ttw",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const htmlProps = stylex.props(styles.html);
  const htmlClassName = [
    display.variable,
    body.variable,
    mono.variable,
    htmlProps.className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      {...htmlProps}
      className={htmlClassName}
    >
      <body {...stylex.props(styles.body)}>
        <a href="#main-content" {...stylex.props(styles.skip)}>
          Skip to content
        </a>
        <main id="main-content" {...stylex.props(styles.main)}>
          {children}
        </main>
        <Footer />
        <Analytics />
        <GoogleAnalytics gaId="G-CYT1S2EC6W" />
      </body>
    </html>
  );
}
