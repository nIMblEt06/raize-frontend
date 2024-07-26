import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { cairo } from "starknet";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import abi from "../../abi/ContractABI.json";
import { enqueueSnackbar } from "notistack";

interface Data {
  heading: string;
  category: string;
  description: string;
  outcome1: string;
  outcome2: string;
  deadline: Date;
  image: string;
  amount?: string;
  priceKey?: string;
  condition?: string;
  eventId?: string;
  isHome?: boolean;
}

function useCreateMarket(marketData: Data) {
  const { address } = useAccount();

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });
  const createNormalMarketCalls = useMemo(() => {
    if (
      !contract ||
      !address ||
      !marketData.heading ||
      !marketData.description ||
      !marketData.outcome1 ||
      !marketData.outcome2 ||
      !marketData.category ||
      !marketData.deadline ||
      !marketData.image
    )
      return [];
    return [
      contract.populateTransaction["create_market"]!(
        marketData.heading,
        marketData.description,
        cairo.tuple(marketData.outcome1, marketData.outcome2),
        marketData.category,
        marketData.image,
        marketData.deadline.getTime()
      ),
    ];
  }, [contract, address, marketData]);

  const createSportsMarketCalls = useMemo(() => {
    if (
      !contract ||
      !address ||
      !marketData.heading ||
      !marketData.description ||
      !marketData.outcome1 ||
      !marketData.outcome2 ||
      !marketData.category ||
      !marketData.deadline ||
      !marketData.image ||
      !marketData.eventId
    )
      return [];
    return [
      contract.populateTransaction["create_sports_market"]!(
        marketData.heading,
        marketData.description,
        cairo.tuple(marketData.outcome1, marketData.outcome2),
        marketData.category,
        marketData.image,
        marketData.deadline.getTime(),
        marketData.eventId,
        marketData.isHome ? true : false
      ),
    ];
  }, [contract, address, marketData]);

  const createCryptoMarketCalls = useMemo(() => {
    if (
      !contract ||
      !address ||
      !marketData ||
      !marketData.heading ||
      !marketData.description ||
      !marketData.outcome1 ||
      !marketData.outcome2 ||
      !marketData.category ||
      !marketData.deadline ||
      !marketData.image ||
      !marketData.condition ||
      !marketData.priceKey ||
      !marketData.amount
    )
      return [];
    return [
      contract.populateTransaction["create_crypto_market"]!(
        marketData.heading,
        marketData.description,
        cairo.tuple(marketData.outcome1, marketData.outcome2),
        marketData.category,
        marketData.image,
        marketData.deadline.getTime(),
        marketData.condition,
        marketData.priceKey,
        BigInt(parseInt(marketData.amount) * 1e8)
      ),
    ];
  }, [contract, address, marketData]);

  const { writeAsync, data, error, isError, isSuccess, isPending } =
    useContractWrite({
      calls:
        marketData.category == "Crypto Market"
          ? createCryptoMarketCalls
          : marketData.category == "Sports"
          ? createSportsMarketCalls
          : createNormalMarketCalls,
    });

  const createMarket = async () => {
    await writeAsync();
  };

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

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your market is being made, please wait for a few seconds.",
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
        "Market Created Succesfully!",
        "Your market is now live, let's start trading.",
        "success",
        data!.transaction_hash
      );
    }
  }, [data, isError, pending, success]);

  return { createMarket, data, isError, isSuccess, isPending, error };
}

export default useCreateMarket;
