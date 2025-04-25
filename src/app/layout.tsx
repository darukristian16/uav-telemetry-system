// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { TelemetryProvider } from "@/context/TelemetryContext";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UAV Telemetry System",
  description: "Monitor and control your UAV telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gray-900">
      <body className={`${inter.className} flex h-full flex-col`}>
        <SessionProviderWrapper>
          <TelemetryProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </TelemetryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
