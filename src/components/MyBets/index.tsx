"use client";
import React, { useEffect, useState } from "react";
import OpenPositions from "./OpenPositions";
import ClosedPositions from "./ClosedPositions";
import "./styles.scss";
import { Market, UserBet } from "../helpers/types";
import { useAccount, useContract } from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";
import { getMarketType } from "../helpers/functions";

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
    const getAllMarkets = async () => {
      if (!contract || !address) {
        return;
      }
      if (openMarkets.length > 0 || closedMarkets.length > 0) return;
      const normal_res = await contract.get_user_markets(address);
      const crypto_res = await contract.get_user_sports_markets(address);
      const sports_res = await contract.get_user_crypto_markets(address);
      const openMarketsRes: Market[] = [];
      const closedMarketsRes: Market[] = [];
      const openBets: any[] = [];
      const closedBets: any[] = [];
      const all_markets = normal_res.concat(crypto_res, sports_res);
      for (const market of all_markets) {
        const getBetCount = await contract.get_num_bets_in_market(
          address,
          market.market_id,
          getMarketType(market.category)
        );
        console.log(getBetCount, "getBetCount");
        for (let i = 0; i < getBetCount; i++) {
          const outcomeAndBet: UserBet = await contract.get_outcome_and_bet(
            address,
            market.market_id,
            getMarketType(market.category),
            i + 1
          );
          if (market.is_active) {
            openMarketsRes.push(market);
            openBets.push(outcomeAndBet);
          } else {
            closedBets.push(outcomeAndBet);
            closedMarketsRes.push(market);
          }
        }
      }
      setOpenMarkets(openMarketsRes);
      setClosedMarkets(closedMarketsRes);
      setOpenBets(openBets);
      setClosedBets(closedBets);
    };
    getAllMarkets();
  }, [address, contract]);

  console.log(openMarkets, "openMarkets");

  return (
    <div className='MyBets'>
      <OpenPositions openMarkets={openMarkets} openBets={openBets} />
      <ClosedPositions closedMarkets={closedMarkets} closedBets={closedBets} />
    </div>
  );
}

export default MyBets;
