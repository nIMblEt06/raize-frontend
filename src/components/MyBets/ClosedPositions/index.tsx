import React, { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import { Market, UserBet } from "@/components/helpers/types";
import { getNumber, getString } from "@/components/helpers/functions";
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
  const [winStatus, setWinStatus] = useState<WinStatus[]>([]);

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

  const { writeAsync, data, isError } = useContractWrite({});

  const { isPending: pending, isSuccess: success } = useWaitForTransaction({
    hash: data?.transaction_hash,
  });

  const storeMarket = (marketId: number, betNumber: number) => {
    writeAsync({
      calls: contract!.populateTransaction["claim_winnings"]!(
        marketId,
        betNumber
      ),
    });
  };

  useEffect(() => {
    if (data && pending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        data!.transaction_hash
      );
    }
    if ((data && success) || (data && !pending)) {
      handleToast(
        "Claim Successful!",
        "Money is credited in your wallet, all the best for your next prediction. We’ll let you in on a secret - it’s fun.",
        "success",
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

  const renderMarket = (market: Market, index: number) => {
    const isClaimable = winStatus[index] === WinStatus.Claimable;
    const hasWon = winStatus[index] === WinStatus.Won;
    const statusClass = isClaimable ? "Claim" : hasWon ? "Won" : "Lost";
    const betNumber = closedBets[index].betNumber;
    const onClickHandler = isClaimable
      ? () => storeMarket(market.market_id, betNumber)
      : () => {};

    return (
      <div className='Data' key={market.market_id}>
        <span onClick={onClickHandler} className={`Status`}>
          <span className={`${statusClass}`}>{winStatus[index]}</span>
        </span>
        <span className='Event'>{market.name}</span>
        <span className='DatePlaced'>
          {new Date(parseInt(market.deadline)).toString().split("GMT")[0]}
        </span>
        <span className='BetToken StakedAmount'>
          <Box className='TokenLogo'>
            <CustomLogo src={USDC_LOGO} />
          </Box>{" "}
          {getNumber(closedBets[index]?.outcomeAndBet.position.amount || "0")}
        </span>
        <span className='Yes Prediction'>
          {getString(closedBets[index]?.outcomeAndBet.outcome.name || "0")}
        </span>
        <DetailsButton
          name={market.name}
          date={new Date(parseInt(market.deadline)).toLocaleDateString(
            "en-US",
            options
          )}
          amount={getNumber(
            closedBets[index]?.outcomeAndBet.position.amount || "0"
          )}
          prediction={getString(
            closedBets[index]?.outcomeAndBet.outcome.name || "0"
          )}
        />
      </div>
    );
  };

  return (
    <div className='ClosedPositions'>
      <div className='Heading'>Closed Positions</div>
      <div className='Container'>
        {loading ? (
          <LoaderComponent />
        ) : closedMarkets.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
              className='Headings'
            >
              <span className='Status'>Status</span>
              <span className='Event'>Event</span>
              <span className='DatePlaced'>Bet Deadline</span>
              <span className='StakedAmount'>Staked Amount</span>
              <span className='Prediction'>Prediction</span>
              <span className='Details'></span>
            </motion.div>
            {closedMarkets.map(renderMarket)}
          </>
        ) : (
          <EmptyBetComponent text='You have no closed positions' />
        )}
      </div>
    </div>
  );
}

export default ClosedPositions;
