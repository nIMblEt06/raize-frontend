import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import { Market, UserBet } from "@/components/helpers/types";
import {
  getNumber,
  getString,
} from "@/components/helpers/functions";
import {
  useAccount,
  useContract,
  useContractWrite,
  useWaitForTransaction,
} from "@starknet-react/core";
import { CONTRACT_ADDRESS, options } from "@/components/helpers/constants";
import abi from "../../../abi/ContractABI.json";
import { USDC_LOGO } from "@/components/helpers/icons";
import { enqueueSnackbar } from "notistack";
import LoaderComponent from "../LoaderComponent";
import EmptyBetComponent from "../EmptyBetComponent";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import DetailsButton from "../OpenPositions/DetailsButton";

interface Props {
  closedMarkets: Market[];
  closedBets: {
    outcomeAndBet: UserBet;
    betNumber: number;
  }[];
  loading: boolean;
}

enum WinStatus {
  Won = "Won",
  Lost = "Lost",
  Claimable = "Claim",
}

function ClosedPositions({ closedMarkets, closedBets, loading }: Props) {
  const { address } = useAccount();
  const [marketId, setMarketId] = useState<any>(null);
  const [winStatus, setWinStatus] = useState<WinStatus[]>([]);
  const [betNumber, setBetNumber] = useState<number>(0);

  useEffect(() => {
    const newWinStatus = closedMarkets.map((market, index) => {
      const bet = closedBets[index].outcomeAndBet;
      
      if (!bet) return WinStatus.Lost;
      if (
        market.winning_outcome.Some &&
        market.winning_outcome.Some.name === bet.outcome.name
      ) {
        return bet.position.has_claimed ? WinStatus.Won : WinStatus.Claimable;
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
    if (!address || !contract || !marketId ) return [];
    return contract.populateTransaction["claim_winnings"]!(
      marketId,
      betNumber
    );
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

  const storeMarket = (
    marketId: number,
    category: string,
    betNumber: number
  ) => {
    setMarketId(marketId);
    setBetNumber(betNumber);
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
    const betNumber = closedBets[index].betNumber;
    const onClickHandler = isClaimable
      ? () => storeMarket(market.market_id, market.category, betNumber)
      : () => {};

    return (
      <div className="Data" key={market.market_id}>
        <span onClick={onClickHandler} className={`Status`}>
          <span className={`${statusClass}`}>{winStatus[index]}</span>
        </span>
        <span className="Event">{market.name}</span>
        <span className="DatePlaced">
          {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
        </span>
        <span className="BetToken StakedAmount">
          <Box className="TokenLogo">
            <CustomLogo src={USDC_LOGO} />
          </Box>{" "}
          {getNumber(closedBets[index]?.outcomeAndBet.position.amount || "0")}
        </span>
        <span className="Yes Prediction">
          {getString(closedBets[index]?.outcomeAndBet.outcome.name || "0")}
        </span>
        <DetailsButton
          name={market.name}
          date={new Date(parseInt(market.deadline)).toLocaleDateString(
            "en-US",
            options
          )}
          amount={getNumber(closedBets[index]?.outcomeAndBet.position.amount || "0")}
          prediction={getString(closedBets[index]?.outcomeAndBet.outcome.name || "0")}
        />
      </div>
    );
  };

  return (
    <div className="ClosedPositions">
      <div className="Heading">Closed Positions</div>
      <div className="Container">
        {loading ? (
          <LoaderComponent />
        ) : closedMarkets.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              className="Headings"
            >
              <span className="Status">Status</span>
              <span className="Event">Event</span>
              <span className="DatePlaced">Bet Deadline</span>
              <span className="StakedAmount">Staked Amount</span>
              <span className="Prediction">Prediction</span>
              <span className="Details"></span>
            </motion.div>
            {closedMarkets.map(renderMarket)}
          </>
        ) : (
          <EmptyBetComponent text="You have no closed positions" />
        )}
      </div>
    </div>
  );
}

export default ClosedPositions;
