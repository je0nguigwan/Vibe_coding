import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import PhoneFrame from "@/components/phone-frame";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FoodTinder MVP",
  description: "Group-first dining decisions with fast, fair swipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <div className="min-h-screen bg-black px-4 py-10">
          <PhoneFrame>{children}</PhoneFrame>
        </div>
      </body>
    </html>
  );
}
