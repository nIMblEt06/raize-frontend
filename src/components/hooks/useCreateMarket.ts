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
      !marketData.isHome ||
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
        marketData.isHome
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
          : marketData.category == "Sports Market"
          ? createSportsMarketCalls
          : createNormalMarketCalls,
    });

  const createMarket = async () => {
    await writeAsync();
  };

  return { createMarket, data, isError, isSuccess, isPending, error };
}

export default useCreateMarket;