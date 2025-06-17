import { useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import {MULTI_OUTCOME_MARKET_ADDRESS } from "../helpers/constants";
import abi from "../../abi/MultiOutcomeABI.json";
import { Abi } from "starknet";
import { MultiOutcomeMarket } from "../helpers/types";

export const useFetchMultiOutcomeMarkets = () => {
  const [loading, setLoading] = useState(false);
  const [multiOutcomeMarkets, setMarkets] = useState<MultiOutcomeMarket[]>([]);
  
  const { contract } = useContract({ address: MULTI_OUTCOME_MARKET_ADDRESS, abi:abi as Abi});
  
  useEffect(() => {
    const fetchMultiOutcomeMarkets = async () => {
      if (!contract) return;
      setLoading(true);

      try {
        const data = await contract.get_all_multioutcome_markets();
        console.log("The multiOutcome Markets are",data)
        setMarkets(data);
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMultiOutcomeMarkets();
  }, [contract]);

  return { fetching:loading ,multiOutcomeMarkets };
};


