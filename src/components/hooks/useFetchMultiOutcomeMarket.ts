import { useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { MULTI_OUTCOME_MARKET_ADDRESS } from "../helpers/constants";
import abi from "../../abi/MultiOutcomeABI.json";
import { MultiOutcomeMarket } from "../helpers/types";
import { uint256 } from "starknet";

export const useFetchParticularMultiOutcomeMarket = (marketId: BigInt) => {
  const [loading, setLoading] = useState(false);
  const [multiOutcomeMarket, setMarket] = useState<MultiOutcomeMarket | undefined>();
  
  const { contract } = useContract({ address: MULTI_OUTCOME_MARKET_ADDRESS, abi });

  useEffect(() => {
    const fetchMarket = async () => {
      if (!contract || !marketId) return;

      setLoading(true);

      try {
        const formattedId=(marketId);
        const data = await contract.get_market(formattedId); 
        console.log("Fetched market:", data);
        setMarket(data);
      } catch (err) {
        console.error("Failed to fetch market:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, [contract, marketId]); // 👈 add marketId dependency

  return { fetching: loading, multiOutcomeMarket };
};
