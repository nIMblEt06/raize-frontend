import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raize",
  description: "Precision Market on Starknet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StarknetProvider>
          <Header />
          <main style={{ flex: "1", width: "100%" }}>{children}</main>
        </StarknetProvider>
      </body>
    </html>
  );
}
