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

const useFPMMClaimWinnings = (marketId: number, choice: number) => {
  const { address } = useAccount();
  const { contract } = useContract({
    address: FPMM_CONTRACT_ADDRESS,
    abi: abi,
  });

  //   const { swapCall } = useSwapTrade(currentToken, betAmount);

  const calls = useMemo(() => {
    if (!address || !contract || !marketId) return [];

    return [contract.populateTransaction["claim_winnings"]!(marketId, choice)];
  }, [contract, address, choice, marketId]);

  //   const updateShares = async () => {
  //     if (updatedShares || !marketId || !betAmount) return;
  //     await axios
  //       .post(`${process.env.SERVER_URL}/update-market`, {
  //         marketId: marketId,
  //         outcomeIndex: choice,
  //         amount: parseFloat(betAmount) * 10 ** 6,
  //         isBuy: false,
  //         sharesUpdated: parseInt(minAmount),
  //       })
  //       .then((res) => {})
  //       .catch((error) => {
  //         console.error("Error creating market:", error);
  //       });
  //     setUpdatedShares(true);
  //   };

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
      //   updateShares();
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

  return { writeAsync };
};

export default useFPMMClaimWinnings;
