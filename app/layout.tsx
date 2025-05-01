import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Motif company.",

  description: "MOTIF company.",
  openGraph: {
    description: "motif company.",
    siteName: "MOTIF COMPANY ",
    type: "website",
    images: [
      {
        url: "https://superb-caterpillar-664.convex.cloud/api/storage/06e092cc-4e08-4b16-ab49-622cec676208",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
