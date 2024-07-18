import {
  useAccount,
  useContract,
  useContractWrite,
} from "@starknet-react/core";
import { useMemo } from "react";
import { CallData, byteArray, cairo } from "starknet";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";

interface Data {
  category: string;
  marketId: BigInt;
  outcome: number;
}

function useSettleMarket(marketData: Data) {
  const { address } = useAccount();

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });
  const settleNormalMarketCalls = useMemo(() => {
    if (!contract || !address || !marketData.category || !marketData.marketId)
      return [];
    return [
      contract.populateTransaction["settle_market"]!(
        marketData.marketId,
        BigInt(marketData.outcome)
      ),
    ];
  }, [contract, address, marketData]);

  const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls: settleNormalMarketCalls,
    });

  const settleMarket = async () => {
    await writeAsync();
  };

  return { settleMarket, data, isError, isSuccess, isPending, error };
}

export default useSettleMarket;
