import { NextPage } from "next";
import "./styles.scss";
import { Box } from "@mui/material";
import CustomLogo from "@/components/common/CustomIcons";
import { CLOCK_ICON, STARKNET_LOGO } from "@/components/helpers/icons";

interface Props {
  name: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
}

const BetDetails: NextPage<Props> = ({
  name,
  logo,
  duration,
  heading,
  subHeading,
}) => {
  return (
    <Box className='BetModal-DetailsContainer'>
      <Box className='HeadingContainer'>
        <Box className='BetName'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={logo} />
          </Box>
          <span>{name}</span>
        </Box>
        <Box className='BetDuration'>
          <Box className='BetDetails-Logo'>
            <CustomLogo src={CLOCK_ICON} />
          </Box>
          <span>{duration}</span>
        </Box>
      </Box>
      <Box className='BetDetails'>
        <span className='Heading'>{heading}</span>
        <span className='Sub-Heading'>{subHeading}</span>
      </Box>
      <Box className='BetPool'>
        Prize-Pool <span className='Colored'>10000</span>{" "}
        <Box className='Starknet-logo'>
          <CustomLogo src={STARKNET_LOGO} />
        </Box>
      </Box>
    </Box>
  );
};

export default BetDetails;
