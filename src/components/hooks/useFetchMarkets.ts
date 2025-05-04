import { useContract } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";
import axios from "axios";
import { FPMMMarketInfo, Market } from "../helpers/types";

const useFetchMarkets = () => {
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [contMarkets, setContMarkets] = useState<FPMMMarketInfo[]>([]);
  const { contract } = useContract({ address: CONTRACT_ADDRESS, abi });
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!contract) return;
      setLoading(true);

      try {
        const [onChainMarkets] = await Promise.all([
          contract.get_all_markets(),
        ]);
        setMarkets(onChainMarkets);
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [contract]);

  return { loading, markets, contMarkets };
};

export default useFetchMarkets;
