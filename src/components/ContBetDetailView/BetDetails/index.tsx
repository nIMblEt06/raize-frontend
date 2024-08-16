import { NextPage } from "next";
import "./styles.scss";
import { Box, Skeleton } from "@mui/material";
import Image from "next/image";
import { AMMA_IMAGE, FIGHTER_IMAGE } from "@/components/helpers/icons";

interface Props {
  logo: string;
  heading: string;
  subHeading: string;
}

const BetDetails: NextPage<Props> = ({
  logo,
  heading,
  subHeading,
}) => {
  return (
    <Box className='BetModal-DetailsContainer'>
      <Box className='HeadingContainer'>
        <Box className='BetName'>
          <Box className='BetDetails-Logo'>
            <Image src={AMMA_IMAGE} alt='CategoryLogo' width={30} height={30} />
          </Box>
          <Box className='BetDetails'>
            <span className='Heading'>
              {heading ? (
                "Jack Hodges vs Pete Moe"
              ) : (
                <Skeleton variant='rectangular' width={100} height={20} />
              )}
            </span>
            <span className='Sub-Heading'>
              {subHeading ? (
                "Who will be victorious?"
              ) : (
                <Skeleton variant='rectangular' width={100} height={20} />
              )}
            </span>
          </Box>
        </Box>
      </Box>
      <div className='FightImage'>
        <Image src={FIGHTER_IMAGE} width={300} height={450} alt='' />
      </div>
    </Box>
  );
};

export default BetDetails;
