import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ConversionProvider from "@/src/components/context/ConversionContext";
import AIContextProvider from "@/src/components/context/AIContext";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "trueSize - Precision Measurement & Unit Conversion",
  description:
    "AR-powered measurement tool with intelligent unit conversion and AI-generated insights",
  keywords: ["measurement", "AR", "unit conversion", "AI", "calculator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <AIContextProvider>
          <ConversionProvider>{children}</ConversionProvider>
        </AIContextProvider>
      </body>
    </html>
  );
}
