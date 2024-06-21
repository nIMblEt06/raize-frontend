"use client";
import { Inter } from "next/font/google";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Header from "@/components/Header";
import { MarketProvider } from "./context/MarketProvider";
import { SnackbarProvider } from "notistack";
import CustomToastWrapper from "@/components/Toast/Wrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <StarknetProvider>
          <Header />
          <MarketProvider>
            <SnackbarProvider
              maxSnack={2}
              Components={{
                //@ts-ignore
                custom: CustomToastWrapper,
              }}
            >
              <main style={{ flex: "1", width: "100%" }}>{children}</main>
            </SnackbarProvider>
          </MarketProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
