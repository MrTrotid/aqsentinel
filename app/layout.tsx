import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from "./components/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AQSentinel",
  description: "Control Room for AQSentinel",
  icons: {
    icon: [
      {
        url: '/logo.svg',  // Place your SVG file in the public folder
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      }
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[92px]`}
      >
        <NavigationBar></NavigationBar>
        {children}
      </body>
    </html>
  );
}
