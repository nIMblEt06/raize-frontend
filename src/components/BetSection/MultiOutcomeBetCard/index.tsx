import { NextPage } from "next";
import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";

import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { CLOCK_ICON, USDC_LOGO } from "@/components/helpers/icons";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import {
  getProbabilites,
  getProbabilitesMultiOutcome,
  getString,
  getTimeBetween,
} from "@/components/helpers/functions";
import Image from "next/image";
import { Box } from "@mui/material";
import { HiLockClosed } from "react-icons/hi2";

interface Props {
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
  outcomes: Outcome[];
  moneyInPool: number;
  marketId: number;
  isActive: boolean;
  index?: number;
  no_of_outcomes:number;
}

export const MultiOutcomeMarketBetCard: NextPage<Props> = ({
  logo,
  duration,
  heading,
  subHeading,
  outcomes,
  moneyInPool,
  marketId,
  isActive,
  index,
  no_of_outcomes
}) => {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);
  const [percent3, setPercent3] = useState(0);
  const [percent4, setPercent4] = useState(0);

  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration)).getTime();
    const timeBetween = getTimeBetween(deadline, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [duration]);

  useEffect(() => {
    let percentages;
    console.log(no_of_outcomes)
    if(Number(no_of_outcomes) === 4 ){
      percentages = getProbabilitesMultiOutcome(
        [
        outcomes[0].bought_shares.toString(),
        outcomes[1].bought_shares.toString(),
        outcomes[2].bought_shares.toString(),
        outcomes[3].bought_shares.toString()
      ]
      );
    }else{
      percentages = getProbabilitesMultiOutcome(
        [
        outcomes[0].bought_shares.toString(),
        outcomes[1].bought_shares.toString(),
        outcomes[2].bought_shares.toString(),
      ]
      );
    }
    console.log("The percentages are", percentages)
    setPercent1(percentages[0]);
    setPercent2(percentages[1]);
    setPercent3(percentages[2]);
    if(no_of_outcomes > 3){
    setPercent4(percentages[3])
    }   
  }, [outcomes]);

  const { setChoice } = useContext(MarketContext);

  const stringToHex = (int: number) => {
    const hex = int.toString(16); // Convert to hex without padding
    const randomChars = Math.random().toString(36).substring(2, 6); // Generate 4 random characters
    return `${hex}${randomChars}`;
  };

  const handleOpen = (outcome: number) => {
    setChoice(outcome);
    const encodedId = stringToHex(marketId);
    router.push(
      `/multi-outcome-bet-details/multi-outcome/${encodedId}`
    );
  };

  const checkDeadline = (): boolean => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration)).getTime();
    return currentTime > deadline;
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transition:
          typeof index === "number"
            ? `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${(index % 3) / 10}s`
            : "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
      }}
      className="MultiBetCard"
    >
      {(!isActive || checkDeadline()) && (
        <Box className="MarketClosed">
          <HiLockClosed />
          <span>Market Closed</span>
        </Box>
      )}

      <div className="MultiBetCard-HeadingContainer">
        <div className="MultiBetCard-CategoryContainer">
          <div className="CategoryLogo">
            <Image src={logo} alt="Logo" width={30} height={30} />
          </div>
          <div className="CategoryName">Multi Outcome Market</div>
        </div>
        <div className="MultiBet-Duration">
          <div className="DurationIcon">
            <CustomLogo src={CLOCK_ICON} />
          </div>
          {daysRemaining}d : {hoursRemaining}h : {minutes}m
        </div>
      </div>
      <div className="MultiBetCard-DetailsWrapper">
        <span className="Heading">{heading}</span>
        <span className="Sub-Heading">{subHeading}</span>
      </div>
      <div className="MultiBetCard-OptionsContainer">
        <div className="TopContainer">
        <div
          onClick={() => {
            handleOpen(0);
          }}
          className="MultiBetCard-Option"
        >
          <span className="Green-Text">{getString(outcomes[0].name)}</span>
          <span className="MultiBet-Stat">{percent1.toFixed(2)}%</span>
        </div>
        <div
          onClick={() => {
            handleOpen(1);
          }}
          className="MultiBetCard-Option"
        >
          <span className="Red-Text">{getString(outcomes[1].name)}</span>
          <span className="MultiBet-Stat">{percent2.toFixed(2)}%</span>
        </div>
        </div>
       <div className="BottomContainer">
       <div
          onClick={() => {
            handleOpen(2);
          }}
          className="MultiBetCard-Option"
        >
          <span className="Green-Text">{getString(outcomes[2].name)}</span>
          <span className="MultiBet-Stat">{percent3.toFixed(2)}%</span>
        </div>
       { Number(no_of_outcomes) > 3 && <div
          onClick={() => {
            handleOpen(3);
          }}
          className="MultiBetCard-Option"
        >
          <span className="Red-Text">{getString(outcomes[3].name)}</span>
          <span className="MultiBet-Stat">{percent4.toFixed(2)}%</span>
        </div>}
       </div>
        
      </div>
      <div className="Pool-Stats">
        Prize Pool
        <span className="Pool-Value">
          {(parseFloat(BigInt(moneyInPool).toString()) / 10 ** 6)
            .toString()
            .slice(0, 7)}
        </span>
        <div className="Starknet-logo">
          <CustomLogo src={USDC_LOGO} />
        </div>
      </div>
    </div>
  );
};

