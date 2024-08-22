import { enqueueSnackbar } from "notistack";
import {
  CONTRACT_ADDRESS,
  FPMM_CONTRACT_ADDRESS,
  STARK_ADDRESS,
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
import { useEffect, useMemo, useState } from "react";
import useGetMinSellShares from "./useGetMinSellShares";
import axios from "axios";

const useFPMMSellShare = (
  marketId: number,
  betAmount: string,
  choice: number,
) => {
  const { address } = useAccount();
  const [userMarketShare, setUserMarketShare] = useState("");
  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });

  const { minAmount } = useGetMinSellShares(marketId, betAmount, choice, 18);

  useEffect(() => {
    const getUserMarketShare = async () => {
      if (!address || !contract || !marketId) return;
      const userMarketShare = await contract.get_user_market_share(
        address,
        marketId,
        choice
      );
      setUserMarketShare(userMarketShare);
    };
    getUserMarketShare();
  }, [contract, address, choice, marketId]);

  //   const { swapCall } = useSwapTrade(currentToken, betAmount);

  const calls = useMemo(() => {
    if (
      !address ||
      !contract ||
      !(parseFloat(betAmount) > 0) ||
      !marketId ||
      !(parseFloat(minAmount) > 0)
    )
      return [];

    return [
      contract.populateTransaction["sell"]!(
        marketId,
        BigInt(parseFloat(betAmount) * 10 ** 18),
        choice,
        minAmount
      ),
    ];
  }, [contract, address, choice, betAmount, marketId, minAmount]);

  const updateShares = async () => {
    await axios
      .post(`${process.env.SERVER_URL}/update-market`, {
        marketId,
        outcomeIndex: choice,
        amount: betAmount,
        isBuy: false,
        sharesUpdated: minAmount,
      })
      .then((res) => {
        console.log("Market updated successfully", res);
      })
      .catch((error) => {
        console.error("Error creating market:", error);
      });
  };

  const { writeAsync, data, isError } = useContractWrite({
    calls,
  });

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        data!.transaction_hash
      );
    }
    if (isError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        "info"
      );
    }
    if ((data && success) || (data && !pending)) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in “My bets” section. PS - All the best for this and your next prediction.",
        "success",
        data!.transaction_hash
      );
      updateShares();
    }
  }, [data, isError, pending, success]);

  const handleToast = (
    message: string,
    subHeading: string,
    type: string,
    hash?: string
  ) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  return { minAmount, writeAsync, userMarketShare };
};

export default useFPMMSellShare;
