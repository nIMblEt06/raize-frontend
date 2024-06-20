"use client";

import { createContext, useState } from "react";

interface MarketContextType {
  currentMarket: number;
  choice: number;
  setCurrentMarket: (marketId: number) => void;
  setChoice: (choice: number) => void;
}

export const MarketContext = createContext<MarketContextType>({
  currentMarket: 0,
  choice: 0,
  setCurrentMarket: () => {},
  setChoice: () => {},
});

interface Outcome {
  name: string;
  currentOdds: string;
  boughtShares: string;
}

export function MarketProvider({ children }: any) {
  const [currentMarket, setCurrentMarket] = useState<number>(0);
  const [choice, setChoice] = useState<number>(0);

  return (
    <MarketContext.Provider
      value={{ currentMarket, choice, setCurrentMarket, setChoice }}
    >
      {children}
    </MarketContext.Provider>
  );
}
