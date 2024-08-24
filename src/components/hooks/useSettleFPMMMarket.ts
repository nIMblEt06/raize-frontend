import {
  useAccount,
  useContract,
  useContractWrite,
} from "@starknet-react/core";
import { useMemo } from "react";
import { CONTRACT_ADDRESS, FPMM_CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/AMMMarketABI.json";

interface Data {
  marketId: BigInt;
  outcome: number;
}

function useSettleFPMMMarket(marketData: Data) {
  const { address } = useAccount();
  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });
  const settleNormalMarketCalls = useMemo(() => {
    if (!contract || !address || !marketData.marketId) return [];
    return [
      contract.populateTransaction["set_market_winner"]!(
        marketData.marketId,
        BigInt(marketData.outcome)
      ),
    ];
  }, [contract, address, marketData.marketId, marketData.outcome]);

  const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls: settleNormalMarketCalls,
    });

  const settleMarket = async () => {
    await writeAsync();
  };

  console.log(settleNormalMarketCalls);

  return { settleMarket, data, isError, isSuccess, isPending, error };
}

export default useSettleFPMMMarket;
