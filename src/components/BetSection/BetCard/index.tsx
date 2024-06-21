import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import {
  CLOCK_ICON,
  ETH_LOGO,
  STARKNET_LOGO,
  US_LOGO,
} from "@/components/helpers/icons";
import { useRouter } from "next/navigation";
import { shortString, num } from "starknet";
import { ETH_ADDRESS } from "@/components/helpers/constants";
import { MarketContext } from "@/app/context/MarketProvider";
import { Outcome } from "@/components/helpers/types";
import { getProbabilites, getString } from "@/components/helpers/functions";

interface Props {
  category: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
  betToken: string;
  outcomes: Outcome[];
  moneyInPool: number;
  marketId: number;
}

const BetCard: NextPage<Props> = ({
  category,
  logo,
  duration,
  heading,
  subHeading,
  betToken,
  outcomes,
  moneyInPool,
  marketId,
}) => {
  const router = useRouter();
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);
  const [percent1, setPercent1] = useState(0);
  const [percent2, setPercent2] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration)).getTime();
    const timeRemaining = deadline - currentTime;
    setHoursRemaining(new Date(timeRemaining).getHours());
    setMinutesRemaining(new Date(timeRemaining).getMinutes());
  }, [duration]);


  useEffect(() => {
    const percentages = getProbabilites(outcomes[0].boughtShares.toString(), outcomes[1].boughtShares.toString());
    setPercent1(percentages[0]);
    setPercent2(percentages[1]);
  }, [outcomes]);

  const { setChoice, setCurrentMarket } = useContext(MarketContext);

  const handleOpen = (outcome: number) => {
    setChoice(outcome);
    setCurrentMarket(marketId);
    router.push("/bet-details");
  };

  return (
    <div className='BetCard'>
      <div className='BetCard-HeadingContainer'>
        <div className='BetCard-CategoryContainer'>
          <div className='CategoryLogo'>
            <CustomLogo src={logo} />
          </div>
          <div className='CategoryName'>
            {getString(category)}
          </div>
        </div>
        <div className='Bet-Duration'>
          <div className='DurationIcon'>
            <CustomLogo src={CLOCK_ICON} />
          </div>
          {hoursRemaining}h : {minutes}m
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
          <span className='Green-Text'>
            {getString(outcomes[0].name)}
          </span>
          <span className='Bet-Stat'>{percent1}%</span>
        </div>
        <div
          onClick={() => {
            handleOpen(1);
          }}
          className='BetCard-Option'
        >
          <span className='Red-Text'>
            {getString(outcomes[1].name)}
          </span>
          <span className='Bet-Stat'>{percent2}%</span>
        </div>
      </div>
      <div className='Pool-Stats'>
        Prize Pool
        <span className='Pool-Value'>{(parseFloat(BigInt(moneyInPool).toString()) / 1e18).toString().slice(0,7)}</span>
        <div className='Starknet-logo'>
          <CustomLogo
            src={
              num.toHex(betToken).toString().toLowerCase() ==
              ETH_ADDRESS.toLowerCase()
                ? ETH_LOGO
                : STARKNET_LOGO
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BetCard;
