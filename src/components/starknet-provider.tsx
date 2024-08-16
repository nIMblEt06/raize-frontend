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

  const pathname = usePathname();

  function rpc() {
    let nodeUrl = "";
    pathname.search("cont") != -1
      ? (nodeUrl = "https://starknet-sepolia.public.blastapi.io") // mainnet
      : (nodeUrl = "https://starknet-mainnet.public.blastapi.io"); // testnet

    console.log(nodeUrl);

    return {
      nodeUrl: nodeUrl, // testnet
      // nodeUrl: "https://starknet-mainnet.public.blastapi.io", // mainnet
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
