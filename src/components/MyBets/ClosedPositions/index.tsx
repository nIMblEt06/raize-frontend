import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import StarknetLogo from "../../../../public/assets/logos/starknet.svg";
import { Market } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { CONTRACT_ADDRESS, ETH_ADDRESS } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { num } from "starknet";
import { ETH_LOGO, STARKNET_LOGO } from "@/components/helpers/icons";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/navigation";

interface Props {
  closedMarkets: Market[];
  closedBets: any;
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
  const [winStatus, setWinStatus] = useState<WinStatus[] | null>([]);
  const getWinStatus = (market: Market, bet: any) => {
    if (!bet) return;
    if (market.winningOutcome.Some!.name === bet[0].name) {
      if (bet[1].hasClaimed == false) {
        setWinStatus([...winStatus!, WinStatus.Claimable]);
      } else {
        return setWinStatus([...winStatus!, WinStatus.Won]);
      }
    } else {
      return setWinStatus([...winStatus!, WinStatus.Lost]);
    }
  };

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  const calls = useMemo(() => {
    if (!address || !contract || !marketId) return [];
    return contract.populateTransaction["claimWinnings"]!(marketId, address);
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
    if (pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds."
      );
    }
    if (success) {
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
  }, [data, error, isPending, isSuccess]);

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
        {closedMarkets.map((market, index) => (
          <div className='Data' key={index}>
            <p
              onClick={
                closedBets.length > 0 &&
                winStatus &&
                winStatus[index] == WinStatus.Claimable
                  ? () => storeMarket(market.marketId)
                  : () => {}
              }
              className={`Status ${
                closedBets.length > 0 &&
                winStatus &&
                winStatus[index] == WinStatus.Claimable
                  ? "Claim"
                  : ""
              }`}
            >
              {closedBets.length > 0 && winStatus && winStatus[index]}
            </p>
            <p className='Event'>{market.name}</p>
            <p className='DatePlaced'>
              {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
            </p>
            <p className='BetToken StakedAmount'>
              <Image
                src={
                  market.betToken &&
                  num.toHex(market.betToken).toString().toLowerCase() ==
                    ETH_ADDRESS.toLowerCase()
                    ? ETH_LOGO
                    : STARKNET_LOGO
                }
                width={15}
                height={15}
                alt={"tokenImage"}
              />{" "}
              {closedBets.length > 0 && closedBets[index]
                ? getNumber(closedBets[index][1].amount)
                : "0"}
            </p>
            <p className='Yes Prediction'>
              {closedBets.length > 0 && closedBets[index]
                ? getString(closedBets[index][0].name)
                : "0"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClosedPositions;
