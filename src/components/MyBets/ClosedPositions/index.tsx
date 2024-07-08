import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import StarknetLogo from "../../../../public/assets/logos/starknet.svg";
import { Market, UserBet } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { CONTRACT_ADDRESS } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { num } from "starknet";
import { ETH_LOGO, STARKNET_LOGO, USDC_LOGO } from "@/components/helpers/icons";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

interface Props {
  closedMarkets: Market[];
  closedBets: UserBet[];
}

enum WinStatus {
  Won = "Won",
  Lost = "Lost",
  Claimable = "Claim",
}

function ClosedPositions({ closedMarkets, closedBets }: Props) {
  const { address } = useAccount();
  const router = useRouter();
  const [marketId, setMarketId] = useState<any>(null);
  const [winStatus, setWinStatus] = useState<WinStatus[]>([]);

  useEffect(() => {
    const newWinStatus = closedMarkets.map((market, index) => {
      const bet = closedBets[index];
      if (!bet) return WinStatus.Lost; // Default or error state
      if (
        market.winning_outcome.Some &&
        market.winning_outcome.Some.name === bet.outcome.name
      ) {
        return bet.position.hasClaimed ? WinStatus.Won : WinStatus.Claimable;
      } else {
        return WinStatus.Lost;
      }
    });
    setWinStatus(newWinStatus);
  }, [closedMarkets, closedBets]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const calls = useMemo(() => {
    if (!address || !contract || !marketId) return [];
    return contract.populateTransaction["claim_winnings"]!(marketId, address);
  }, [marketId, contract, address]);

  const { writeAsync, data, error, isSuccess, isPending } = useContractWrite({
    calls,
  });

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  useEffect(() => {
    marketId && writeAsync();
    setMarketId(null);
  }, [marketId]);

  const storeMarket = (marketId: number) => {
    setMarketId(marketId);
  };

  useEffect(() => {
    if (pending && data) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds."
      );
    }
    if (data || success) {
      handleToast(
        "Claim Successful!",
        "Money is credited in your wallet, all the best for your next prediction. We’ll let you in on a secret - it’s fun.",
        data!.transaction_hash
      );
      setWinStatus([...winStatus!, (winStatus![marketId] = WinStatus.Won)]);
    }
    if (error) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again."
      );
    }
  }, [data, error, isPending, isSuccess, success, pending]);

  const handleToast = (message: string, subHeading: string, hash?: string) => {
    enqueueSnackbar(message, {
      //@ts-ignore
      variant: "custom",
      subHeading: subHeading,
      hash: hash,
      type: "danger",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  const renderMarket = (market: Market, index: number) => {
    const isClaimable = winStatus[index] === WinStatus.Claimable;
    const statusClass = isClaimable ? "Claim" : "";
    const onClickHandler = isClaimable
      ? () => storeMarket(market.market_id)
      : () => {};

    return (
      <div className='Data' key={market.market_id}>
        <p onClick={onClickHandler} className={`Status ${statusClass}`}>
          {winStatus[index]}
        </p>
        <p className='Event'>{market.name}</p>
        <p className='DatePlaced'>
          {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
        </p>
        <p className='BetToken StakedAmount'>
          <Image src={USDC_LOGO} width={15} height={15} alt={"tokenImage"} />{" "}
          {getNumber(closedBets[index]?.position.amount || "0")}
        </p>
        <p className='Yes Prediction'>
          {getString(closedBets[index]?.outcome.name || "0")}
        </p>
      </div>
    );
  };

  return (
    <div className='ClosedPositions'>
      <div className='Heading'>Closed Positions</div>
      <div className='Container'>
        <div className='Headings'>
          <p className='Status'>Status</p>
          <p className='Event'>Event</p>
          <p className='DatePlaced'>End Time</p>
          <p className='StakedAmount'>Staked Amount</p>
          <p className='Prediction'>Prediction</p>
        </div>
        {closedMarkets.map(renderMarket)}
      </div>
    </div>
  );
}

export default ClosedPositions;
