"use client";
import { StarknetProvider } from "@/components/starknet-provider";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/Header";
import { MarketProvider } from "./context/MarketProvider";
import { SnackbarProvider } from "notistack";
import CustomToastWrapper from "@/components/Toast/Wrapper";
import HeaderMobile from "@/components/Header/HeaderMobile";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Raize Club | Turn Insights into Income</title>
        <meta
          name="RaizeClub"
          content="On-chain prediction market on the Starknet ecosystem."
        />
        <meta name="twitter:card" content="player" />
        <meta name="twitter:site" content="@RaizeClub" />
        <meta name="twitter:title" content="RaizeClub" />
        <meta
          name="twitter:description"
          content="On-chain prediction market on the Starknet ecosystem."
        />
        <meta
          name="twitter:player"
          content="https://66a257f774646231b6a288ca--chipper-entremet-b37dc2.netlify.app/"
        />
        <meta name="twitter:player:width" content="360" />
        <meta name="twitter:player:height" content="560" />
        <meta name="twitter:image" content="https://freeimage.host/i/dxsbF6J" />
      </head>
      <body>
        <NextTopLoader showSpinner={false} color="#F5841F" />
        <StarknetProvider>
          <Header />
          <HeaderMobile />
          <MarketProvider>
            <SnackbarProvider
              maxSnack={2}
              Components={{
                //@ts-ignore
                custom: CustomToastWrapper,
              }}
            >
              <main
                style={{
                  flex: "1",
                  width: "100%",
                  height: "100%",
                  overflowY: "scroll",
                }}
              >
                {children}
              </main>
            </SnackbarProvider>
          </MarketProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
