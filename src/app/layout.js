import "./globals.css";
import "../styles/App.css";
import Providers from "./providers";
import Script from "next/script";
import { Suspense } from "react";

export const metadata = {
  title: "Watchez360 | Premium Watch Journal & Curation",
  description: "Explore Watchez360 Calibre Gazette, curated top watch lists, and premium wristwatches from luxury, smart, and analog collections.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900 selection:bg-neutral-100">
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
        <Script src="https://accounts.google.com/gsi/client" strategy="lazyOnload" />
      </body>
    </html>
  );
}
