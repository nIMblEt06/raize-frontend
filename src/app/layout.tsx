"use client";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import Header from "@/components/Header";
import { MarketProvider } from "./context/MarketProvider";
import { SnackbarProvider } from "notistack";
import CustomToastWrapper from "@/components/Toast/Wrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <title>Raize Club | Turn Insights into Income</title>
        <meta
          name='RaizeClub'
          content='On-chain prediction market on the Starknet ecosystem.'
        />
      </head>
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
