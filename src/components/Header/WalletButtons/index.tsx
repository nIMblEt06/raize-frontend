"use client";
import { NextPage } from "next";
import "./styles.scss";
import { useEffect, useMemo } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

import ConnectWallet from "../ConnectWallet";
import CustomLogo from "@/components/common/CustomIcons";
import { ARGENT_LOGO } from "@/components/helpers/icons";

interface Props {}

const WalletButtons: NextPage<Props> = ({}) => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect } = useConnect();

  useEffect(() => {
    const connectToStarknet = async () => {
      const connection = await connect({
        connector: connectors[0],
      });
    };
    connectToStarknet();
  }, []);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <div className="WalletButtons">
      {address ? (
        <div onClick={() => disconnect()} className="AddressBtn">
          <div className="AddressBtn-Logo">
            <CustomLogo src={ARGENT_LOGO} />
          </div>
          <span>{shortenedAddress}</span>
        </div>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
};

export default WalletButtons;
