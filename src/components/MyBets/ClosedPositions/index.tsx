import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import StarknetLogo from "../../../../public/assets/logos/starknet.svg";
import { Market } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
import {
  useAccount,
  useContract,
  useContractWrite,
} from "@starknet-react/core";
import { CONTRACT_ADDRESS, ETH_ADDRESS } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { num } from "starknet";
import { ETH_LOGO, STARKNET_LOGO } from "@/components/helpers/icons";

interface Props {
  closedMarkets: Market[];
  closedBets: any;
}

enum WinStatus {
  Won = "Won",
  Lost = "Lost",
  Claimable = "Claim",
}

function ClosedPositions({ closedMarkets, closedBets }: Props) {
  const { address } = useAccount();
  const [marketId, setMarketId] = useState<any>(null);
  const getWinStatus = (market: Market, bet: any) => {
    if (!bet) return;
    if (market.winningOutcome.Some!.name === bet[0].name) {
      if (bet[1].hasClaimed == false) {
        return WinStatus.Claimable;
      } else {
        return WinStatus.Won;
      }
    } else {
      return WinStatus.Lost;
    }
  };

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const calls = useMemo(() => {
    if (!address || !contract || !marketId) return [];
    return contract.populateTransaction["claimWinnings"]!(marketId, address);
  }, [marketId, contract, address]);

  const { writeAsync, data, error } = useContractWrite({
    calls,
  });

  useEffect(() => {
    marketId && writeAsync();
    setMarketId(null);
  }, [marketId]);

  const storeMarket = (marketId: number) => {
    setMarketId(marketId);
  };

  return (
    <div className='ClosedPositions'>
      <div className='Heading'>Closed Positions</div>
      <div className='Container'>
        <div className='Headings'>
          <p className='Status'>Status</p>
          <p className='Event'>Event</p>
          <p className='DatePlaced'>End Time</p>
          <p className='StakedAmount'>Staked Amount</p>
          <p className='Prediction'>Prediction</p>
        </div>
        {closedMarkets.map((market, index) => (
          <div className='Data' key={index}>
            <p
              onClick={
                closedBets.length > 0 &&
                getWinStatus(market, closedBets[index]) == WinStatus.Claimable
                  ? () => storeMarket(market.marketId)
                  : () => {}
              }
              className={`Status ${
                closedBets.length > 0 &&
                getWinStatus(market, closedBets[index]) == WinStatus.Claimable
                  ? "Claim"
                  : ""
              }`}
            >
              {closedBets.length > 0 && getWinStatus(market, closedBets[index])}
            </p>
            <p className='Event'>{market.name}</p>
            <p className='DatePlaced'>
              {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
            </p>
            <p className='BetToken StakedAmount'>
              <Image
                src={
                  market.betToken &&
                  num.toHex(market.betToken).toString().toLowerCase() ==
                    ETH_ADDRESS.toLowerCase()
                    ? ETH_LOGO
                    : STARKNET_LOGO
                }
                width={15}
                height={15}
                alt={"tokenImage"}
              />{" "}
              {closedBets.length > 0 && closedBets[index]
                ? getNumber(closedBets[index][1].amount)
                : "0"}
            </p>
            <p className='Yes Prediction'>
              {closedBets.length > 0 && closedBets[index]
                ? getString(closedBets[index][0].name)
                : "0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClosedPositions;
