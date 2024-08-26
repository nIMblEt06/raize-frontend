import { NextPage } from "next";
import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useRouter } from "next/navigation";

import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { CLOCK_ICON, USDC_LOGO } from "@/components/helpers/icons";
import { MarketContext } from "@/app/context/MarketProvider";
import { FPMMOutcome, Outcome } from "@/components/helpers/types";
import {
  calcPrice,
  getProbabilites,
  getTimeBetween,
} from "@/components/helpers/functions";
import Image from "next/image";
import { Box } from "@mui/material";
import { HiLockClosed } from "react-icons/hi2";

interface Props {
  category: string;
  logo: string;
  deadline: string;
  heading: string;
  subHeading: string;
  outcomes: FPMMOutcome[];
  marketId: number;
  isActive: boolean;
  index?: number;
}

const ContBetCard: NextPage<Props> = ({
  category,
  logo,
  deadline,
  heading,
  subHeading,
  outcomes,
  marketId,
  isActive,
  index,
}) => {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);

  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadlineDate = new Date(deadline).getTime();

    const timeBetween = getTimeBetween(deadlineDate, currentTime);
    setDaysRemaining(timeBetween[0]);
    setHoursRemaining(timeBetween[1]);
    setMinutesRemaining(timeBetween[2]);
  }, [deadline]);

  useEffect(() => {
    if (!outcomes || outcomes.length == 0) return;

    const percentages = calcPrice([
      outcomes[0].num_shares_in_pool.toString(),
      outcomes[1].num_shares_in_pool.toString(),
    ]);
    setPrice1(percentages[0]);
    setPrice2(percentages[1]);
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
    router.push(`/cont-bet-details/${category.replace(" ", "-")}/${encodedId}`);
  };

  const checkDeadline = (): boolean => {
    const currentTime = new Date().getTime();
    const deadlineDate = new Date(deadline).getTime();
    return currentTime > deadlineDate;
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
      className='BetBorder'
    >
      <div className='ContBetCard'>
        <div className='BetCard-HeadingContainer'>
          <div className='BetCard-CategoryContainer'>
            <div className='CategoryLogo'>
              <Image src={logo} alt='Logo' width={30} height={30} />
            </div>
            <div className='CategoryName'>{category}</div>
            <div className='Flair'>Continuous</div>
          </div>
          <div className='Bet-Duration'>
            <div className='DurationIcon'>
              <CustomLogo src={CLOCK_ICON} />
            </div>
            {daysRemaining > 0 ? `${daysRemaining}d : ${hoursRemaining}h : ${minutes}m` : "Claimable"}
          </div>
        </div>
        <div className='BetCard-DetailsWrapper'>
          <span className='Heading'>{heading}</span>
          <span className='Sub-Heading'>{subHeading}</span>
        </div>
        <div className='BetCard-OptionsContainer'>
          <div
            onClick={() => {
              handleOpen(0);
            }}
            className='BetCard-Option'
          >
            <span className='Green-Text'>{outcomes[0].name}</span>
            <span className='Bet-Stat'>${price1.toFixed(2)}</span>
          </div>
          <div
            onClick={() => {
              handleOpen(1);
            }}
            className='BetCard-Option'
          >
            <span className='Red-Text'>{outcomes[1].name}</span>
            <span className='Bet-Stat'>${price2.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContBetCard;
