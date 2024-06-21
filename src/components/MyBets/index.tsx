"use client";
import React, { useEffect, useState } from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";
import { Market } from "../helpers/types";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";

function MyBets() {
  const { address } = useAccount();

  const [openMarkets, setOpenMarkets] = useState<Market[]>([]);
  const [openBets, setOpenBets] = useState<any>([]);
  const [closedMarkets, setClosedMarkets] = useState<Market[]>([]);
  const [closedBets, setClosedBets] = useState<any>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = () => {
      if (!contract || !address) {
        return;
      }
      contract.getUserMarkets(address).then((res: any) => {
        res.forEach((market: Market) => {
          if (market.isActive) {
            setOpenMarkets((prev) => [...prev, market]);
          } else {
            setClosedMarkets((prev) => [...prev, market]);
          }
          contract
            .getOutcomeAndBet(address, market.marketId)
            .then((res: any) => {
              if (market.isActive) {
                setOpenBets((prev: any) => [...prev, res]);
              } else {
                setClosedBets((prev: any) => [...prev, res]);
              }
            });
        });
      });
    };
    getAllMarkets();
  }, [address, contract]);

  return (
    <div className='MyBets'>
      <OpenPositions openMarkets={openMarkets} openBets={openBets} />
      <ClosedPositions closedMarkets={closedMarkets} closedBets={closedBets} />
    </div>
  );
}

export default MyBets;
