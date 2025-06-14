import {
    useAccount,
    useContract,
    useContractWrite,
  } from "@starknet-react/core";
  import { useMemo } from "react";
  import { MULTI_OUTCOME_MARKET_ADDRESS } from "../helpers/constants";
  import abi from "../../abi/MultiOutcomeABI.json";

  interface Data {
    marketId: BigInt;
    outcome: number;
  }
  
  export function useSettleMultiOutcomeMarket(marketData: Data) {
    const { address } = useAccount();
  
    const { contract } = useContract({
      address: MULTI_OUTCOME_MARKET_ADDRESS,
      abi: abi,
    });
    const settleMultiOutcomeMarketCalls = useMemo(() => {
      if (!contract || !address ||  !marketData.marketId)
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
        calls: settleMultiOutcomeMarketCalls,
      });
  
    const settleMultiOutcomeMarket = async () => {
      try{
        await writeAsync();
      }catch(err){
        console.log(err);
      }
      
    };
  
    return { settleMultiOutcomeMarket, data, isError, isSuccess, isPending, error };
  }
  
  
  