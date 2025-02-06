import type { Metadata } from "next";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://taverne-de-l-union.com"),
  title: "La Taverne de l'Union",
  description: "Là où l'aventure commence",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "https://taverne-de-l-union.com/manifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "La Taverne de l'Union",
    title: "La Taverne de l'Union",
    description: "Là où l'aventure commence",
    url: "https://taverne-de-l-union.com",
    images: {
      url: "https://taverne-de-l-union.com/og-image",
      width: 1200,
      height: 630,
      alt: "La Taverne de l'Union",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "dark" },
    { media: "(prefers-color-scheme: dark)", color: "dark" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Analytics />
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
