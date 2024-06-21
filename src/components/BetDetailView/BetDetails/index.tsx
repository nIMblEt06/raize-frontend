import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import {
  CLOCK_ICON,
  ETH_LOGO,
  STARKNET_LOGO,
} from "@/components/helpers/icons";
import { useEffect, useState } from "react";
import { num } from "starknet";
import { ETH_ADDRESS } from "@/components/helpers/constants";
import { getNumber } from "@/components/helpers/functions";

interface Props {
  category: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
  moneyInPool: number;
  betToken: string;
}

const BetDetails: NextPage<Props> = ({
  category,
  logo,
  duration,
  heading,
  subHeading,
  moneyInPool,
  betToken,
}) => {
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [minutes, setMinutesRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const deadline = new Date(parseInt(duration)).getTime();
    const timeRemaining = deadline - currentTime;
    setHoursRemaining(new Date(timeRemaining).getHours());
    setMinutesRemaining(new Date(timeRemaining).getMinutes());
  }, [duration]);

  return (
    <Box className='BetModal-DetailsContainer'>
      <Box className='HeadingContainer'>
        <Box className='BetName'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={logo} width={30} height={30} />
          </Box>
          <span>{category}</span>
        </Box>
        <Box className='BetDuration'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={CLOCK_ICON} />
          </Box>
          <span>
            {hoursRemaining}h : {minutes}m
          </span>
        </Box>
      </Box>
      <Box className='BetDetails'>
        <span className='Heading'>{heading}</span>
        <span className='Sub-Heading'>{subHeading}</span>
      </Box>
      <Box className='BetPool'>
        Prize-Pool{" "}
        <span className='Colored'>{getNumber(moneyInPool).slice(0,7)}</span>{" "}
        <Box className='Starknet-logo'>
          <CustomLogo
            src={
              betToken &&
              num.toHex(betToken).toString().toLowerCase() ==
                ETH_ADDRESS.toLowerCase()
                ? ETH_LOGO
                : STARKNET_LOGO
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BetDetails;
