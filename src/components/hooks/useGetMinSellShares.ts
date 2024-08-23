import { enqueueSnackbar } from "notistack";
import {
  CONTRACT_ADDRESS,
  FPMM_CONTRACT_ADDRESS,
  USDC_ADDRESS,
} from "../helpers/constants";
import {
  useAccount,
  useConnect,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import abi from "../../abi/AMMMarketABI.json";
import tokenABI from "../../abi/ERC20ABI.json";
import { useEffect, useMemo, useState } from "react";
import useSwapTrade from "./useSwapTrade";

const useGetMinSellShares = (
  marketId: number,
  betAmount: string,
  choice: number,
  decimals: number,
  isBuying: boolean
) => {
  const { address } = useAccount();
  const [minAmount, setMinAmount] = useState("");
  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getMinShares = async () => {
      if (
        !address ||
        !contract ||
        !(parseFloat(betAmount) > 0) ||
        !marketId ||
        decimals == 0 ||
        isBuying
      ) {
        return;
      }
      await contract
        .calc_sell_amount(
          marketId,
          BigInt(parseFloat(betAmount) * 10 ** decimals),
          choice
        )
        .then((res: any) => {
          setMinAmount(res);
        });
    };
    getMinShares();
  }, [contract, address, marketId, betAmount, choice, decimals]);

  return { minAmount };
};

export default useGetMinSellShares;
