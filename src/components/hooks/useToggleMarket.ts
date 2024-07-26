import {
  useAccount,
  useContract,
  useContractWrite,
} from "@starknet-react/core";
import { useMemo } from "react";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";

function useToggleMarket(marketId: BigInt) {
  const { address } = useAccount();

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });
  const toggleNormalMarketCalls = useMemo(() => {
    if (!contract || !address || !marketId) return [];
    return [contract.populateTransaction["toggle_market"]!(marketId)];
  }, [contract, address, marketId]);

  const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls: toggleNormalMarketCalls,
    });

  const toggleMarket = async () => {
    await writeAsync();
  };

  return { toggleMarket, data, isError, isSuccess, isPending, error };
}

export default useToggleMarket;
