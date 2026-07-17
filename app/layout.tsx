import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { SelectedVenueProvider } from "@/context/SelectedVenueContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KhelHub - Book Your Perfect Pitch",
  description: "Nepal's #1 Sports Booking Platform. Find and book futsal courts, join teams, and compete.",
};

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
      <body className="min-h-full flex flex-col bg-canvas text-body">
          <UserProvider>
          <SelectedVenueProvider>
            <Navbar />
            {children}
          </SelectedVenueProvider>
        </UserProvider>
      </body>
    </html>
  );
}
