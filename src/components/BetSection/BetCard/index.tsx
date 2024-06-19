import { NextPage } from "next";
import { useState } from "react";
import "./styles.scss";
import CustomLogo from "@/components/common/CustomIcons";
import { CLOCK_ICON, STARKNET_LOGO, US_LOGO } from "@/components/helpers/icons";
import BetModal from "./BetModal";

interface Props {
  name: string;
  logo: string;
  duration: string;
  heading: string;
  subHeading: string;
}

const BetCard: NextPage<Props> = ({
  name,
  logo,
  duration,
  heading,
  subHeading,
}) => {
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState<string>("yes");
  const handleSetPrediction = (prediction: string) => {
    setPrediction(prediction);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="BetCard">
      <div className="BetCard-HeadingContainer">
        <div className="BetCard-CategoryContainer">
          <div className="CategoryLogo">
            <CustomLogo src={logo} />
          </div>
          <div className="CategoryName">{name}</div>
        </div>
        <div className="Bet-Duration">
          <div className="DurationIcon">
            <CustomLogo src={CLOCK_ICON} />
          </div>
          {duration} Day
        </div>
      </div>
      <div className="BetCard-DetailsWrapper">
        <span className="Heading">{heading}</span>
        <span className="Sub-Heading">{subHeading}</span>
      </div>
      <div className="BetCard-OptionsContainer">
        <div
          onClick={() => {
            setPrediction("yes");
            handleOpen();
          }}
          className="BetCard-Option"
        >
          <span className="Green-Text">Yes</span>
          <span className="Bet-Stat">15.1%</span>
        </div>
        <div
          onClick={() => {
            setPrediction("no");
            handleOpen();
          }}
          className="BetCard-Option"
        >
          <span className="Red-Text">No</span>
          <span className="Bet-Stat">15.1%</span>
        </div>
      </div>
      <div className="Pool-Stats">
        Prize Pool
        <span className="Pool-Value">80,059</span>
        <div className="Starknet-logo">
          <CustomLogo src={STARKNET_LOGO} />
        </div>
      </div>
      <BetModal
        name={name}
        logo={logo}
        duration={duration}
        heading={heading}
        subHeading={subHeading}
        prediction={prediction}
        setPrediction={handleSetPrediction}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
};

export default BetCard;
