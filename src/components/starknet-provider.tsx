"use client";
import { ReactNode } from "react";

import { mainnet, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  jsonRpcProvider,
  publicProvider,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { usePathname } from "next/navigation";

export function StarknetProvider({ children }: { children: ReactNode }) {
  const connectors = [
    argent(),
    braavos(),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
    new ArgentMobileConnector(),
  ];

  function rpc() {
    return {
      nodeUrl: "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/KCxjAKyTbyWlZMWAw0NKE0JjXxIMRJNr", // mainnet
    };
  }

  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
}
